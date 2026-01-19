import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Visas and Immigration - GOV.UK",
  description: "Apply for a UK visa",
};

export default function MockFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Source Sans 3", Arial, sans-serif',
          backgroundColor: "#fff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
