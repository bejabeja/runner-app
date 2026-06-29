export const getPaceTip = (type, weekNum, t) => {
  if (type === 'run') {
    if (weekNum <= 4) return t('timer.paceTips.runEarly');
    if (weekNum <= 6) return t('timer.paceTips.runMid');
    return t('timer.paceTips.runLate');
  }
  return ({
    walk: t('timer.paceTips.walk'),
    warmup: t('timer.paceTips.warmup'),
    cooldown: t('timer.paceTips.cooldown'),
    rest: t('timer.paceTips.rest'),
  })[type] ?? null;
};
