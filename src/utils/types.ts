export type FileMetadata = {
  ownerId: string;
  createdAt: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
};

type FileDetails = {
  dimensions: string | null;
  pages: number | null;
  duration: number | null;
};

export type File = {
  id: string;
  name: string;
  size: number;
  contentType: string;
  details: FileDetails;
  createdAt: string;
  lastModified: string;
};

export type Folder = {
  id: string;
  name: string;
  color: string;
  metadata: FileMetadata;
};

export type Styles = {
  width?: number | undefined;
  maxWidth?: number | undefined;
  height?: number | undefined;
  maxHeight?: number | undefined;
  aspectRatio?: number;
};

export type Dim = {
  width: number;
  height: number;
};

export type AnimatedButton = {
  icon: string;
  angle: number;
};
