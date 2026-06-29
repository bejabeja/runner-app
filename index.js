import { registerRootComponent } from 'expo';
import App from './App';
import { registerForegroundService, setupListeners } from './src/services/liveTimerNotification';

registerForegroundService();
setupListeners();

registerRootComponent(App);
