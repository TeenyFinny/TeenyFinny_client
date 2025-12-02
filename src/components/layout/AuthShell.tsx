"use client";

import React from "react";

type AuthShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="w-full h-full bg-primary-4 flex justify-center">
      <div className="w-[375px] h-dvh bg-primary-4 grid grid-rows-[44px_1fr] overflow-hidden">
        <div className="w-full h-[44px] relative">
          <img
            src="/images/common/illust_common_status_bar.png"
            alt="status bar"
            className="w-full h-full object-cover"
          />
        </div>
        <section className="w-full flex justify-center overflow-y-auto">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </div>
  );
}

