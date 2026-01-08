"use client";

import dynamic from "next/dynamic";

// Dynamically import the main app component to avoid SSR issues with react-dnd
const MainApp = dynamic(() => import("@/components/MainApp"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return <MainApp />;
}
