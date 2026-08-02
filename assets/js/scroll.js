document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".top, .text-right, .picture-left, .core-stack, .projects, .bottem",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // فقط یکبار اجرا بشه
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
});
