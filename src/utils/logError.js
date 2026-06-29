export const logError = (context, err) => {
  if (__DEV__) console.warn(`[${context}]`, err);
};
