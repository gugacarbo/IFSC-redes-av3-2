export type FileType = {
  id: number;
  fileName: string;
  hash: string;
  size: number;
  path: string;
  type: string;
  createdAt: Date | string;
};
