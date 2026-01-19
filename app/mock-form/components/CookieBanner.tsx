"use client";

import { useState } from "react";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        backgroundColor: "#f3f2f1",
        borderBottom: "1px solid #b1b4b6",
        padding: "20px 0",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 15px" }}>
        <h2
          style={{
            fontSize: "19px",
            fontWeight: 700,
            margin: "0 0 15px 0",
            color: "#0b0c0c",
          }}
        >
          Cookies on UK Visas and Immigration services
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.5,
            margin: "0 0 10px 0",
            color: "#0b0c0c",
          }}
        >
          We use some essential cookies to make this service work.
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.5,
            margin: "0 0 15px 0",
            color: "#0b0c0c",
          }}
        >
          We use analytics and marketing cookies to understand how you use this
          service, make improvements and improve the relevancy of advertising
          campaigns you receive in social channels and other online platforms,
          such as Google.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setDismissed(true)}
            style={{
              backgroundColor: "#00703c",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 0 #002d18",
            }}
          >
            Accept all
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{
              backgroundColor: "#00703c",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 0 #002d18",
            }}
          >
            Reject all
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{
              backgroundColor: "transparent",
              color: "#1d70b8",
              border: "none",
              padding: "8px 15px",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            View cookies
          </button>
        </div>
      </div>
    </div>
  );
}
