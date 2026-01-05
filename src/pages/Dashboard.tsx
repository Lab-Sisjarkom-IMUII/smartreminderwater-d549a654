import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User, Droplet, RotateCcw, Heart, Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasCompletedActivity } = useAuth();
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default 2L = 2000ml

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!hasCompletedActivity) {
      navigate("/activity");
    }
  }, [user, hasCompletedActivity, navigate]);

  useEffect(() => {
    // Load recommended water intake from activities
    const recommended = localStorage.getItem("recommended_water");
    if (recommended) {
      setDailyGoal(parseInt(recommended));
    }
  }, []);

  useEffect(() => {
    // Load water intake from localStorage
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("waterDate");
    const savedIntake = localStorage.getItem("waterIntake");
    
    if (savedDate === today && savedIntake) {
      setWaterIntake(parseInt(savedIntake));
    } else if (savedDate !== today) {
      // Reset if it's a new day
      localStorage.setItem("waterDate", today);
      localStorage.setItem("waterIntake", "0");
      setWaterIntake(0);
    }
  }, []);

  // Auto-reset at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem("waterDate");
      
      // If saved date is different from today, it means we've passed midnight
      if (savedDate && savedDate !== today) {
        setWaterIntake(0);
        localStorage.setItem("waterIntake", "0");
        localStorage.setItem("waterDate", today);
        toast.info("Target telah direset untuk hari baru! 🌅");
      }
    };

    // Check every minute for midnight
    const interval = setInterval(checkMidnight, 60000);

    return () => clearInterval(interval);
  }, []);

  const addWater = (amount: number) => {
    const newIntake = waterIntake + amount;
    setWaterIntake(newIntake);
    localStorage.setItem("waterIntake", newIntake.toString());
    
    // Save to history
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem("waterHistory") || "{}");
    history[today] = newIntake;
    localStorage.setItem("waterHistory", JSON.stringify(history));
    
    toast.success(`Ditambahkan ${amount}ml air`);
  };

  const resetDaily = () => {
    setWaterIntake(0);
    localStorage.setItem("waterIntake", "0");
    localStorage.setItem("waterDate", new Date().toDateString());
    toast.success("Konsumsi air hari ini direset");
  };

  if (!user) {
    return null;
  }

  const progressPercentage = Math.min((waterIntake / dailyGoal) * 100, 100);
  const glassesCount = Math.floor(waterIntake / 250); // 1 gelas = 250ml

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Halo, {user.name}! 👋
            </h1>
          </div>
        </div>

        {/* Water Tracker Card */}
        <Card className="shadow-sm border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Droplet className="h-5 w-5 text-primary" />
                Konsumsi Air Hari Ini
              </CardTitle>
              <Button 
                onClick={resetDaily} 
                variant="ghost" 
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="text-4xl font-bold text-primary">
                    {waterIntake}ml
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    dari target {dailyGoal}ml
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-foreground">
                    {glassesCount}
                  </p>
                  <p className="text-sm text-muted-foreground">gelas</p>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                {progressPercentage.toFixed(0)}% tercapai
              </p>
            </div>

            {/* Add Water Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Tambah Gelas:</p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => addWater(100)}
                  className="h-20 flex-col gap-1"
                  variant="secondary"
                >
                  <Droplet className="h-5 w-5" />
                  <span className="font-semibold">100ml</span>
                </Button>
                <Button
                  onClick={() => addWater(350)}
                  className="h-20 flex-col gap-1"
                  variant="secondary"
                >
                  <Droplet className="h-6 w-6" />
                  <span className="font-semibold">350ml</span>
                </Button>
                <Button
                  onClick={() => addWater(1000)}
                  className="h-20 flex-col gap-1"
                  variant="secondary"
                >
                  <Droplet className="h-7 w-7" />
                  <span className="font-semibold">1L</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health News Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Berita Kesehatan
          </h2>
          
          <div className="grid gap-3">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Meningkatkan Fungsi Otak
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Air membantu mengoptimalkan fungsi otak. Dehidrasi ringan saja dapat mengganggu konsentrasi, mood, dan performa kognitif Anda.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Menjaga Kesehatan Kulit
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Minum air putih yang cukup membantu menjaga kelembaban kulit, mengurangi keriput, dan membuat kulit tampak lebih segar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Detoksifikasi Alami
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Air membantu ginjal membuang racun dari tubuh. Hidrasi yang baik mendukung fungsi ginjal optimal dan kesehatan secara keseluruhan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
