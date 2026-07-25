"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { verifySignupOtp } from "@/app/auth/actions";
import { KeyRound, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Adresse e-mail manquante.");
      return;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Le code doit comporter exactement 6 chiffres.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifySignupOtp(email, otp);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Redirection vers l'accueil car verifyOtp connecte l'utilisateur
        router.push("/?welcome=true");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl backdrop-blur-md">
      <CardHeader className="text-center space-y-2 pb-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-border">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-brand-light">Vérification de compte</h1>
        <p className="text-sm text-muted">
          Un code de confirmation à 6 chiffres a été envoyé à :
          <span className="block font-medium text-foreground mt-1 flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" /> {email || "votre adresse e-mail"}
          </span>
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-border text-destructive rounded-lg text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium block text-center">
              Code de confirmation (6 chiffres)
            </label>
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              required
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtp(val);
                if (error) setError("");
              }}
              className="text-center tracking-widest text-2xl font-bold font-mono h-14 bg-background/50 border-border focus:ring-ring focus:border-ring text-foreground"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full h-11 text-base">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Vérification...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Confirmer l'inscription <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
          <p className="text-xs text-muted text-center">
            Vous n'avez pas reçu le code ?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Recommencer
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[75vh]">
      <Suspense fallback={
        <Card className="w-full max-w-md shadow-xl p-8 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-rose/30 border-t-rose rounded-full animate-spin mx-auto" />
          <p className="text-muted text-sm">Chargement de la page de validation...</p>
        </Card>
      }>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
