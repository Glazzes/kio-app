export type FabActionIcon = 'file' | 'camera' | 'account' | 'folder';

export type FabAction = {
  icon: FabActionIcon;
  angle: number;
};

export type DocumentPickResult = {
  mimeType: string;
  name: string;
  size: number;
  type: string;
  uri: string;
};
