# TypeScript Support

## ✅ Fully Compatible

`babel-plugin-react-auto-style` works seamlessly with TypeScript projects. It operates at the Babel/JSX transformation level, so it processes your `.tsx` files just like `.jsx` files.

## Installation for TypeScript Projects

```bash
npm install --save-dev babel-plugin-react-auto-style @babel/preset-typescript
```

## TypeScript Configuration

### With tsconfig.json

Your standard TypeScript setup works fine:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### With Babel

```json
// .babelrc
{
  "presets": [
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  "plugins": [
    ["babel-plugin-react-auto-style", {
      "configPath": "./theme.config.js"
    }]
  ]
}
```

## Type-Safe Configuration

### Option 1: Using JSDoc (Recommended for .js config)

```javascript
// theme.config.js
/** @type {import('babel-plugin-react-auto-style').ThemeConfig} */
module.exports = {
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      text: '#ffffff'
    },
    // TypeScript will provide autocomplete here! ✨
    ocean: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      text: '#ffffff'
    }
  },
  
  components: {
    'Clock': 'primary',  // ✅ Type-checked
    'Dashboard': 'ocean' // ✅ Type-checked
  },
  
  rules: [
    'button:primary*',
    'Dashboard:button:ocean'
  ]
};
```

### Option 2: Using TypeScript config file

```typescript
// theme.config.ts
import { ThemeConfig } from 'babel-plugin-react-auto-style';

const config: ThemeConfig = {
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      text: '#ffffff'
    },
    ocean: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
      text: '#ffffff'
    }
  },
  
  components: {
    'Clock': 'primary',
    'Dashboard': 'ocean'
  },
  
  rules: [
    'button:primary*',
    'Dashboard:button:ocean'
  ],
  
  darkMode: {
    'Dashboard': 'midnight'
  }
};

export default config;
```

**Note:** If using `.ts` config, update your Babel plugin config:

```json
{
  "plugins": [
    ["babel-plugin-react-auto-style", {
      "configPath": "./theme.config.ts"
    }]
  ]
}
```

## Using with TypeScript React Components

The plugin works identically with `.tsx` files:

```tsx
// Clock.tsx
import React, { useState, useEffect } from 'react';

interface ClockProps {
  format?: '12h' | '24h';
  showSeconds?: boolean;
}

export default function Clock({ format = '12h', showSeconds = true }: ClockProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Current Time</h2>
      <p>{time}</p>
      <button>Refresh</button>
    </div>
  );
}

// ✨ Plugin automatically transforms to:
// <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
//   <h2 className="text-3xl font-bold text-blue-400 mb-4">Current Time</h2>
//   <p className="text-white opacity-90 mb-2">{time}</p>
//   <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg...">Refresh</button>
// </div>
```

## Framework-Specific TypeScript Setup

### Next.js with TypeScript

```typescript
// next.config.js (or next.config.ts)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
              configPath: './theme.config.ts'
            }]
          ]
        }
      }
    });
    return config;
  }
};

export default nextConfig;
```

### Vite with TypeScript

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-auto-style', {
            configPath: './theme.config.ts'
          }]
        ]
      }
    })
  ]
});
```

## Type Definitions Included

The package includes full TypeScript definitions (`index.d.ts`), so you get:

✅ **Autocomplete** in your theme.config.js/ts  
✅ **Type checking** for your configuration  
✅ **IntelliSense** in VS Code and other editors  
✅ **Error detection** for invalid configurations  

## Example: Type-Safe Custom Themes

```typescript
// theme.config.ts
import { ThemeConfig } from 'babel-plugin-react-auto-style';

// Define your custom theme names with full type safety
const config: ThemeConfig = {
  colors: {
    // Your custom theme names - fully type-checked!
    'brand-primary': {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      text: '#ffffff'
    },
    'brand-secondary': {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      text: '#ffffff'
    },
    'marketing-red': {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      text: '#ffffff'
    }
  },
  
  components: {
    'Header': 'brand-primary',
    'Footer': 'brand-secondary',
    'CTA': 'marketing-red'
  },
  
  rules: [
    'button:brand-primary*',
    '.cta:marketing-red*'
  ]
};

export default config;
```

## Common TypeScript Issues & Solutions

### Issue: "Cannot find module 'babel-plugin-react-auto-style'"

**Solution:** Make sure types are installed:
```bash
npm install --save-dev @types/babel__core
```

### Issue: Config file not found

**Solution:** Ensure the path in your Babel config matches your file:
```json
{
  "plugins": [
    ["babel-plugin-react-auto-style", {
      "configPath": "./theme.config.ts"  // ← Match your actual filename
    }]
  ]
}
```

### Issue: Types not working in theme.config.js

**Solution:** Use JSDoc annotation:
```javascript
/** @type {import('babel-plugin-react-auto-style').ThemeConfig} */
module.exports = { /* ... */ };
```

## Best Practices for TypeScript Projects

1. **Use JSDoc for .js configs** - Get type checking without switching to .ts
2. **Use .ts config files** - If your build system supports it, full TS is even better
3. **Enable strict mode** - Catch configuration errors early
4. **Use const assertions** - For stricter type checking:
   ```typescript
   const themes = {
     primary: { main: '#3b82f6', /* ... */ }
   } as const;
   ```

## Summary

✅ **Fully TypeScript compatible** - Works with `.tsx` files  
✅ **Type definitions included** - Get autocomplete and IntelliSense  
✅ **Flexible config** - Use `.js` with JSDoc or `.ts` files  
✅ **Framework support** - Next.js, Vite, CRA all work with TS  
✅ **Type-safe themes** - Define custom theme names with full type checking  

TypeScript users get the same great DX with added type safety! 🎉