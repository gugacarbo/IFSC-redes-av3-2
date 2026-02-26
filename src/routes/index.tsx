import { ModeToggle } from "#/app/components/theme/mode-toggle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div>
      <ModeToggle />
    </div>
  );
}
