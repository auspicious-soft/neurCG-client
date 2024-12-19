import { useEffect } from 'react';

interface UseReloadProps {
    isLoading: boolean;
}

const UseReload = ({ isLoading }: UseReloadProps) => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isLoading) {
                // Modern browsers
                event.preventDefault();
                
                // // Legacy browsers
                // const message = 'Changes you made may not be saved and you might lose your credits';
                // return message;
            }
        };

        // Handle both reload and navigation attempts
        const handleUnload = (event: Event) => {
            if (isLoading) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, [isLoading]);

    return null;
};

export default UseReload;