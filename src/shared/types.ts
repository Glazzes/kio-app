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
