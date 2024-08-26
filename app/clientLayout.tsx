'use client';

import { SessionProvider } from "next-auth/react"
import useHandleStatus from "./components/status/handleStatus";
import { NotifSocket } from "@/lib/notifUtils";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <StatusHandler>
        <NotificationHandler>{children}</NotificationHandler>
        </StatusHandler>
    </SessionProvider>
  );
}

function StatusHandler({ children }: { children: React.ReactNode }) {
  useHandleStatus();
  return <>{children}</>;
}

function NotificationHandler({ children }: { children: React.ReactNode }) {
  NotifSocket();
  return <>{children}</>;
}