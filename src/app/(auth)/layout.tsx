// app/(auth)/layout.tsx
import { AuthShell } from "@/components/layout/AuthShell";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthShell>{children}</AuthShell>;
}
