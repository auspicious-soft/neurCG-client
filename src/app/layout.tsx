'use client';
import "./style.css";
import "./globals.css";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import dp from "@/assets/images/profilepic.png";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideSideBar = ['/signup', '/login', '/forgotpassword', '/otp', '/newpassword', '/verify-email'];
  const hideHeader = ['/signup', '/login', '/forgotpassword', '/otp', '/newpassword', '/verify-email'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isAuthPage = hideSideBar.includes(pathname) || hideHeader.includes(pathname);

  return (
    <html lang="en" className={`overflow-hidden`}>
      <head>
        <title>Maity</title>
        <link rel="icon" href="/public/vercel.svg" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <SessionProvider>
        <body>
          <Toaster richColors />
          <div>
            {!hideHeader.includes(pathname) && (
              <Header
                userImage={dp}
                notificationsCount={3}
                toggleSidebar={toggleSidebar}
                isOpen={isSidebarOpen}
              />
            )}

            <div className={`flex ${!isAuthPage ? ' h-[calc(100vh-104px)] md:h-[calc(100vh-110px)]' : 'h-full !overflow-visible'} flex-col lg:flex-row lg:overflow-hidden`}>
              <div className="flex-none max-h-[calc(100vh-104px)]">
                {!hideSideBar.includes(pathname) && (
                  <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                )}
              </div>
              <main
                className={`flex-grow  ${isAuthPage ? 'p-0  auth-page-styles' : 'bg-[#F5F7FA] max-h-[calc(100vh-104px)] p-5 md:px-[35px]  md:py-[40px] overflo-custom overflow-y-auto'}`}
              >
                {children}
              </main>
            </div>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}