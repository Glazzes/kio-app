import React, {createContext} from 'react';

type NavigationContextProps = {
  componentId: string;
};

const Context = createContext<string>('');

const NavigationProvider: React.FC<NavigationContextProps> = ({
  componentId,
  children,
}) => {
  return <Context.Provider value={componentId}>{children}</Context.Provider>;
};

export {NavigationProvider, Context};
