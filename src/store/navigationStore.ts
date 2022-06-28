import create from 'zustand';

type NavigationScreen = {
  name: string;
  componentId: string;
};

type Store = {
  screens: NavigationScreen[];
  setScreen: (newStr: NavigationScreen) => void;
  removeUntil: (selected: NavigationScreen) => void;
};

function keepUntil(
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
  setScreen: (newScreen: NavigationScreen) =>
    set(state => set({...state, screens: [...state.screens, newScreen]})),
  removeUntil: (selected: NavigationScreen) =>
    set(state => {
      const screens = keepUntil(selected, state.screens);
      return {...state, screens};
    }),
}));

export default navigationStore;
