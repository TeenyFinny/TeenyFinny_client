import { AuthShell } from "@/components/layout/AuthShell";
import { LandingClient } from "@/app/(auth)/landing/LandingClient";

export default function Page() {
  return (
    <AuthShell>
      <LandingClient />
    </AuthShell>
  );
}
