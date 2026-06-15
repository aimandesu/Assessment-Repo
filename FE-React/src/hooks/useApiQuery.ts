import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export function useApiQuery<T, R = T>(
  key: string[],
  fn: () => Promise<T>,
  select?: (data: T) => R,
  options?: Omit<
    UseQueryOptions<T, Error, R>,
    "queryKey" | "queryFn" | "select"
  >,
) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    select,
    ...options,
  });
}
