import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DayData {
  date: string;
  intake: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { historyData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare data summary for AI
    const totalDays = historyData.length;
    const totalIntake = historyData.reduce((sum: number, day: DayData) => sum + day.intake, 0);
    const avgIntake = totalIntake / totalDays;
    const goalAchieved = historyData.filter((day: DayData) => day.intake >= 2000).length;
    const maxIntake = Math.max(...historyData.map((day: DayData) => day.intake));
    const minIntake = Math.min(...historyData.map((day: DayData) => day.intake > 0 ? day.intake : Infinity));

    const prompt = `Analisis data konsumsi air 7 hari terakhir ini dan berikan insight dalam bahasa Indonesia yang singkat dan bermanfaat (maksimal 3-4 kalimat):

Data:
- Total hari: ${totalDays}
- Rata-rata konsumsi: ${avgIntake.toFixed(0)}ml per hari
- Hari mencapai target (2000ml): ${goalAchieved} dari ${totalDays} hari
- Konsumsi tertinggi: ${maxIntake}ml
- Konsumsi terendah: ${minIntake === Infinity ? "0ml" : minIntake + "ml"}

Detail per hari:
${historyData.map((day: DayData) => `- ${day.date}: ${day.intake}ml`).join('\n')}

Berikan insight yang memotivasi dan saran praktis untuk meningkatkan konsumsi air. Gunakan emoji yang relevan.`;

    console.log("Calling AI with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Anda adalah asisten kesehatan yang membantu pengguna menganalisis kebiasaan minum air mereka. Berikan insight yang singkat, jelas, dan memotivasi."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak permintaan, coba lagi nanti." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Layanan AI memerlukan top-up kredit." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Gagal menganalisis data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content;

    if (!insight) {
      console.error("No insight generated from AI");
      return new Response(
        JSON.stringify({ error: "Tidak ada insight yang dihasilkan" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI insight generated successfully");

    return new Response(
      JSON.stringify({ insight }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-water-history:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
