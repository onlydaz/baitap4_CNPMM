import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback, hasMore, loading) => {
    const isLoadingRef = useRef(false);

    const handleScroll = () => {
        if (loading || isLoadingRef.current || !hasMore) return;

        if (window.innerHeight + document.documentElement.scrollTop 
            >= document.documentElement.offsetHeight - 1000) {
            isLoadingRef.current = true;
            callback().finally(() => {
                isLoadingRef.current = false;
            });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [callback, hasMore, loading]);

    return { isLoading: isLoadingRef.current };
};

export default useInfiniteScroll;
