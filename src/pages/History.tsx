import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Droplet, Calendar, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface DayHistory {
  date: string;
  dayName: string;
  intake: number;
  percentage: number;
}

const History = () => {
  const navigate = useNavigate();
  const { user, hasCompletedActivity } = useAuth();
  const [historyData, setHistoryData] = useState<DayHistory[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const dailyGoal = 2000;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!hasCompletedActivity) {
      navigate("/activity");
    }
  }, [user, hasCompletedActivity, navigate]);

  useEffect(() => {
    // Get last 7 days data
    const history = JSON.parse(localStorage.getItem("waterHistory") || "{}");
    const last7Days: DayHistory[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayName = i === 0 ? "Hari Ini" : dayNames[date.getDay()];
      
      const intake = history[dateString] || 0;
      const percentage = Math.min((intake / dailyGoal) * 100, 100);
      
      last7Days.push({
        date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        dayName,
        intake,
        percentage,
      });
    }
    
    setHistoryData(last7Days);
  }, []);

  const getAIInsight = async () => {
    setIsLoadingInsight(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-water-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            historyData: historyData.map(day => ({
              date: day.dayName + " " + day.date,
              intake: day.intake
            }))
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mendapatkan insight");
      }

      const data = await response.json();
      setAiInsight(data.insight);
    } catch (error) {
      console.error("Error getting AI insight:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mendapatkan insight AI");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
        {/* AI Insight Card */}
        {historyData.some((day) => day.intake > 0) && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsight ? (
                <div className="text-foreground whitespace-pre-line">
                  {aiInsight}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Dapatkan analisis dan rekomendasi personal dari AI
                  </p>
                  <Button
                    onClick={getAIInsight}
                    disabled={isLoadingInsight}
                    className="gap-2"
                  >
                    {isLoadingInsight ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Dapatkan Insight AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Riwayat 7 Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {historyData.map((day, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">{day.dayName}</p>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {day.intake}ml
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(day.intake / 250).toFixed(1)} gelas
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {day.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={day.percentage} className="h-2" />
                  {day.percentage >= 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      ✓ Target tercapai!
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {historyData.every((day) => day.intake === 0) && (
              <div className="text-center py-8">
                <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Belum ada riwayat konsumsi air.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mulai catat konsumsi air Anda hari ini!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default History;
