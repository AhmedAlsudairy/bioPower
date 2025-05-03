// This script is used to prevent theme flickering on page load
// It needs to be executed before the React app loads
// We'll include it in our layout.tsx

export function createThemeScript(): string {
  return `
    (function() {
      try {
        // Check localStorage first
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          document.documentElement.classList.add(storedTheme);
          document.documentElement.setAttribute('data-theme', storedTheme);
          return;
        }
        
        // If no stored theme, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {
        // Fail safe - default to light theme
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
}
