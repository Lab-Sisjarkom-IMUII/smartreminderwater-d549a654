import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: any;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [useManualLogin, setUseManualLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/activity");
      return;
    }

    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '963133734471-998nut0sl04ngcq8ovjqoa00pttlkti4.apps.googleusercontent.com', // User needs to replace this
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: 280,
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user, navigate]);

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode JWT token
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      
      const userData = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      login(userData);
      toast.success(`Selamat datang, ${userData.name}!`);
      navigate("/activity");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Gagal login. Silakan coba lagi.");
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const existingUser = users.find((u: any) => u.email === email);

    if (!existingUser) {
      toast.error("Email tidak terdaftar. Silakan registrasi terlebih dahulu.");
      return;
    }

    if (existingUser.password !== password) {
      toast.error("Password salah");
      return;
    }

    const userData = {
      name: existingUser.name,
      email: existingUser.email,
    };

    login(userData);
    toast.success(`Selamat datang, ${userData.name}!`);
    navigate("/activity");
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name || !confirmPassword) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      toast.error("Email sudah terdaftar. Silakan login.");
      return;
    }

    // Save new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(users));

    // Auto-login after successful registration
    const userData = { name, email };
    login(userData);
    toast.success(`Registrasi berhasil! Selamat datang, ${name}!`);
    navigate("/activity");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {isRegistering ? "Daftar Akun" : "Selamat Datang"}
          </CardTitle>
          <CardDescription className="text-base">
            {isRegistering ? "Buat akun baru untuk memulai" : "Silakan login untuk melanjutkan"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          {!useManualLogin ? (
            <>
              <div id="google-signin-button" className="w-full flex justify-center"></div>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Atau</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setUseManualLogin(true);
                  setIsRegistering(false);
                }}
              >
                Login dengan Email
              </Button>
            </>
          ) : (
            <>
              <form onSubmit={isRegistering ? handleRegistration : handleManualLogin} className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isRegistering ? "Minimal 6 karakter" : "Masukkan password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isRegistering && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Masukkan ulang password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {isRegistering ? "Daftar" : "Login"}
                </Button>
              </form>

              <div className="w-full text-center">
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                >
                  {isRegistering ? "Sudah punya akun? Login di sini" : "Belum punya akun? Daftar di sini"}
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setUseManualLogin(false);
                  setIsRegistering(false);
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                Kembali ke Google Login
              </Button>
            </>
          )}
          
          <div className="text-sm text-muted-foreground text-center">
            <p>Dengan login, Anda menyetujui</p>
            <p>Syarat & Ketentuan kami</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
