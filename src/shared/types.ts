// File
export enum FileVisibility {
  OWNER,
  RESTRICTED,
  PUBLIC,
}

type FileDetails = {
  dimensions: [number, number] | null;
  duration: number | null;
  audioSamples: number[] | null;
  pages: string | null;
};

export type File = {
  id: string;
  ownerId: string;
  name: string;
  size: number;
  isFavorite: boolean;
  contentType: string;
  createdAt: string;
  lastModified: string;
  visibility: FileVisibility;
  details: FileDetails;
};

export type Folder = {
  id: string;
  ownerId: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  lastModified: string;
  visibility: FileVisibility;
  summary: FolderSummary;
};

export type UploadRequest = {
  to: string;
  details: {
    [name: string]: {
      dimensions: [number, number] | null;
      duration: number | null;
      thumbnailName: string | null;
    };
  };
};

type FolderSummary = {
  files: number;
  folders: number;
  size: number;
};

export type Page<T> = {
  content: T;
  last: boolean;
  pageNumber: number;
  totalPages: number;
};

export type FileMetadata = {
  width: number | undefined;
  height: number | undefined;
  duration: number | undefined;
  pages: number | undefined;
  thumbnail: number | undefined; // pdf only, does not apply to videos
};

//request
export type CopyRequest = {
  from: string;
  to: string;
  items: string[];
};

// miscelaneous
export type Dimension = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type UnitSize = {
  capacity: number;
  used: number;
};

export type SharedTransitionInfo = {
  componentId: string;
  componentName?: string;
  fromId: string;
  toId: string;
  duration?: number;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
