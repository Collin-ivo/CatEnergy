const mobileMenuController = () => {
  const menuToggle = document.querySelector(`.page-header__mobile-toggle`);
  const menuList = document.querySelector(`.main-nav__list`);

  menuToggle.classList.add(`page-header__mobile-toggle--closed`);
  menuList.classList.add(`main-nav__list--closed`);

  menuToggle.addEventListener(`click`, () => {
    menuToggle.classList.toggle(`page-header__mobile-toggle--closed`);

    if (menuList.classList.contains(`main-nav__list--closed`)) {
      menuList.classList.remove(`main-nav__list--closed`);
      menuList.classList.add(`main-nav__list--opened`);
    } else if (menuList.classList.contains(`main-nav__list--opened`)) {
      menuList.classList.remove(`main-nav__list--opened`);
      menuList.classList.add(`main-nav__list--closed`);
    }
  });
};

export default mobileMenuController;

