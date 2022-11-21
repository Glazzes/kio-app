import {proxy} from 'valtio';
import {Folder} from '../shared/types';

type NavigationScreen = {
  componentId: string;
  folder: Folder;
};

type State = {
  folders: NavigationScreen[];
};

export const navigationState = proxy<State>({folders: []});

// actions
export function pushNavigationScreen(screen: NavigationScreen) {
  const isAlreadyPresent = navigationState.folders.some(
    s => s.folder.id === screen.folder.id,
  );

  if (!isAlreadyPresent) {
    navigationState.folders.push(screen);
  }
}

export function removeNavigationScreenByFolderId(id: string) {
  navigationState.folders = navigationState.folders.filter(
    s => s.folder.id !== id,
  );
}

export function peekLastNavigationScreen(): NavigationScreen {
  return navigationState.folders[navigationState.folders.length - 1];
}

export function removeLastNavigationScreen() {
  navigationState.folders.pop();
}

export function findLastByName(name: string): string {
  let componentId: string | null = null;
  for (let s of navigationState.folders) {
    if (s.folder.name === name) {
      componentId = s.componentId;
    }
  }

  if (componentId === null) {
    throw Error(`Could not find a component with name ${name}`);
  }

  return componentId;
}

export function removeByComponentId(componentId: string) {
  navigationState.folders = navigationState.folders.filter(
    s => s.componentId !== componentId,
  );
}

export function takeUntil(componentId: string) {
  const remainingScreens = [];
  for (let screen of navigationState.folders) {
    remainingScreens.push(screen);
    if (screen.componentId === componentId) {
      return;
    }
  }
}
