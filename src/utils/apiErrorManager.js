const errorFlags = {
  suspended401: false,
  forbidden403: false,
  server500: false,
  otherErrors: false,
  networkError: false,
  unknownError: false,
};

export const shouldShowError = (key) => !errorFlags[key];

export const markErrorShown = (key) => {
  errorFlags[key] = true;
};

export const resetAllErrors = () => {
  Object.keys(errorFlags).forEach((key) => {
    errorFlags[key] = false;
  });
};
