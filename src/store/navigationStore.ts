import {proxy} from 'valtio';
import {File} from '../shared/types';

type NavigationScreen = {
  name: string;
  folderId: string;
  componentId: string;
};

type State = {
  file: File | null;
  folders: NavigationScreen[];
};

export const navigationState = proxy<State>({folders: [], file: null});

// actions
export function pushNavigationScreen(screen: NavigationScreen) {
  navigationState.folders.push(screen);
  console.log('added');
}

export function removeNavigationScreenById(id: string) {
  navigationState.folders = navigationState.folders.filter(
    f => f.folderId !== id,
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
    if (s.name === name) {
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

// files
export function pushFile(file: File) {
  navigationState.file = file;
}

export function popFile() {
  navigationState.file = null;
}
