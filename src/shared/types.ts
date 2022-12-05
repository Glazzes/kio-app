// File
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

type FileDetails = {
  dimensions: [number, number] | null;
  duration: number | null;
  audioSamples: number[] | null;
  pages: string | null;
};

export enum FileVisibility {
  OWNER = 'OWNER',
  RESTRICTED = 'RESTRICTED',
  PUBLIC = 'PUBLIC',
}

export type UserExists = {
  existsByUsername: boolean;
  existsByEmail: boolean;
};

export type User = {
  id: string;
  username: string;
  email: string;
  hasProfilePicture: boolean;
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

export type EditResourceRequest = {
  from: string;
  resourceId: string;
  name: string;
  visibility: FileVisibility;
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
