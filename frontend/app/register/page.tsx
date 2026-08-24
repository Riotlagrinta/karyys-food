import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import React from "react";
import { UserPlus } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-brand-rose/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-border/80 shadow-xl bg-card/90 backdrop-blur-md rounded-3xl overflow-hidden">
        <form action={signup}>
          <CardHeader className="text-center pb-4 pt-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-brand-rose text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <UserPlus className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Rejoignez Karyy&apos;s Food pour commander en toute simplicité.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 px-6 sm:px-8">
            {message && (
              <div className="bg-primary/10 text-primary p-3 rounded-2xl text-xs sm:text-sm text-center border border-primary/20">
                {message}
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="full_name" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Nom complet
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Ex: Karyy Doe"
                required
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Adresse e-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                required
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone_number" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Numéro de téléphone
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="+228 90 00 00 00"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="rounded-2xl"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full rounded-full py-6 text-base font-bold shadow-md bg-gradient-to-r from-primary to-brand-brown-light text-white hover:opacity-95"
            >
              S&apos;inscrire
            </Button>
            <p className="text-xs sm:text-sm text-muted text-center">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
