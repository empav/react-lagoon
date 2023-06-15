export const showSpinner = () => {
  !document.body.classList.contains('no-spinner') &&
    document.body.classList.add('spinner');
};

export const hideSpinner = () => {
  setTimeout(() => {
    document.body.classList.remove('spinner');
  }, 700);
};
