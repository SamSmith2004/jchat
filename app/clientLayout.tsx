'use client';
import { SessionProvider } from "next-auth/react"
import useHandleStatus from "./components/status/handleStatus";
import { NotifSocket } from "@/lib/notifUtils";
import { useState, useEffect } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <SessionProvider>
      <StatusHandler>
        <NotificationHandler>
          {children}
        </NotificationHandler>
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