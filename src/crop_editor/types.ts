export type Resize = {
  width: number;
  height: number;
};

export type CropPoint = {
  originX: number;
  originY: number;
  resize: Resize;
};
