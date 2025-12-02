import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    // Extract origin from baseUrl to allow all subpaths
    let baseOrigin = "";
    if (baseUrl) {
      try {
        const url = new URL(baseUrl);
        baseOrigin = url.origin;
      } catch (error) {
        // If baseUrl is not a valid URL, skip origin extraction
        // This can happen if NEXT_PUBLIC_BASE_URL is not set or invalid
        console.warn("Invalid NEXT_PUBLIC_BASE_URL:", error);
      }
    }
    const connectSrc = [
      "'self'",
      "https://kauth.kakao.com",
      "https://kapi.kakao.com",
      baseUrl,
      baseOrigin, // Allow the origin explicitly to ensure subpaths work
    ]
      .filter(Boolean)
      .join(" ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              `connect-src ${connectSrc}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
