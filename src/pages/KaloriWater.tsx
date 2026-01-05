import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Plus, Upload, Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

interface Drink {
  id: string;
  name: string;
  caloriesPerMl: number;
  volume: number;
  totalCalories: number;
}

const popularDrinks = [
  { name: "Teh Manis", caloriesPerMl: 0.3 },
  { name: "Kopi Susu", caloriesPerMl: 0.5 },
  { name: "Jus Jeruk", caloriesPerMl: 0.45 },
  { name: "Susu Full Cream", caloriesPerMl: 0.64 },
  { name: "Soda", caloriesPerMl: 0.4 },
  { name: "Minuman Energi", caloriesPerMl: 0.45 },
];

const KaloriWater = () => {
  const navigate = useNavigate();
  const { user, hasCompletedActivity } = useAuth();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [customDrink, setCustomDrink] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [volume, setVolume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!hasCompletedActivity) {
      navigate("/activity");
    }
  }, [user, hasCompletedActivity, navigate]);

  const addDrink = () => {
    if (!volume || parseFloat(volume) <= 0) {
      toast.error("Masukkan volume yang valid");
      return;
    }

    let drinkName = "";
    let caloriesPerMl = 0;

    if (selectedDrink) {
      const drink = popularDrinks.find(d => d.name === selectedDrink);
      if (drink) {
        drinkName = drink.name;
        caloriesPerMl = drink.caloriesPerMl;
      }
    } else if (customDrink && customCalories) {
      drinkName = customDrink;
      caloriesPerMl = parseFloat(customCalories);
    } else {
      toast.error("Pilih minuman atau masukkan data custom");
      return;
    }

    const volumeNum = parseFloat(volume);
    const newDrink: Drink = {
      id: Date.now().toString(),
      name: drinkName,
      caloriesPerMl,
      volume: volumeNum,
      totalCalories: caloriesPerMl * volumeNum,
    };

    setDrinks([...drinks, newDrink]);
    setVolume("");
    setSelectedDrink("");
    setCustomDrink("");
    setCustomCalories("");
    toast.success(`${drinkName} ditambahkan!`);
  };

  const removeDrink = (id: string) => {
    setDrinks(drinks.filter(d => d.id !== id));
    toast.success("Minuman dihapus");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("File harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-drink', {
        body: { imageBase64 }
      });

      if (error) throw error;

      if (data.success && data.data) {
        const result = data.data;
        const newDrink: Drink = {
          id: Date.now().toString(),
          name: result.drinkName,
          caloriesPerMl: result.caloriesPerMl,
          volume: result.volume,
          totalCalories: result.totalCalories,
        };
        setDrinks([...drinks, newDrink]);
        toast.success(`${result.drinkName} terdeteksi! (Confidence: ${result.confidence}%)`);
        if (result.notes) {
          toast.info(result.notes);
        }
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error("Gagal menganalisis gambar. Coba lagi.");
    } finally {
      setIsAnalyzing(false);
      setUploadedImage(null);
    }
  };

  const totalCalories = drinks.reduce((sum, drink) => sum + drink.totalCalories, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Kalkulator Kalori Minuman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Image Analysis */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Scan Minuman dengan AI
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="Preview" className="max-h-48 mx-auto rounded" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload foto minuman untuk deteksi otomatis kalori
                    </p>
                  </>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isAnalyzing}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Atau input manual</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pilih Minuman Populer</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedDrink}
                  onChange={(e) => {
                    setSelectedDrink(e.target.value);
                    setCustomDrink("");
                    setCustomCalories("");
                  }}
                >
                  <option value="">-- Pilih Minuman --</option>
                  {popularDrinks.map(drink => (
                    <option key={drink.name} value={drink.name}>
                      {drink.name} ({drink.caloriesPerMl} kal/ml)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Atau Minuman Custom</Label>
                <Input
                  placeholder="Nama minuman"
                  value={customDrink}
                  onChange={(e) => {
                    setCustomDrink(e.target.value);
                    setSelectedDrink("");
                  }}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Kalori per ml"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  disabled={!customDrink}
                />
              </div>

              <div className="space-y-2">
                <Label>Volume (ml)</Label>
                <Input
                  type="number"
                  placeholder="Masukkan volume dalam ml"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>

              <Button onClick={addDrink} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Minuman
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drinks List */}
        {drinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Minuman Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drinks.map(drink => (
                <div key={drink.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{drink.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {drink.volume}ml × {drink.caloriesPerMl} kal/ml = {drink.totalCalories.toFixed(1)} kal
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDrink(drink.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Kalori</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalCalories.toFixed(1)} kal
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default KaloriWater;
