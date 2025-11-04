// theme.config.js - Complete example with all features
// **RENAME TO  theme.comnfig.js to use**

module.exports = {
  // Define your color themes
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      text: '#ffffff'
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      text: '#ffffff'
    },
    purple: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#9333ea',
      text: '#ffffff'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      text: '#ffffff'
    },
    danger: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      text: '#ffffff'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      text: '#ffffff'
    }
  },
  
  // Map component filenames to themes
  // This auto-styles the ENTIRE component
  components: {
    'Clock': 'primary',           // Clock.tsx gets primary theme
    'UserCard': 'secondary',      // UserCard.tsx gets secondary theme
    'Dashboard': 'purple',        // Dashboard.tsx gets purple theme
    'LoginForm': 'primary',       // LoginForm.tsx gets primary theme
    'SuccessMessage': 'success',  // SuccessMessage.tsx gets success theme
    'ErrorAlert': 'danger'        // ErrorAlert.tsx gets danger theme
  },
  
  // Advanced rules for granular control
  rules: [
    // GLOBAL RULES (apply everywhere with *)
    'button:primary*',              // All buttons everywhere get primary theme
    '.cta-button:danger*',          // All elements with class "cta-button" get danger theme
    '#submit-btn:success*',         // All elements with id "submit-btn" get success theme
    
    // FILE-SPECIFIC RULES (no asterisk)
    'Clock:secondary',              // Override: Clock.tsx uses secondary (overrides components setting)
    'Dashboard:button:warning',     // All buttons in Dashboard.tsx get warning theme
    'LoginForm:input:primary',      // All inputs in LoginForm.tsx get primary theme
    
    // ELEMENT-SPECIFIC IN FILE
    'UserCard:.avatar:purple',      // Elements with class "avatar" in UserCard.tsx get purple
    'Settings:#save-button:success', // Element with id "save-button" in Settings.tsx gets success
    
    // CUSTOM COLORS (using bracket notation)
    'Header:button:[#ff0000]',      // Buttons in Header.tsx get custom red color
    'Footer:[#1a1a1a]',             // Footer.tsx gets custom dark background
    'Modal:button:[rgb(255,100,50)]', // Buttons in Modal.tsx get custom RGB
    'Theme:.accent:[var(--brand-color)]', // Elements with class "accent" use CSS variable
    'Card:button:[oklch(0.7 0.2 180)]', // Buttons in Card.tsx use OKLCH color
    
    // RESPONSIVE & COMPLEX RULES
    'NavBar:button:primary',        // Buttons in NavBar get primary
    'Sidebar:a:secondary',          // Links in Sidebar get secondary
  ],
  
  // Dark mode support (optional)
  darkMode: {
    'Clock': 'purple',              // Clock.tsx uses purple theme in dark mode
    'Dashboard': 'secondary'        // Dashboard.tsx uses secondary in dark mode
  }
};