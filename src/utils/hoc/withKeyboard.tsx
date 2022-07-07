import React, {useEffect} from 'react';
import {Keyboard} from 'react-native';

export default function withKeyboard<T>(
  WrappedComponent: React.ComponentType<T>,
): React.FC<T> {
  const EnhancedKeyboardComponent: React.FC<T> = props => {
    useEffect(() => {
      const listener = Keyboard.addListener('keyboardDidHide', () => {
        Keyboard.dismiss();
      });

      return () => {
        listener.remove();
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return EnhancedKeyboardComponent;
}
