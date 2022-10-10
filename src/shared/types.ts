// File
export type File = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  isFavorite: boolean;
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
