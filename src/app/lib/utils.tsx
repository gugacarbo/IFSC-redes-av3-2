import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (date: Date | string) => {
  const date_ = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date_);
};

export const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    case "image":
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    case "video":
      return <VideoIcon className="h-5 w-5 text-blue-500" />;
    case "audio":
      return <MusicIcon className="h-5 w-5 text-green-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-gray-500" />;
  }
};
