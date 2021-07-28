const menuItems = document.querySelectorAll("header .links a");
const currentPage = location.pathname;
menuItems.forEach((menuItem) => {
  if (currentPage.includes(menuItem.getAttribute("href"))) {
    menuItem.classList.add("active");
  } else {
    menuItem.classList.remove("active");
  }
});
