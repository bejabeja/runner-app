import { Alert, Platform } from 'react-native';

export const confirm = (title, message, onConfirm, options = {}) => {
  const { cancelText = 'Cancel', confirmText = 'OK', destructive = false } = options;
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
};
