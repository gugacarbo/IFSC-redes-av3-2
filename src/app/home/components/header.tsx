import { ModeToggle } from "#/app/components/theme/mode-toggle";
import { FileUp } from "lucide-react";

function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <FileUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">IFSC - File Storage</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
export { Header };
