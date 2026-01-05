import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Selamat Datang
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Aplikasi modern pengingat minum harian
        </p>
        <div className="flex gap-4 justify-center mt-8">
          {user ? (
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Buka Dashboard
            </Button>
          ) : (
            <Button size="lg" onClick={() => navigate("/login")}>
              Mulai Sekarang
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
