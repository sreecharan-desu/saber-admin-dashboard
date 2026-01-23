import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Treat data as fresh long enough to avoid unnecessary refetches
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Keep inactive queries in memory without ballooning RAM
      gcTime: 1000 * 60 * 20, // 20 minutes (slightly tighter than 30)

      // Retry only for transient failures
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },

      // Prevent noisy background refetching
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,

      // Avoid UI thrash on quick re-renders (Default in v5)
      // notifyOnChangeProps: 'tracked',

      // keepPreviousData is removed in v5. Use `placeholderData: keepPreviousData` in individual useQuery calls if needed.
    },

    mutations: {
      // Mutations should fail fast and be retried carefully
      retry: 1,
    },
  },
});
