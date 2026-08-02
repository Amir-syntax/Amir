let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScroll = current;
});
