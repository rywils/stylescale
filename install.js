#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Default theme configuration
const defaultThemeJS = `// theme.config.js
module.exports = {
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
  components: {
    // Example: 'Clock': 'primary',
    // Example: 'Dashboard': 'secondary',
  },
  
  // Advanced rules for granular control
  rules: [
    // Example: 'button:primary*',              // All buttons everywhere
    // Example: 'Dashboard:button:warning',     // Buttons in Dashboard.tsx
    // Example: '.cta:danger*',                 // All .cta class elements
    // Example: 'Header:[#1a1a1a]',            // Custom color for Header
  ]
};
`;

const defaultThemeTS = `// theme.config.ts
import { ThemeConfig } from 'stylescale';

const config: ThemeConfig = {
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
  components: {
    // Example: 'Clock': 'primary',
    // Example: 'Dashboard': 'secondary',
  },
  
  // Advanced rules for granular control
  rules: [
    // Example: 'button:primary*',              // All buttons everywhere
    // Example: 'Dashboard:button:warning',     // Buttons in Dashboard.tsx
    // Example: '.cta:danger*',                 // All .cta class elements
    // Example: 'Header:[#1a1a1a]',            // Custom color for Header
  ]
};

export default config;
`;

const babelrcTemplate = (configPath) => `{
  "plugins": [
    ["stylescale", {
      "configPath": "${configPath}"
    }]
  ]
}
`;

const babelConfigTemplate = (configPath) => `module.exports = {
  plugins: [
    ['stylescale', {
      configPath: '${configPath}'
    }]
  ]
};
`;

function detectFramework() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return 'unknown';
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps.next) return 'next';
  if (deps.vite) return 'vite';
  if (deps['react-scripts']) return 'cra';
  
  return 'custom';
}

function detectTypeScript() {
  return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
}

function createThemeConfig(useTypeScript, configPath) {
  const content = useTypeScript ? defaultThemeTS : defaultThemeJS;
  fs.writeFileSync(configPath, content, 'utf8');
  log(`✅ Created ${configPath}`, 'green');
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('⚠️  No package.json found. Run npm init first.', 'yellow');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Add setup script
  if (!packageJson.scripts['stylescale:init']) {
    packageJson.scripts['stylescale:init'] = 'node node_modules/stylescale/install.js';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  log('✅ Updated package.json scripts', 'green');
}

function setupNextJS(useTypeScript, configPath) {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  
  // Create .babelrc for Next.js (works with both webpack and turbopack)
  const babelConfig = {
    presets: ['next/babel'],
    plugins: [
      ['stylescale', {
        configPath: configPath
      }]
    ]
  };
  
  fs.writeFileSync(babelrcPath, JSON.stringify(babelConfig, null, 2), 'utf8');
  log('✅ Created .babelrc', 'green');
  
  // Update next.config.js to disable Turbopack (use webpack mode for Babel)
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // StyleScale requires Babel, so we use webpack mode
  // To use webpack explicitly, run: npm run dev -- --webpack
  experimental: {
    // Turbopack doesn't support Babel plugins yet
    // This ensures Babel runs for transformations
  }
};

module.exports = nextConfig;
`;
  
  fs.writeFileSync(nextConfigPath, nextConfig, 'utf8');
  log('✅ Created/updated next.config.js', 'green');
  log('⚠️  Run with: npm run dev -- --webpack', 'yellow');
  log('⚠️  Or add to package.json: "dev": "next dev --webpack"', 'yellow');
}

function setupVite(useTypeScript, configPath) {
  const viteConfigPath = path.join(process.cwd(), useTypeScript ? 'vite.config.ts' : 'vite.config.js');
  
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['stylescale', {
            configPath: '${configPath}'
          }]
        ]
      }
    })
  ]
});
`;
  
  fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
  log(`✅ Created/updated ${useTypeScript ? 'vite.config.ts' : 'vite.config.js'}`, 'green');
}

