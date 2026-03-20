/**
 * Scrolls to the projects section with smooth animation
 */
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

/**
 * Auto-scroll with animation frame for better performance
 */
export const autoScrollWithFrame = (
  scrollFunction: () => void,
  delay: number = 150
) => {
  requestAnimationFrame(() => {
    setTimeout(scrollFunction, delay);
  });
};
