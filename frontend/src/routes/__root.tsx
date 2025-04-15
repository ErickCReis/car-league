import { Toaster } from "@/components/ui/sonner";
import "../index.css";

import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <Outlet />
    </>
  ),
});
