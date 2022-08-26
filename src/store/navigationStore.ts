import {proxy} from 'valtio';

type NavigationScreen = {
  name: string;
  componentId: string;
};

type State = {
  screens: NavigationScreen[];
};

export const navigationState = proxy<State>({screens: []});

// actions
export function push(screen: NavigationScreen) {
  navigationState.screens.push(screen);
}

export function peekLast(): NavigationScreen {
  return navigationState.screens[navigationState.screens.length - 1];
}

export function removeLast() {
  navigationState.screens.pop();
}

export function findLastByName(name: string): string {
  let componentId: string | null = null;
  for (let s of navigationState.screens) {
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
  navigationState.screens = navigationState.screens.filter(
    s => s.componentId !== componentId,
  );
}

export function takeUntil(componentId: string) {
  const remainingScreens = [];
  for (let screen of navigationState.screens) {
    remainingScreens.push(screen);
    if (screen.componentId === componentId) {
      return;
    }
  }
}
