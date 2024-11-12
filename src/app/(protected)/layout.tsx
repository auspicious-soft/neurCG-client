import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from "./loading";


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    if (!session) {
        redirect('/login')
    }
    return (
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    );
}
