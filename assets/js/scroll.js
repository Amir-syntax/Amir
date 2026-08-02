document.addEventListener("DOMContentLoaded", () => {
  // افکت‌های مختلف برای هر بخش
  const sectionsConfig = [
    { selector: ".top", effect: "reveal" },
    { selector: ".text-right", effect: "reveal-left" },
    { selector: ".picture-left", effect: "reveal-right" },
    { selector: ".core-stack", effect: "reveal-scale" },
    { selector: ".projects", effect: "reveal" },
    { selector: ".bottem", effect: "reveal" },
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  sectionsConfig.forEach(({ selector, effect }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.classList.add(effect);
      observer.observe(el);
    });
  });

  // ===== افکت برای المان‌های داخلی با تاخیر =====
  // مهارت‌ها
  const skillItems = document.querySelectorAll(".item-s");
  skillItems.forEach((item, index) => {
    item.classList.add("reveal-scale");
    item.classList.add(`delay-${(index % 5) + 1}`);
    observer.observe(item);
  });

  // پروژه‌ها
  const projectItems = document.querySelectorAll(".item-pic");
  projectItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.classList.add(`delay-${(index % 3) + 1}`);
    observer.observe(item);
  });
});
