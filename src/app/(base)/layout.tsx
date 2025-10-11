"use client";
import Header from "@/components/layout/header";
import MainSidebar from "@/components/layout/sidebar-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import WithAuthClient from "@/components/with-auth/with-auth";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <SidebarProvider
      style={{
        ["--sidebar-width" as string]: "18rem",
      }}
    >
      <AppWithMe>{children}</AppWithMe>
    </SidebarProvider>
  );
}
function AppWithMe({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 w-full">
        <div className="flex h-screen overflow-hidden w-full">
          <MainSidebar />
          <div className="flex-1 overflow-auto w-full">
            <Header />
            <div className="max-w-full mx-auto space-y-8 p-4">
              {/* <WithAuthClient> */}
              <Suspense>{children}</Suspense>
              <Toaster richColors position="top-center" />
              {/* </WithAuthClient> */}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
