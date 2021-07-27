const currentPage = location.pathname;  // Get routes
const menuItems = document.querySelectorAll("header .links a");

menuItems.forEach(menuItem => {
  if (currentPage.includes(menuItem.getAttribute("href"))) {
    menuItem.classList.add("active");
  } else {
    menuItem.classList.remove("active");
  }
})
