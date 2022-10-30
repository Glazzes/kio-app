// File
export type File = {
  id: string;
  name: string;
  size: number;
  isFavorite: boolean;
  contentType: string;
  createdAt: string;
  lastModified: string;
  details: FileDetails;
};

export type FileDetails = {
  dimensions: string | null;
  duration: string | null;
  audioSamples: number[] | null;
  pages: string | null;
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

// miscelaneous
export type Dimension = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type ImageStyle = {
  width: number | undefined;
  maxWidth: number | undefined;
  height: number | undefined;
  maxHeight: number | undefined;
  aspectRatio: number;
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