function setupCRA(configPath) {
  const cracoConfigPath = path.join(process.cwd(), 'craco.config.js');
  
  const cracoConfig = `module.exports = {
  babel: {
    plugins: [
      ['stylescale', {
        configPath: '${configPath}'
      }]
    ]
  }
};
`;
  
  fs.writeFileSync(cracoConfigPath, cracoConfig, 'utf8');
  log('✅ Created craco.config.js', 'green');
  log('⚠️  Install CRACO: npm install @craco/craco', 'yellow');
  log('⚠️  Update package.json scripts to use craco instead of react-scripts', 'yellow');
}

function setupCustomBabel(configPath) {
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  const babelConfigPath = path.join(process.cwd(), 'babel.config.js');
  
  if (fs.existsSync(babelConfigPath)) {
    log('⚠️  babel.config.js already exists. Add this to your plugins:', 'yellow');
    log(`\n['stylescale', { configPath: '${configPath}' }]\n`, 'cyan');
  } else if (fs.existsSync(babelrcPath)) {
    log('⚠️  .babelrc already exists. Add this to your plugins:', 'yellow');
    log(`\n["stylescale", { "configPath": "${configPath}" }]\n`, 'cyan');
  } else {
    fs.writeFileSync(babelrcPath, babelrcTemplate(configPath), 'utf8');
    log('✅ Created .babelrc', 'green');
  }
}

async function main() {
  console.clear();
  log('\n🎨 StyleScale Setup\n', 'bright');
  log('Automatically style React components with one config file.\n', 'cyan');
  
  // Detect environment
  const framework = detectFramework();
  const hasTypeScript = detectTypeScript();
  
  log(`Detected framework: ${framework === 'unknown' ? 'Custom setup' : framework}`, 'blue');
  log(`TypeScript detected: ${hasTypeScript ? 'Yes' : 'No'}\n`, 'blue');
  
  // Ask user questions
  const useTypeScriptAnswer = await question(`Use TypeScript config? (${hasTypeScript ? 'Y' : 'y'}/n): `);
  const useTypeScrip#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Default theme configuration
const defaultThemeJS = `// theme.config.js
module.exports = {
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
  components: {
    // Example: 'Clock': 'primary',
    // Example: 'Dashboard': 'secondary',
  },
  
  // Advanced rules for granular control
  rules: [
    // Example: 'button:primary*',              // All buttons everywhere
    // Example: 'Dashboard:button:warning',     // Buttons in Dashboard.tsx
    // Example: '.cta:danger*',                 // All .cta class elements
    // Example: 'Header:[#1a1a1a]',            // Custom color for Header
  ]
};
`;

const defaultThemeTS = `// theme.config.ts
import { ThemeConfig } from 'stylescale';

const config: ThemeConfig = {
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
  components: {
    // Example: 'Clock': 'primary',
    // Example: 'Dashboard': 'secondary',
  },
  
  // Advanced rules for granular control
  rules: [
    // Example: 'button:primary*',              // All buttons everywhere
    // Example: 'Dashboard:button:warning',     // Buttons in Dashboard.tsx
    // Example: '.cta:danger*',                 // All .cta class elements
    // Example: 'Header:[#1a1a1a]',            // Custom color for Header
  ]
};

export default config;
`;

const babelrcTemplate = (configPath) => `{
  "plugins": [
    ["stylescale", {
      "configPath": "${configPath}"
    }]
  ]
}
`;

const babelConfigTemplate = (configPath) => `module.exports = {
  plugins: [
    ['stylescale', {
      configPath: '${configPath}'
    }]
  ]
};
`;

function detectFramework() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return 'unknown';
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps.next) return 'next';
  if (deps.vite) return 'vite';
  if (deps['react-scripts']) return 'cra';
  
  return 'custom';
}

function detectTypeScript() {
  return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
}

