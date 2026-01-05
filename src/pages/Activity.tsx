import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  PersonStanding, 
  Wind, 
  Bike, 
  Waves, 
  Footprints,
  Home,
  Briefcase,
  Bed,
  Activity as ActivityIcon
} from "lucide-react";
import { toast } from "sonner";

interface ActivityItem {
  id: string;
  name: string;
  icon: any;
  waterMultiplier: number; // multiplier for base water intake
  category: "indoor" | "outdoor" | "daily";
}

const activities: ActivityItem[] = [
  // Indoor Sports
  { id: "gym", name: "Gym/Fitness", icon: Dumbbell, waterMultiplier: 1.5, category: "indoor" },
  { id: "yoga", name: "Yoga", icon: PersonStanding, waterMultiplier: 1.2, category: "indoor" },
  { id: "pilates", name: "Pilates", icon: Wind, waterMultiplier: 1.3, category: "indoor" },
  { id: "indoor-cycling", name: "Cycling Indoor", icon: Bike, waterMultiplier: 1.4, category: "indoor" },
  
  // Outdoor Sports
  { id: "running", name: "Lari", icon: Footprints, waterMultiplier: 1.7, category: "outdoor" },
  { id: "cycling", name: "Bersepeda", icon: Bike, waterMultiplier: 1.6, category: "outdoor" },
  { id: "swimming", name: "Berenang", icon: Waves, waterMultiplier: 1.8, category: "outdoor" },
  { id: "hiking", name: "Hiking", icon: Footprints, waterMultiplier: 1.9, category: "outdoor" },
  
  // Daily Activities
  { id: "office-work", name: "Kerja Kantor", icon: Briefcase, waterMultiplier: 1.0, category: "daily" },
  { id: "light-activity", name: "Aktivitas Ringan", icon: Home, waterMultiplier: 1.1, category: "daily" },
  { id: "resting", name: "Istirahat", icon: Bed, waterMultiplier: 0.8, category: "daily" },
  { id: "active-work", name: "Pekerjaan Aktif", icon: ActivityIcon, waterMultiplier: 1.4, category: "daily" },
];

const Activity = () => {
  const navigate = useNavigate();
  const { user, setActivityCompleted } = useAuth();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load saved activities
    const saved = localStorage.getItem("user_activities");
    if (saved) {
      setSelectedActivities(JSON.parse(saved));
    }
  }, [user, navigate]);

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => {
      const newActivities = prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      
      localStorage.setItem("user_activities", JSON.stringify(newActivities));
      
      // Calculate total water multiplier
      const totalMultiplier = newActivities.reduce((sum, id) => {
        const activity = activities.find(a => a.id === id);
        return sum + (activity?.waterMultiplier || 0);
      }, 0);
      
      // Calculate recommended water intake (base 2000ml * average multiplier)
      const avgMultiplier = totalMultiplier / (newActivities.length || 1);
      const recommendedWater = Math.round(2000 * avgMultiplier);
      localStorage.setItem("recommended_water", recommendedWater.toString());
      
      return newActivities;
    });
  };

  const saveActivities = () => {
    setActivityCompleted();
    toast.success("Aktivitas berhasil disimpan!");
    navigate("/dashboard");
  };

  if (!user) return null;

  const indoorActivities = activities.filter(a => a.category === "indoor");
  const outdoorActivities = activities.filter(a => a.category === "outdoor");
  const dailyActivities = activities.filter(a => a.category === "daily");

  const totalMultiplier = selectedActivities.reduce((sum, id) => {
    const activity = activities.find(a => a.id === id);
    return sum + (activity?.waterMultiplier || 0);
  }, 0);
  const avgMultiplier = totalMultiplier / (selectedActivities.length || 1);
  const recommendedWater = Math.round(2000 * avgMultiplier);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Aktivitas Harian</h1>
          <p className="text-muted-foreground">
            Pilih aktivitas yang Anda lakukan hari ini untuk mendapatkan rekomendasi air minum yang lebih akurat
          </p>
        </div>

        {/* Indoor Sports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Olahraga Indoor
            </CardTitle>
            <CardDescription>
              Aktivitas olahraga yang dilakukan di dalam ruangan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {indoorActivities.map(activity => {
                const Icon = activity.icon;
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <Button
                    key={activity.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{activity.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      +{Math.round((activity.waterMultiplier - 1) * 100)}% air
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Outdoor Sports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5" />
              Olahraga Outdoor
            </CardTitle>
            <CardDescription>
              Aktivitas olahraga yang dilakukan di luar ruangan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {outdoorActivities.map(activity => {
                const Icon = activity.icon;
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <Button
                    key={activity.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{activity.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      +{Math.round((activity.waterMultiplier - 1) * 100)}% air
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Activities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Aktivitas Harian
            </CardTitle>
            <CardDescription>
              Aktivitas rutin sehari-hari Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {dailyActivities.map(activity => {
                const Icon = activity.icon;
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <Button
                    key={activity.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{activity.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.waterMultiplier < 1 
                        ? `${Math.round((1 - activity.waterMultiplier) * 100)}% air`
                        : `+${Math.round((activity.waterMultiplier - 1) * 100)}% air`
                      }
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedActivities.length > 0 && (
          <Card className="mb-6 border-primary">
            <CardHeader>
              <CardTitle>Rekomendasi Air Minum</CardTitle>
              <CardDescription>
                Berdasarkan {selectedActivities.length} aktivitas yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {recommendedWater} ml
                </div>
                <p className="text-muted-foreground">
                  Target air minum harian Anda
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          className="w-full" 
          size="lg"
          onClick={saveActivities}
          disabled={selectedActivities.length === 0}
        >
          Simpan Aktivitas
        </Button>
      </div>
    </div>
  );
};

export default Activity;
