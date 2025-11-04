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
import { ThemeConfig } from 'babel-plugin-react-auto-style';

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
    ["babel-plugin-react-auto-style", {
      "configPath": "${configPath}"
    }]
  ]
}
`;

const babelConfigTemplate = (configPath) => `module.exports = {
  plugins: [
    ['babel-plugin-react-auto-style', {
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
  if (!packageJson.scripts['auto-style:init']) {
    packageJson.scripts['auto-style:init'] = 'node node_modules/babel-plugin-react-auto-style/install.js';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  log('✅ Updated package.json scripts', 'green');
}

function setupNextJS(useTypeScript, configPath) {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            ['babel-plugin-react-auto-style', {
              configPath: '${configPath}'
            }]
          ]
        }
      }
    });
    return config;
  }
};

module.exports = nextConfig;
`;
  
  fs.writeFileSync(nextConfigPath, nextConfig, 'utf8');
  log('✅ Created/updated next.config.js', 'green');
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
          ['babel-plugin-react-auto-style', {
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
      ['babel-plugin-react-auto-style', {
        configPath: '${configPath}'
      }]
    ]
  }
};
`;
  
  fs.writeFileSync(cracoConfigPath, cracoConfig, 'utf8');
  log('✅ Created craco.config.js', 'green');
  log('⚠️  Make sure to install CRACO: npm install @craco/craco', 'yellow');
  log('⚠️  Update package.json scripts to use craco instead of react-scripts', 'yellow');
}

function setupCustomBabel(configPath) {
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  const babelConfigPath = path.join(process.cwd(), 'babel.config.js');
  
  if (fs.existsSync(babelConfigPath)) {
    // Append to existing babel.config.js
    log('⚠️  babel.config.js already exists. Please manually add the plugin:', 'yellow');
    log(`\n${babelConfigTemplate(configPath)}\n`, 'cyan');
  } else if (fs.existsSync(babelrcPath)) {
    // Append to existing .babelrc
    log('⚠️  .babelrc already exists. Please manually add the plugin:', 'yellow');
    log(`\n${babelrcTemplate(configPath)}\n`, 'cyan');
  } else {
    // Create new .babelrc
    fs.writeFileSync(babelrcPath, babelrcTemplate(configPath), 'utf8');
    log('✅ Created .babelrc', 'green');
  }
}

async function main() {
  console.clear();
  log('\n🎨 React Auto-Style Setup\n', 'bright');
  log('This installer will configure babel-plugin-react-auto-style for your project.\n', 'cyan');
  
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
  log('\n🎉 Setup complete!\n', 'green');
  log('Next steps:', 'bright');
  log(`1. Edit ${useTypeScript ? 'theme.config.ts' : 'theme.config.js'} to define your themes`, 'cyan');
  log('2. Add components to the "components" object to auto-style them', 'cyan');
  log('3. Use the "rules" array for advanced styling control', 'cyan');
  log('\nExample:', 'bright');
  log(`
  components: {
    'Clock': 'primary',
    'Dashboard': 'secondary'
  },
  
  rules: [
    'button:primary*',           // All buttons everywhere
    'Dashboard:button:warning',  // Buttons in Dashboard.tsx
  ]
`, 'yellow');
  
  log('\n📚 Documentation: https://github.com/yourusername/babel-plugin-react-auto-style', 'blue');
  log('❓ Questions? Open an issue on GitHub\n', 'blue');
  
  rl.close();
}

// Run the installer
main().catch(error => {
  log(`\n❌ Error: ${error.message}\n`, 'red');
  rl.close();
  process.exit(1);
});