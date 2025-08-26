// Theme Management
const ThemeManager = {
    STORAGE_KEY: 'preferred-theme',
    LIGHT: 'light',
    DARK: 'dark',
    
    init() {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine initial theme
        const initialTheme = savedTheme || (systemPrefersDark ? this.DARK : this.LIGHT);
        
        // Apply theme before page loads to prevent flash
        this.setTheme(initialTheme, false);
        
        // Listen for system theme changes if no saved preference
        if (!savedTheme) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.setTheme(e.matches ? this.DARK : this.LIGHT, false);
            });
        }
    },
    
    setTheme(theme, save = true) {
        // Remove any existing theme
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme
        if (theme === this.LIGHT) {
            document.documentElement.setAttribute('data-theme', this.LIGHT);
        }
        
        // Save preference
        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }
        
        // Update button aria-label
        const button = document.getElementById('theme-toggle');
        if (button) {
            const isLight = theme === this.LIGHT;
            button.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
        }
    },
    
    toggle() {
        const currentTheme = document.documentElement.hasAttribute('data-theme') ? this.LIGHT : this.DARK;
        const newTheme = currentTheme === this.LIGHT ? this.DARK : this.LIGHT;
        this.setTheme(newTheme);
    },
    
    getCurrentTheme() {
        return document.documentElement.hasAttribute('data-theme') ? this.LIGHT : this.DARK;
    }
};

// Initialize theme immediately (before DOM loads to prevent flash)
ThemeManager.init();

// Toggle skills visibility
function toggleSkills() {
    const hiddenSkills = document.querySelectorAll('.profile-tag.hidden-skill');
    const addButton = document.querySelector('.profile-tag.add-tag');
    const addIcon = addButton.querySelector('.add-icon');
    
    hiddenSkills.forEach(skill => {
        skill.classList.toggle('show');
    });
    
    addButton.classList.toggle('expanded');
    const isExpanded = addButton.classList.contains('expanded');
    
    // Change icon text
    addIcon.textContent = isExpanded ? '×' : '+';
    
    // Update aria-label
    addButton.setAttribute('aria-label', 
        isExpanded ? 'Hide skills' : 'Show more skills'
    );
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => ThemeManager.toggle());
        
        // Set initial aria-label
        const isLight = ThemeManager.getCurrentTheme() === ThemeManager.LIGHT;
        themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    }
    
    // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + L)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            ThemeManager.toggle();
        }
    });
    
    // Skills toggle
    const skillToggle = document.querySelector('.profile-tag.add-tag');
    if (skillToggle) {
        skillToggle.addEventListener('click', toggleSkills);
    }
});