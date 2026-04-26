import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const { signIn, signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <Bookmark className="h-5 w-5" />
            Bookmarks
          </Link>
          <AuthLoading><span /></AuthLoading>
          <Unauthenticated>
            <Button size="sm" onClick={() => signIn("github")}>
              Sign in with GitHub
            </Button>
          </Unauthenticated>
          <Authenticated>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </Authenticated>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-2xl font-semibold">Page not found</p>
      <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block text-sm underline">
        Go home
      </Link>
    </div>
  );
}