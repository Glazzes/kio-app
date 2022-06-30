import create from 'zustand';

type NavigationScreen = {
  name: string;
  folder: string;
  componentId: string;
};

type Store = {
  screens: NavigationScreen[];
  push: (newStr: NavigationScreen) => void;
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

  return screens;
}

const navigationStore = create<Store>(set => ({
  screens: [],
  push: (newScreen: NavigationScreen) =>
    set(state => set({...state, screens: [...state.screens, newScreen]})),
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
