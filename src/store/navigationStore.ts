import create from 'zustand';

type NavigationScreen = {
  name: string;
  folder?: string;
  componentId: string;
};

type Store = {
  screens: NavigationScreen[];
  push: (newStr: NavigationScreen) => void;
  pop: () => void;
  takeUntil: (selected: NavigationScreen) => void;
  removeById: (componentId: string) => void;
};

function takeUntil(
  selectedScreen: NavigationScreen,
  screens: NavigationScreen[],
): NavigationScreen[] {
  const newScreens = [];
  for (let screen of screens) {
    newScreens.push(screen);

    if (selectedScreen.componentId === screen.componentId) {
      break;
    }
  }

  return newScreens;
}

export function findComponentIdByName(
  name: string,
  screens: NavigationScreen[],
): string | null {
  for (let screen of screens) {
    if (screen.name === name) {
      return screen.componentId;
    }
  }
  return null;
}

const navigationStore = create<Store>(set => ({
  screens: [],

  push: (newScreen: NavigationScreen) =>
    set(state => {
      state.screens.push(newScreen);
      return state;
    }),

  pop: () =>
    set(state => {
      state.screens.pop();
      return state;
    }),

  takeUntil: (selected: NavigationScreen) =>
    set(state => {
      const screens = takeUntil(selected, state.screens);
      return {...state, screens};
    }),

  removeById: componentId =>
    set(state => {
      const newScreens = state.screens.filter(
        s => s.componentId !== componentId,
      );
      return {...state, screens: newScreens};
    }),
}));

export default navigationStore;
