import { KeyboardControlsWrapper } from "@/game/Controls";
import "../index.css";

import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    return (
      <KeyboardControlsWrapper>
        <Outlet />
      </KeyboardControlsWrapper>
    );
  },
});