function createThemeConfig(useTypeScript, configPath) {
  const content = useTypeScript ? defaultThemeTS : defaultThemeJS;
  fs.writeFileSync(configPath, content, 'utf8');
  log(`✅ Created ${configPath}`, 'green');
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('⚠️  No package.json found. Run npm init first.', 'yellow');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Add setup script
  if (!packageJson.scripts['stylescale:init']) {
    packageJson.scripts['stylescale:init'] = 'node node_modules/stylescale/install.js';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  log('✅ Updated package.json scripts', 'green');
}

function setupNextJS(useTypeScript, configPath) {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  
  // Create .babelrc for Next.js (works with both webpack and turbopack)
  const babelConfig = {
    presets: ['next/babel'],
    plugins: [
      ['stylescale', {
        configPath: configPath
      }]
    ]
  };
  
  fs.writeFileSync(babelrcPath, JSON.stringify(babelConfig, null, 2), 'utf8');
  log('✅ Created .babelrc', 'green');
  
  // Update next.config.js to disable Turbopack (use webpack mode for Babel)
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // StyleScale requires Babel, so we use webpack mode
  // To use webpack explicitly, run: npm run dev -- --webpack
  experimental: {
    // Turbopack doesn't support Babel plugins yet
    // This ensures Babel runs for transformations
  }
};

module.exports = nextConfig;
`;
  
  fs.writeFileSync(nextConfigPath, nextConfig, 'utf8');
  log('✅ Created/updated next.config.js', 'green');
  log('⚠️  Run with: npm run dev -- --webpack', 'yellow');
  log('⚠️  Or add to package.json: "dev": "next dev --webpack"', 'yellow');
}

function setupVite(useTypeScript, configPath) {
  const viteConfigPath = path.join(process.cwd(), useTypeScript ? 'vite.config.ts' : 'vite.config.js');
  
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['stylescale', {
            configPath: '${configPath}'
          }]
        ]
      }
    })
  ]
});
`;
  
  fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
  log(`✅ Created/updated ${useTypeScript ? 'vite.config.ts' : 'vite.config.js'}`, 'green');
}

function setupCRA(configPath) {
  const cracoConfigPath = path.join(process.cwd(), 'craco.config.js');
  
  const cracoConfig = `module.exports = {
  babel: {
    plugins: [
      ['stylescale', {
        configPath: '${configPath}'
      }]
    ]
  }
};
`;
  
  fs.writeFileSync(cracoConfigPath, cracoConfig, 'utf8');
  log('✅ Created craco.config.js', 'green');
  log('⚠️  Install CRACO: npm install @craco/craco', 'yellow');
  log('⚠️  Update package.json scripts to use craco instead of react-scripts', 'yellow');
}

function setupCustomBabel(configPath) {
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  const babelConfigPath = path.join(process.cwd(), 'babel.config.js');
  
  if (fs.existsSync(babelConfigPath)) {
    log('⚠️  babel.config.js already exists. Add this to your plugins:', 'yellow');
    log(`\n['stylescale', { configPath: '${configPath}' }]\n`, 'cyan');
  } else if (fs.existsSync(babelrcPath)) {
    log('⚠️  .babelrc already exists. Add this to your plugins:', 'yellow');
    log(`\n["stylescale", { "configPath": "${configPath}" }]\n`, 'cyan');
  } else {
    fs.writeFileSync(babelrcPath, babelrcTemplate(configPath), 'utf8');
    log('✅ Created .babelrc', 'green');
  }
}

