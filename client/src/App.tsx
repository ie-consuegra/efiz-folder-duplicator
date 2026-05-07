import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import { runMacro } from "@/api/runMacro";

const queryClient = new QueryClient();

queryClient.prefetchQuery({
  queryKey: ["rootFolders"],
  queryFn: async () => {
    const response = await runMacro("getRootFolders");
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || "Error fetching root folders");
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Index />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App
