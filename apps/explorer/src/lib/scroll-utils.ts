export const scrollToProjectsSection = (options?: ScrollIntoViewOptions) => {
  const projectsSection = document.getElementById("projects-section");
  if (projectsSection) {
    projectsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
      ...options,
    });
  }
};

export const autoScrollWithFrame = (
  scrollFunction: () => void,
  delay: number = 150
) => {
  requestAnimationFrame(() => {
    setTimeout(scrollFunction, delay);
  });
};
