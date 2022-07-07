import create from 'zustand';

type NavigationScreen = {
  name: string;
  folder: string;
  componentId: string;
};

type Store = {
  screens: NavigationScreen[];
  putIfAbsent: (newStr: NavigationScreen) => void;
  pop: () => void;
  takeUntil: (selected: NavigationScreen) => void;
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

const navigationStore = create<Store>(set => ({
  screens: [],
  putIfAbsent: (newScreen: NavigationScreen) =>
    set(state => {
      const componentIds = state.screens.map(s => s.componentId);
      if (componentIds.includes(newScreen.componentId)) {
        return state;
      }

      return {...state, screens: [...state.screens, newScreen]};
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
}));

export default navigationStore;
