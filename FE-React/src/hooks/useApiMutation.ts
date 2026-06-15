// hooks/useApiMutation.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export function useApiMutation<TData, TVariables>(
  fn: (variables: TVariables) => Promise<TData>,
  invalidateKeys?: string[],
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fn,
    onSuccess: (data, variables, context, mutationContext) => {
      if (invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: invalidateKeys });
      }
      options?.onSuccess?.(data, variables, context, mutationContext);
    },
    // ...options,
  });
}
