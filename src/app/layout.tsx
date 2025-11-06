import "./globals.css";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "티니피니",
  description: "모두가 워렌버핏이 되는 세상!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <div className="w-full h-full bg-neutral-3 flex justify-center">
            <div className="w-[375px] h-dvh bg-neutral-7 grid grid-rows-[56px_1fr] overflow-hidden">
              {children}
            </div>
        </div>
      </body>
    </html>
  );
}
