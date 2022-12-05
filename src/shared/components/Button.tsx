import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';

type ButtonProps = {
  width: number;
  text: string;
  extraStyle?: ViewStyle;
  extraTextStyle?: TextStyle;
  disabled?: boolean;
  onPress: () => Promise<void>;
};

const Button: React.FC<ButtonProps> = ({
  width,
  text,
  extraStyle,
  extraTextStyle,
  disabled,
  onPress,
}) => {
  const [isPerformingAction, setIsPerformingAction] = useState<boolean>(false);

  const onPressWrapper = async () => {
    Keyboard.dismiss();

    setIsPerformingAction(true);
    await onPress();
    setIsPerformingAction(false);
  };

  return (
    <Pressable
      onPress={onPressWrapper}
      style={
        isPerformingAction || disabled
          ? [styles.button, styles.disabledButton, {width}, extraStyle]
          : [styles.button, styles.enabledButton, {width}, extraStyle]
      }>
      <Text
        style={
          isPerformingAction || disabled
            ? [styles.disabledButtonText, extraTextStyle]
            : [styles.enableButtonText, extraTextStyle]
        }>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 44,
  },
  enabledButton: {
    backgroundColor: '#3366ff',
  },
  enableButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#EDF1F7',
  },
  disabledButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
});

export default Button;
