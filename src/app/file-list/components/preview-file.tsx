import { Download, File, FileText, Video } from "lucide-react";
import { Button } from "#/app/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/app/components/ui/dialog";
import type { FileType } from "#/db/schema";
import { formatDate, formatFileSize, getFileType } from "#/lib/utils";

function PreviewFile({ file, close }: { file: FileType; close: () => void }) {
	const filetype = getFileType(file.path);
	return (
		<Dialog open={!!file} onOpenChange={close}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{file.fileName}</DialogTitle>
				</DialogHeader>

				<div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
					{filetype === "image" ? (
						<img
							src={file.path}
							alt={file.fileName}
							className="max-w-full h-auto rounded-md"
						/>
					) : filetype === "pdf" ? (
						<div className="flex flex-col items-center justify-center h-96">
							<FileText className="h-16 w-16 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								Visualização de PDF não disponível. Clique em Download para
								abrir o arquivo.
							</p>
						</div>
					) : filetype === "video" ? (
						<div className="flex flex-col items-center justify-center h-96">
							<Video className="h-16 w-16 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								Visualização de vídeo não disponível. Clique em Download para
								abrir o arquivo.
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-96">
							<File className="h-16 w-16 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">
								Visualização não disponível para este tipo de arquivo.
							</p>
						</div>
					)}
				</div>

				<DialogFooter className="flex items-center justify-between ">
					<div className="text-sm text-muted-foreground">
						{formatFileSize(file.size)} • {formatDate(file.createdAt)}
					</div>
					<Button>
						<Download className="h-4 w-4 mr-2" />
						Download
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
export { PreviewFile };
