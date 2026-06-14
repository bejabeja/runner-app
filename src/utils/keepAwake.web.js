let lock = null;

export const activate = async () => {
  try {
    lock = await navigator.wakeLock?.request('screen');
  } catch {}
};

export const deactivate = () => {
  lock?.release().catch(() => {});
  lock = null;
};
