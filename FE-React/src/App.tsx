import { useState } from "react";
import EmployeePage from "./pages/Home/EmployeePage";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) return;
      toast.error(error.message);
    },
  }),
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <EmployeePage />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </>
  );
}

export default App;
