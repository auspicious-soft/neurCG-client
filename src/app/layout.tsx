'use client';
import "./style.css";
import "./globals.css";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import dp from "@/assets/images/profilepic.png"
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();
  const hideSideBar = ['/signup', '/login', '/forgotpassword', '/otp', '/newpassword'];
  const hideHeader = ['/signup', , '/login', '/forgotpassword', '/otp', '/newpassword'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
      <html lang="en">
        <SessionProvider>
        <body className="{inter.className}">
          <Toaster richColors/>
          <div>
            {!hideHeader.includes(pathname) &&
              <Header
                userImage={dp}
                notificationsCount={3}
                toggleSidebar={toggleSidebar}
                isOpen={isSidebarOpen}
              />
            }
          </div>
          <div className="flex h-screen flex-col lg:flex-row lg:overflow-hidden">
            <div className="flex-none ">  {/*md:h-[100vh]  */}
              {/* <SideNav /> */}
              {!hideSideBar.includes(pathname) && <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
            </div>
            <main className="flex-grow md:overflow-y-auto overflo-custom bg-[#F5F7FA] p-5 md:px-[35px] md:py-[40px] ">
                {children}
            </main>
          </div>
        </body>
          </SessionProvider>
      </html>
  );
}
