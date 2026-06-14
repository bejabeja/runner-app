import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
export const activate = () => activateKeepAwakeAsync().catch(() => {});
export const deactivate = () => deactivateKeepAwake();
