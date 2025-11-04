# babel-plugin-react-auto-style

> 🎨 Automatically style React components with a single config file. Inspired by Nix's configuration approach.

Tired of repeating Tailwind classes across components? Define your theme once, and let this Babel plugin automatically inject styles at build time. **Zero runtime overhead, maximum developer experience.**

[![npm version](https://badge.fury.io/js/babel-plugin-react-auto-style.svg)](https://www.npmjs.com/package/babel-plugin-react-auto-style)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Single source of truth** - All styling rules in one config file
- ⚡ **Zero runtime overhead** - Everything happens at build time via Babel
- 🎨 **Smart defaults** - Understands context (buttons get hover states, headings get hierarchy)
- 🌍 **Global rules** - Style all buttons everywhere with `button:primary*`
- 📁 **File-scoped rules** - `Clock:primary` styles only Clock.tsx
- 🎭 **Element-specific** - `Dashboard:button:warning` styles only buttons in Dashboard.tsx
- 🏷️ **Class/ID selectors** - `.cta-button:danger*` or `#submit:success*`
- 🌈 **Custom colors** - Use `[#hex]`, `[rgb()]`, `[oklch()]`, or `[var(--custom)]`
- 🌓 **Dark mode support** - Define separate dark mode themes
- 🔧 **Manual overrides preserved** - Your custom classes always take precedence

## 📦 Installation

```bash
npm install --save-dev babel-plugin-react-auto-style
# or
yarn add -D babel-plugin-react-auto-style
# or
pnpm add -D babel-plugin-react-auto-style
```

**That's it!** The installer will run automatically and guide you through setup. 🎉

### What the Installer Does

The installer will:
1. ✅ Detect if you're using TypeScript
2. ✅ Detect your framework (Next.js, Vite, CRA, or custom)
3. ✅ Create `theme.config.js` or `theme.config.ts` with starter themes
4. ✅ Configure Babel automatically for your framework
5. ✅ Update your config files (next.config.js, vite.config.js, etc.)

**Manual setup?** Run:
```bash
npx auto-style-init
```

### Requirements

- Babel 7+
- Tailwind CSS 3+
- React
- Works with JavaScript and TypeScript

**For TypeScript projects:**
The installer will automatically set everything up. Full TypeScript types included!

## 🚀 Quick Start

### 1. Create your theme config

Create `theme.config.js` in your project root:

```javascript
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
    'Clock': 'primary'  // Auto-style Clock.tsx with primary theme
  }
};
```

### 2. Add to Babel config

**.babelrc:**
```json
{
  "plugins": [
    ["babel-plugin-react-auto-style", {
      "configPath": "./theme.config.js"
    }]
  ]
}
```

**babel.config.js:**
```javascript
module.exports = {
  plugins: [
    ['babel-plugin-react-auto-style', {
      configPath: './theme.config.js'
    }]
  ]
};
```

### 3. Write clean React components

```jsx
// Clock.tsx - Before transformation
export default function Clock() {
  return (
    <div>
      <h2>Current Time</h2>
      <button>Refresh</button>
    </div>
  );
}
```

**The plugin automatically transforms it to:**

```jsx
// Clock.tsx - After Babel transformation (automatic)
export default function Clock() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-400 mb-4">Current Time</h2>
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
        Refresh
      </button>
    </div>
  );
}
```

## 📚 Configuration Guide

### Basic Component Theming

```javascript
// theme.config.js
module.exports = {
  colors: {
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', text: '#ffffff' },
    secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', text: '#ffffff' }
  },
  
  components: {
    'Clock': 'primary',      // Entire Clock.tsx gets primary theme
    'UserCard': 'secondary'  // Entire UserCard.tsx gets secondary theme
  }
};
```

### Advanced Rules System

The `rules` array gives you granular control:

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

## 🎨 Custom Colors

Use bracket notation for custom colors:

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
  
  // File-specific custom colors
  'Header:button:[#1a73e8]',
  'Footer:[#2d2d2d]',
  'Modal:div:[var(--modal-bg)]'
]
```

## 🌓 Dark Mode Support

Define separate themes for dark mode:

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

The plugin generates both light and dark mode classes:

```jsx
<div className="bg-blue-500 dark:bg-gray-800 text-white dark:text-gray-100">
```

## 🎯 Priority System

When multiple rules match, this is the order of precedence:

1. **Specific rules** (from `rules` array) - highest priority
2. **Component-level themes** (from `components` object)
3. **Dark mode themes** (from `darkMode` object)
4. **Manual classNames** - always preserved and take precedence

```javascript
// If you have both:
components: { 'Button': 'primary' },
rules: [ 'Button:button:danger' ]

// The rule wins: buttons in Button.tsx will be 'danger' themed
```

## 🔧 Framework Integration

**The installer automatically configures your framework!** But here's what it does for reference:

### Next.js

The installer creates/updates `next.config.js`:

```javascript
// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            ['babel-plugin-react-auto-style', {
              configPath: './theme.config.js'
            }]
          ]
        }
      }
    });
    return config;
  }
};
```

### Create React App (with CRACO)

The installer creates `craco.config.js` and reminds you to:

```bash
npm install @craco/craco
```

```javascript
// craco.config.js
module.exports = {
  babel: {
    plugins: [
      ['babel-plugin-react-auto-style', {
        configPath: './theme.config.js'
      }]
    ]
  }
};
```

### Vite

```bash
npm install --save-dev @vitejs/plugin-react
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-auto-style', {
            configPath: './theme.config.js'
          }]
        ]
      }
    })
  ]
});
```

## 💡 Examples

### E-commerce Product Card

```javascript
// theme.config.js
components: {
  'ProductCard': 'primary'
},
rules: [
  'ProductCard:.price:success',      // Price tags get success theme
  'ProductCard:button:danger',        // Buy buttons get danger/red theme
  'ProductCard:.badge:warning'        // Sale badges get warning/yellow
]
```

```jsx
// ProductCard.tsx
export default function ProductCard() {
  return (
    <div>
      <h3>Product Name</h3>
      <p className="price">$99.99</p>
      <span className="badge">SALE</span>
      <button>Add to Cart</button>
    </div>
  );
}
// Auto-styled with appropriate themes for each element!
```

### Dashboard with Custom Brand Colors

```javascript
rules: [
  'Dashboard:[var(--brand-primary)]',           // Main container
  'Dashboard:.stat-card:[#ffffff]',             // White stat cards
  'Dashboard:button:[var(--brand-accent)]'      // Custom accent buttons
]
```

### Global Button Styling

```javascript
rules: [
  'button:primary*',              // All buttons are primary by default
  '.btn-danger:danger*',          // Override: danger buttons everywhere
  '.btn-success:success*',        // Override: success buttons everywhere
  'Modal:button:warning'          // Override: Modal buttons are warning
]
```

## 🎭 Element-Specific Smart Styling

The plugin applies intelligent defaults based on element type:

| Element | Auto-Applied Features |
|---------|----------------------|
| `<div>` | Gradient background, padding, rounded corners, shadow |
| `<h1>` - `<h6>` | Font size hierarchy, font weight, color, margins |
| `<p>` | Text color, opacity, line height, margins |
| `<button>` | Background, hover states, padding, rounded, transition, cursor |
| `<input>` | Border, focus states, padding, rounded, focus ring |
| `<a>` | Text color, hover states, underline, transition |
| `<label>` | Text color, font weight, display block, margins |
| `<span>` | Text color inheritance |

## 🛠️ Manual Override Example

Your manual classes are always preserved:

```jsx
// You write:
<button className="w-full mt-4">Submit</button>

