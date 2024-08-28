'use client';
import { SessionProvider } from "next-auth/react"
import useHandleStatus from "./components/status/handleStatus";
import { NotifSocket } from "@/lib/notifUtils";
import { ThemeProvider } from "@/app/components/theme/themeProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <StatusHandler>
          <NotificationHandler>
            {children}
          </NotificationHandler>
        </StatusHandler>
      </ThemeProvider>
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
