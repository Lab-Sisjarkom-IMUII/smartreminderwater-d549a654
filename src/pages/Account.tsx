import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, hasCompletedActivity } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!hasCompletedActivity) {
      navigate("/activity");
    }
  }, [user, hasCompletedActivity, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil logout");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profil Saya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Account;
