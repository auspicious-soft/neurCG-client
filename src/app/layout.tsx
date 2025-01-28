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
import Providers from "./(website)/components/ProgressBarProvider";
import AnalyticsProvider from "@/providers/analytics-wrapper";

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
          // id="adsbygoogle-init"   
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onError={(e) => console.error('Script failed to load', e)}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </head>
      <SessionProvider>
        <body>
          <Toaster richColors />
          <AnalyticsProvider>
            <div>
              {!hideHeader.includes(pathname) && (
                <Header
                  userImage={dp}
                  notificationsCount={3}
                  toggleSidebar={toggleSidebar}
                  isOpen={isSidebarOpen}
                />
              )}

              <div className={`flex ${!isAuthPage ? '!h-[calc(100vh-104px)] !md:h-[calc(100vh-110px)]' : '!overflow-auto h-screen'} flex-col lg:flex-row lg:overflow-hidden overflo-custom `}>
                <div className="flex-none max-h-[calc(100vh-104px)]">
                  {!hideSideBar.includes(pathname) && (
                    <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                  )}
                </div>
                <main className={`flex-grow ${isAuthPage ? 'p-0  auth-page-styles' : 'bg-[#F5F7FA] max-h-[calc(100vh-104px)] min-h-[100%] p-5 md:px-[35px]  md:py-[40px] overflo-custom overflow-y-auto'}`}>
                  <Providers>
                    {children}
                  </Providers>
                </main>
              </div>
            </div>
          </AnalyticsProvider>

        </body>
      </SessionProvider>
    </html >
  );
}