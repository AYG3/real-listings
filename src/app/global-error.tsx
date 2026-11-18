"use client";

import { brand } from "@/lib/brand";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.ivory50,
          color: brand.colors.ink900,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: brand.colors.forest700,
            }}
          >
            Alara Estate
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 32, lineHeight: 1.15 }}>
            The app failed to start
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: brand.colors.ink700 }}>
            This is a full-page failure. Retry, and if it persists the service
            may be temporarily unavailable.
          </p>
          {error.digest ? (
            <p style={{ margin: "16px 0 0", fontSize: 12, color: brand.colors.muted500 }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 28,
              height: 44,
              padding: "0 20px",
              borderRadius: 8,
              border: "none",
              background: brand.colors.forest700,
              color: brand.colors.white,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
