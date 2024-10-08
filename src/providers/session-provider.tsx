import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface ProviderInterface {
    children: React.ReactNode;
}

export const SessionProviderWrapper = async (props: ProviderInterface) => {
    const { children } = props;
    const session = await auth()
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}