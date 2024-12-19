import { useEffect } from 'react';

interface UseReloadProps {
    isLoading: boolean;
    onBeforeUnload?: () => Promise<void>;
}

const UseReload = ({ isLoading, onBeforeUnload }: UseReloadProps) => {
    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            if (isLoading) {
                onBeforeUnload && await onBeforeUnload();
            }
        }

        const handleUnload = async () => {
            // if (isLoading && onBeforeUnload) {
            //     await onBeforeUnload()
            // }
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        window.addEventListener("pagehide", handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
            window.removeEventListener("pagehide", handleUnload);
        }
    }, [isLoading, onBeforeUnload])

    return null;
};

export default UseReload;