async function main() {
  console.clear();
  log('\n🎨 StyleScale Setup\n', 'bright');
  log('Automatically style React components with one config file.\n', 'cyan');
  
  // Detect environment
  const framework = detectFramework();
  const hasTypeScript = detectTypeScript();
  
  log(`Detected framework: ${framework === 'unknown' ? 'Custom setup' : framework}`, 'blue');
  log(`TypeScript detected: ${hasTypeScript ? 'Yes' : 'No'}\n`, 'blue');
  
  // Ask user questions
  const useTypeScriptAnswer = await question(`Use TypeScript config? (${hasTypeScript ? 'Y' : 'y'}/n): `);
  const useTypeScript = useTypeScriptAnswer.toLowerCase() !== 'n';
  
  const configPath = useTypeScript ? './theme.config.ts' : './theme.config.js';
  
  log('\n📝 Setting up your project...\n', 'bright');
  
  // Create theme config
  createThemeConfig(useTypeScript, path.join(process.cwd(), useTypeScript ? 'theme.config.ts' : 'theme.config.js'));
  
  // Setup based on framework
  switch (framework) {
    case 'next':
      setupNextJS(useTypeScript, configPath);
      break;
    case 'vite':
      setupVite(useTypeScript, configPath);
      break;
    case 'cra':
      setupCRA(configPath);
      break;
    default:
      setupCustomBabel(configPath);
      break;
  }
  
  // Update package.json
  updatePackageJson();
  
  // Success message
  log('\n🎉 StyleScale is ready!\n', 'green');
  log('Quick Start:', 'bright');
  log(`1. Open ${useTypeScript ? 'theme.config.ts' : 'theme.config.js'}`, 'cyan');
  log(`2. Add a component: components: { 'Clock': 'primary' }`, 'cyan');
  log(`3. Build your project - styles apply automatically!`, 'cyan');
  log('\nExample:', 'bright');
  log(`
  components: {
    'Clock': 'primary',      // Entire Clock component gets primary theme
    'Dashboard': 'secondary' // Entire Dashboard gets secondary theme
  },
  
  rules: [
    'button:primary*',           // All buttons everywhere use primary
    'Dashboard:button:warning',  // Only Dashboard buttons use warning
    '.cta:danger*',             // All .cta elements use danger
  ]
`, 'yellow');
  
  log('📚 Documentation: https://github.com/yourusername/stylescale', 'blue');
  log('❓ Questions? Open an issue on GitHub\n', 'blue');
  
  rl.close();
}

// Run the installer
main().catch(error => {
  log(`\n❌ Error: ${error.message}\n`, 'red');
  rl.close();
  process.exit(1);
}); 
t = useTypeScriptAnswer.toLowerCase() !== 'n';
  
  const configPath = useTypeScript ? './theme.config.ts' : './theme.config.js';
  
  log('\n📝 Setting up your project...\n', 'bright');
  
  // Create theme config
  createThemeConfig(useTypeScript, path.join(process.cwd(), useTypeScript ? 'theme.config.ts' : 'theme.config.js'));
  
  // Setup based on framework
  switch (framework) {
    case 'next':
      setupNextJS(useTypeScript, configPath);
      break;
    case 'vite':
      setupVite(useTypeScript, configPath);
      break;
    case 'cra':
      setupCRA(configPath);
      break;
    default:
      setupCustomBabel(configPath);
      break;
  }
  
  // Update package.json
  updatePackageJson();
  
  // Success message
  log('\n🎉 StyleScale is ready!\n', 'green');
  log('Quick Start:', 'bright');
  log(`1. Open ${useTypeScript ? 'theme.config.ts' : 'theme.config.js'}`, 'cyan');
  log(`2. Add a component: components: { 'Clock': 'primary' }`, 'cyan');
  log(`3. Build your project - styles apply automatically!`, 'cyan');
  log('\nExample:', 'bright');
  log(`
  components: {
    'Clock': 'primary',      // Entire Clock component gets primary theme
    'Dashboard': 'secondary' // Entire Dashboard gets secondary theme
  },
  
  rules: [
    'button:primary*',           // All buttons everywhere use primary
    'Dashboard:button:warning',  // Only Dashboard buttons use warning
    '.cta:danger*',             // All .cta elements use danger
  ]
`, 'yellow');
  
  log('📚 Documentation: https://github.com/yourusername/stylescale', 'blue');
  log('❓ Questions? Open an issue on GitHub\n', 'blue');
  
  rl.close();
}

// Run the installer
main().catch(error => {
  log(`\n❌ Error: ${error.message}\n`, 'red');
  rl.close();
  process.exit(1);
});
