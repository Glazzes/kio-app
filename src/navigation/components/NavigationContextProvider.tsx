import React, {createContext} from 'react';
import {Folder} from '../../shared/types';

type Context = {
  componentId: string;
  folder?: Folder;
};

const NavigationContext = createContext<Context>({} as Context);

const NavigationProvider: React.FC<Context> = ({
  componentId,
  folder,
  children,
}) => {
  return (
    <NavigationContext.Provider value={{componentId, folder}}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
export {NavigationContext};
