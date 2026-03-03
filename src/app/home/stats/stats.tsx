import { Card } from "#/app/components/ui/card";
import { formatFileSize } from "#/app/lib/utils";
import { FileIcon, FileUp, Upload } from "lucide-react";
import type { FileType } from "#/db/schema"

function Stats({ files }: { files: FileType[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Arquivos Totais</p>
            <p className="text-2xl font-bold">{files.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <FileIcon className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Espaço Utilizado</p>
            <p className="text-2xl font-bold">
              {formatFileSize(
                files.reduce((total, file) => total + file.size, 0)
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Uploads Hoje</p>
            <p className="text-2xl font-bold">
              {
                files.filter(
                  (file) =>
                    new Date(file.createdAt).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
export { Stats };
