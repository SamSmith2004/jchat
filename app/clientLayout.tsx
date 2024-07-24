'use client';

import { SessionProvider } from "next-auth/react"
import useHandleStatus from "./components/status/handleStatus";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <StatusHandler>{children}</StatusHandler>
    </SessionProvider>
  );
}

function StatusHandler({ children }: { children: React.ReactNode }) {
  useHandleStatus();
  return <>{children}</>;
}