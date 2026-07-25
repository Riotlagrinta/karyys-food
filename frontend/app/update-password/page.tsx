import { updatePassword } from "@/app/auth/actions";
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
import React from "react";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <Card className="w-full max-w-md">
        <form action={updatePassword}>
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-brand-light">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription>
              Veuillez entrer votre nouveau mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <div className="bg-primary/10 text-primary p-3 rounded-xl text-sm text-center border border-border">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Nouveau mot de passe
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
              Mettre à jour
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
