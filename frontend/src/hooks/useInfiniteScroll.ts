import { useEffect } from "react";

const useInfiniteScroll = (
  fetchMore: () => void,
  isFetching: boolean,
  hasMore: boolean
) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight ||
        isFetching ||
        !hasMore
      ) {
        return;
      }
      fetchMore();
    };

    const checkInitialContentHeight = () => {
      if (
        document.documentElement.offsetHeight <= window.innerHeight &&
        !isFetching &&
        hasMore
      ) {
        fetchMore();
      }
    };

    const rafId = requestAnimationFrame(() => {
      checkInitialContentHeight();
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [fetchMore, isFetching, hasMore]);
};

export default useInfiniteScroll;
