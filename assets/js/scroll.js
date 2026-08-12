document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------------------------
  // 1) ریول بخش‌های اصلی صفحه — هر بخش با یک جلوه مخصوص خودش
  // -----------------------------------------------------------
  const sectionEffects = [
    { selector: ".top", effect: "reveal" },
    { selector: ".picture-left", effect: "reveal-left" },
    { selector: ".text-right", effect: "reveal-right" },
    { selector: ".core-stack", effect: "reveal" },
    { selector: ".projects", effect: "reveal" },
    { selector: ".bottem", effect: "reveal-scale" },
  ];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          sectionObserver.unobserve(entry.target); // فقط یکبار اجرا بشه
        }
      });
    },
    {
      threshold: 0.15,
      // کمی زودتر از رسیدن کامل به بخش، انیمیشن شروع بشه (حس نرم‌تر و طبیعی‌تر)
      rootMargin: "0px 0px -80px 0px",
    },
  );

  sectionEffects.forEach(({ selector, effect }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add(effect);
    sectionObserver.observe(el);
  });

  // -----------------------------------------------------------
  // 2) ریول پلکانی برای کارت‌های داخل بخش‌ها
  //    (مهارت‌ها و پروژه‌ها یکی‌یکی با تاخیر ظاهر می‌شن)
  // -----------------------------------------------------------
  const staggerSelectors = [".stack .item-s", ".itme-pic-div .item-pic"];
  const STAGGER_STEP = 0.12; // ثانیه، فاصله بین ظاهر شدن هر کارت

  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          itemObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  staggerSelectors.forEach((selector) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.transitionDelay = `${index * STAGGER_STEP}s`;
      itemObserver.observe(item);
    });
  });
});