// Plugin transforms to:
<button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
  Submit
</button>
```

The plugin intelligently merges classes, avoiding conflicts.

## 🚫 What This Plugin Does NOT Do

- ❌ Replace Tailwind CSS (it generates Tailwind classes)
- ❌ Work without Tailwind installed
- ❌ Add runtime JavaScript (purely build-time transformation)
- ❌ Override your manual `className` values (they're preserved)
- ❌ Style third-party components (only your source files)

## 🐛 Troubleshooting

### Styles not applying?

1. **Check component name matches config:**
   ```javascript
   // File: Clock.tsx
   components: { 'Clock': 'primary' }  // ✅ Correct
   components: { 'clock': 'primary' }  // ❌ Wrong (case-sensitive)
   ```

2. **Verify Babel is configured:**
   ```bash
   # Check if Babel is running
   npm run build -- --verbose
   ```

3. **Clear build cache:**
   ```bash
   rm -rf .next          # Next.js
   rm -rf node_modules/.cache  # CRA
   ```

### Colors not showing?

1. **Ensure Tailwind is configured:**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ['./src/**/*.{js,jsx,ts,tsx}'],
     // ... rest of config
   }
   ```

2. **Hex colors must match exactly:**
   ```javascript
   // Plugin knows these colors:
   '#3b82f6' → 'blue-500' ✅
   '#3B82F6' → 'blue-500' ✅ (case insensitive)
   '#3b82f7' → 'gray-500' ⚠️ (falls back to gray)
   ```

3. **Custom colors need Tailwind JIT:**
   ```javascript
   // Make sure JIT mode is enabled (default in Tailwind 3+)
   ```

### Rules not matching?

Use console.log to debug:

```javascript
// Add to theme.config.js
console.log('Config loaded:', module.exports);
```

Check the build output for any warnings from the plugin.

## 📖 Full Configuration Example

See [theme.config.js example](./examples/theme.config.js) for a complete configuration with all features.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Inspired by Nix's single-file configuration approach
- Built for developers who love Tailwind but hate repetition
- Made with ❤️ for the React community

---

**Questions?** Open an issue on [GitHub](https://github.com/yourusername/babel-plugin-react-auto-style)

**Like this project?** Give it a ⭐️ on GitHub!