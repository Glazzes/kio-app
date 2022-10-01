import React, {createContext} from 'react';

type NavigationContextProps = {
  componentId: string;
};

const NavigationContext = createContext<string>('');

const NavigationProvider: React.FC<NavigationContextProps> = ({
  componentId,
  children,
}) => {
  return (
    <NavigationContext.Provider value={componentId}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
export {NavigationContext};
