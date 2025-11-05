# StyleScale

> 🎨 Automatically style React components with one config file. Zero runtime overhead.

Stop repeating Tailwind classes across hundreds of components. Define your design system once, and StyleScale automatically injects styles at build time. Inspired by Nix's unified configuration philosophy.

Write this:
```jsx
<button>Click Me</button>
```

Get this automatically:
```jsx
<button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
  Click Me
</button>
```

[![npm version](https://badge.fury.io/js/stylescale.svg)](https://www.npmjs.com/package/stylescale)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Single source of truth** - All styling rules in one config file
- ⚡ **Zero runtime overhead** - Everything happens at build time via Babel
- 🎨 **Smart defaults** - Understands context (buttons get hover states, headings get hierarchy)
- 🌍 **Global rules** - `button:primary*` styles every button everywhere
- 📁 **File-scoped rules** - `Clock:primary` styles only Clock.tsx
- 🎭 **Element-specific** - `Dashboard:button:warning` styles only buttons in Dashboard
- 🏷️ **Class/ID selectors** - `.cta:danger*` or `#submit:success*`
- 🌈 **Custom colors** - Use `[#hex]`, `[rgb()]`, `[oklch()]`, or `[var(--custom)]`
- 🌓 **Dark mode support** - Define separate dark mode themes
- 🔧 **Manual overrides preserved** - Your custom classes always take precedence
- 🚀 **Automatic installer** - Zero manual setup required

## 📦 Installation

```bash
npm install --save-dev stylescale
```

**That's it!** The installer runs automatically and sets everything up. Just answer one question:
- **Using TypeScript?** (Y/n)

Done! ✨

### What the Installer Does

1. ✅ Detects TypeScript automatically
2. ✅ Detects your framework (Next.js, Vite, CRA)
3. ✅ Creates `theme.config.js` or `theme.config.ts` with starter themes
4. ✅ Configures Babel for your framework automatically
5. ✅ Updates config files (next.config.js, vite.config.js, etc.)

**Need to run installer again?**
```bash
npx stylescale-init
```

### Requirements

- Babel 7+
- Tailwind CSS 3+
- React (JavaScript or TypeScript)

## 🚀 Quick Start

### Your First Styled Component

After installation, you'll have a `theme.config.js` (or `.ts`) file. Add your first component:

```javascript
// theme.config.js
module.exports = {
  colors: {
    primary: { 
      main: '#3b82f6', 
      light: '#60a5fa', 
      dark: '#2563eb', 
      text: '#ffffff' 
    }
  },
  
  components: {
    'Clock': 'primary'  // 👈 Add this to auto-style Clock.tsx
  }
};
```

Create your component:

```jsx
// Clock.tsx or Clock.jsx
export default function Clock() {
  return (
    <div>
      <h2>Current Time</h2>
      <button>Refresh</button>
    </div>
  );
}
```

**Build your project** - StyleScale automatically transforms it:

```jsx
export default function Clock() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-400 mb-4">Current Time</h2>
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
        Refresh
      </button>
    </div>
  );
}
```

No manual className needed! 🎉

## 📚 Configuration Guide

### Define Custom Themes (Any Names You Want!)

```javascript
// theme.config.js
module.exports = {
  colors: {
    // Standard themes
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', text: '#ffffff' },
    secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', text: '#ffffff' },
    
    // Your custom theme names - totally flexible!
    ocean: { main: '#0ea5e9', light: '#38bdf8', dark: '#0284c7', text: '#ffffff' },
    sunset: { main: '#f97316', light: '#fb923c', dark: '#ea580c', text: '#ffffff' },
    midnight: { main: '#1e293b', light: '#334155', dark: '#0f172a', text: '#f1f5f9' },
    neon: { main: '#a3e635', light: '#bef264', dark: '#84cc16', text: '#14532d' },
    
    // Brand-specific
    brandPrimary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', text: '#ffffff' },
  },
  
  components: {
    'Clock': 'primary',
    'Dashboard': 'ocean',
    'Hero': 'sunset'
  }
};
```

### Advanced Rules System

```javascript
rules: [
  // GLOBAL RULES (asterisk applies everywhere)
  'button:primary*',              // ALL buttons in entire project
  '.cta:danger*',                 // ALL elements with class="cta"
  '#submit:success*',             // ALL elements with id="submit"
  
  // FILE-SCOPED (no asterisk)
  'Dashboard:warning',            // Entire Dashboard.tsx file
  'Dashboard:button:primary',     // Only buttons in Dashboard.tsx
  'LoginForm:input:secondary',    // Only inputs in LoginForm.tsx
  
  // CLASS/ID SPECIFIC
  'Header:.logo:primary',         // class="logo" in Header.tsx
  'Modal:#close-btn:danger',      // id="close-btn" in Modal.tsx
  
  // CUSTOM COLORS
  'Footer:[#1a1a1a]',            // Custom hex color
  'Card:button:[rgb(255,0,0)]',  // Custom RGB
  'Theme:[var(--brand-color)]',  // CSS variable
  'Modern:[oklch(0.7 0.2 180)]'  // OKLCH color space
]
```

## 🎓 Rule Syntax Cheatsheet

| Syntax | Scope | Example | Description |
|--------|-------|---------|-------------|
| `element:theme*` | Global | `button:primary*` | All buttons everywhere |
| `.class:theme*` | Global | `.btn:danger*` | All elements with class="btn" |
| `#id:theme*` | Global | `#submit:success*` | All elements with id="submit" |
| `filename:theme` | File | `Clock:primary` | Entire Clock.tsx file |
| `filename:element:theme` | File + Element | `Dashboard:button:warning` | Buttons in Dashboard.tsx |
| `filename:.class:theme` | File + Class | `Modal:.header:purple` | class="header" in Modal.tsx |
| `filename:#id:theme` | File + ID | `Form:#submit:success` | id="submit" in Form.tsx |
| `element:[color]` | Custom Color | `button:[#ff0000]` | Custom color for buttons |
| `filename:[color]` | Custom Color | `Header:[#000]` | Custom color for Header.tsx |

## 🌈 Custom Colors

Use bracket notation for any color:

```javascript
rules: [
  // Hex colors
  'button:[#ff0000]',
  
  // RGB/RGBA
  'div:[rgb(255, 100, 50)]',
  'overlay:[rgba(0, 0, 0, 0.8)]',
  
  // OKLCH (modern color space)
  'card:[oklch(0.7 0.2 180)]',
  
  // CSS Variables
  'theme:[var(--primary-color)]',
  'accent:[var(--brand-accent)]',
  
  // File-specific
  'Header:button:[#1a73e8]',
  'Footer:[#2d2d2d]',
]
```

## 🌓 Dark Mode Support

```javascript
module.exports = {
  colors: {
    primary: { /* ... */ },
    dark: { main: '#1f2937', light: '#374151', dark: '#111827', text: '#f9fafb' }
  },
  
  components: {
    'Dashboard': 'primary'
  },
  
  darkMode: {
    'Dashboard': 'dark'  // Uses 'dark' theme when dark mode is active
  }
};
```

Generates both light and dark classes:
```jsx
<div className="bg-blue-500 dark:bg-gray-800 text-white dark:text-gray-100">
```

## 📘 TypeScript Support

**Fully compatible!** The installer sets up TypeScript automatically if detected.

### Type-Safe Configuration

```typescript
// theme.config.ts
import { ThemeConfig } from 'stylescale';

const config: ThemeConfig = {
  colors: {
    primary: { main: '#3b82f6', /* ... */ },
    myCustomTheme: { main: '#ff0000', /* ... */ }  // ← Full autocomplete!
  },
  components: {
    'Clock': 'primary'
  }
};

export default config;
```

**Or use JSDoc in .js files:**

```javascript
// theme.config.js
/** @type {import('stylescale').ThemeConfig} */
module.exports = {
  colors: {
    primary: { main: '#3b82f6', /* ... */ }
  }
};
```

✅ Full IntelliSense  
✅ Type checking  
✅ Works with `.tsx` components  

## 🎯 Priority System

When multiple rules match:

1. **Specific rules** (from `rules` array) - highest priority
2. **Component themes** (from `components` object)
3. **Dark mode themes** (from `darkMode` object)
4. **Manual classNames** - always preserved

```javascript
// Your manual classes always win
<button className="w-full"> {/* w-full is preserved */}
  Click Me
</button>
```

## 🔧 Framework Integration

**The installer configures everything automatically!** Here's what it does:

### Next.js

Creates/updates `next.config.js`:

```javascript
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [['stylescale', { configPath: './theme.config.js' }]]
        }
      }
    });
    return config;
  }
};
```

### Vite

Creates/updates `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['stylescale', { configPath: './theme.config.js' }]]
      }
    })
  ]
});
```

### Create React App

Creates `craco.config.js` and shows install instructions:

```bash
npm install @craco/craco
```

```javascript
module.exports = {
  babel: {
    plugins: [['stylescale', { configPath: './theme.config.js' }]]
  }
};
```

## 💡 Real-World Examples

### E-commerce Product Card

```javascript
components: {
  'ProductCard': 'primary'
},
rules: [
  'ProductCard:.price:success',   // Green price tags
  'ProductCard:button:danger',     // Red buy buttons
  'ProductCard:.badge:warning'     // Yellow sale badges
]
```

### Dashboard with Brand Colors

```javascript
rules: [
  'Dashboard:[var(--brand-primary)]',
  'Dashboard:.stat-card:[#ffffff]',
  'Dashboard:button:[var(--brand-accent)]'
]
```

### Global Button System

```javascript
rules: [
  'button:primary*',           // Default: all buttons are primary
  '.btn-danger:danger*',       // Override: danger buttons
  'Modal:button:warning'       // Override: Modal buttons
]
```

## 🎭 Smart Element Styling

StyleScale applies intelligent defaults:

| Element | Auto-Features |
|---------|---------------|
| `<div>` | Gradient background, padding, rounded, shadow |
| `<h1>`-`<h6>` | Font hierarchy, weight, color, margins |
| `<p>` | Text color, opacity, margins |
| `<button>` | Background, hover states, padding, rounded, transition, cursor |
| `<input>` | Border, focus states, padding, rounded, focus ring |
| `<a>` | Text color, hover, underline, transition |
| `<label>` | Text color, font weight, display, margins |

## 🐛 Troubleshooting

### Styles not applying?

1. **Check component name:**
   ```javascript
   // File: Clock.tsx
   components: { 'Clock': 'primary' }  // ✅ Match case exactly
   ```

2. **Clear build cache:**
   ```bash
   rm -rf .next          # Next.js
   rm -rf node_modules/.cache  # CRA/Vite
   ```

3. **Verify Tailwind is configured:**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ['./src/**/*.{js,jsx,ts,tsx}']
   }
   ```

### Need help?

- 📚 [Full Documentation](https://github.com/rywils/stylescale)
- 🐛 [Report Issues](https://github.com/rywils/stylescale/issues)
- 💬 [Discussions](https://github.com/rywils/stylescale/discussions)

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT © Ryan Wilson (regded)

## 🙏 Acknowledgments

- Inspired by Nix's single-file configuration approach
- Built for developers who love Tailwind but hate repetition
- Made with ❤️ for the React community

---

**Questions?** Open an issue on [GitHub](https://github.com/yourusername/stylescale)

**Like this project?** Give it a ⭐️!