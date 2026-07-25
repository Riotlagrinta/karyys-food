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

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <Card className="w-full max-w-md">
        <form action={signup}>
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-brand-light">
              Créer un compte
            </CardTitle>
            <CardDescription>
              Rejoignez Karyy's Food pour commander vos plats préférés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className="bg-primary/10 text-primary p-3 rounded-xl text-sm text-center border border-border">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium">
                Nom complet
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Ex: Karyy Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Adresse e-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone_number" className="text-sm font-medium">
                Numéro de téléphone
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="+228 90 00 00 00"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
            <p className="text-sm text-muted text-center">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
