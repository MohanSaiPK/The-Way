// src/utils/navigateHelper.js
let navigator = null;

export const setNavigator = (navFn) => {
  navigator = navFn;
};

export const navigateTo = (path) => {
  if (navigator) navigator(path);
};
