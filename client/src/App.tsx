import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { MonthProvider } from "@/contexts/month-context";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Home} />
      <Route path="/expenses" component={Home} />
      <Route path="/summary" component={Home} />
      <Route path="/investments" component={Home} />
      <Route path="/savings" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MonthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </MonthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
