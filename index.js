// babel-plugin-react-auto-style/index.js
const path = require('path');
const fs = require('fs');

module.exports = function ({ types: t }) {
  let config = null;
  let currentFileName = null;
  let currentComponentName = null;

  // Load theme config
  function loadConfig(configPath) {
    if (config) return config;
    
    const fullPath = path.resolve(process.cwd(), configPath);
    if (fs.existsSync(fullPath)) {
      delete require.cache[require.resolve(fullPath)];
      config = require(fullPath);
      return config;
    }
    
    console.warn(`[react-auto-style] Config file not found at ${fullPath}`);
    return null;
  }

  // Get component name from file path or function declaration
  function getComponentName(filePath) {
    if (!filePath) return null;
    const fileName = path.basename(filePath, path.extname(filePath));
    if (fileName === 'index') {
      return path.basename(path.dirname(filePath));
    }
    return fileName;
  }

  // Parse color value (hex, rgb, rgba, oklch, CSS var)
  function parseColorValue(colorStr) {
    if (!colorStr) return null;
    
    // Handle [#hex], [rgb()], [rgba()], [oklch()], [var(--color)]
    const match = colorStr.match(/\[(.*?)\]/);
    if (match) {
      return match[1]; // Return the raw color value
    }
    
    return null;
  }

  // Convert color to Tailwind or custom CSS
  function getColorValue(colorInput) {
    // If it's already a Tailwind color
    if (typeof colorInput === 'string' && !colorInput.startsWith('#')) {
      return colorInput;
    }

    // Hex color mapping to Tailwind
    const colorMap = {
      '#3b82f6': 'blue-500', '#60a5fa': 'blue-400', '#2563eb': 'blue-600', '#1d4ed8': 'blue-700',
      '#8b5cf6': 'purple-500', '#a78bfa': 'purple-400', '#7c3aed': 'purple-600', '#6d28d9': 'purple-700',
      '#a855f7': 'fuchsia-500', '#c084fc': 'fuchsia-400', '#9333ea': 'fuchsia-600', '#7e22ce': 'fuchsia-700',
      '#10b981': 'green-500', '#34d399': 'green-400', '#059669': 'green-600', '#047857': 'green-700',
      '#ef4444': 'red-500', '#f87171': 'red-400', '#dc2626': 'red-600', '#b91c1c': 'red-700',
      '#f59e0b': 'amber-500', '#fbbf24': 'amber-400', '#d97706': 'amber-600', '#b45309': 'amber-700',
      '#ffffff': 'white', '#000000': 'black'
    };
    
    return colorMap[colorInput?.toLowerCase()] || 'gray-500';
  }

  // Generate custom color classes for non-standard colors
  function generateCustomColorClass(color, property = 'bg') {
    if (!color) return [];
    
    // If it's a CSS variable or custom value, return as-is for inline styles
    if (color.startsWith('var(') || color.startsWith('#') || color.startsWith('rgb') || color.startsWith('oklch')) {
      // We'll need to use inline styles for custom colors
      return [`[${property}:${color}]`]; // Tailwind JIT arbitrary value
    }
    
    return [];
  }

  // Smart styling rules for different elements
  function getStylesForElement(elementName, themeOrColor, colorConfig, isDarkMode = false) {
    let colors;
    
    // Check if themeOrColor is a custom color (from brackets)
    const customColor = parseColorValue(themeOrColor);
    if (customColor) {
      // Handle custom colors
      const bgColor = `[background-color:${customColor}]`;
      const textColor = `[color:white]`; // Default to white text for custom backgrounds
      
      const styleMap = {
        div: [bgColor, textColor, 'p-6', 'rounded-lg', 'shadow-lg'],
        button: [bgColor, `hover:[background-color:${customColor}]/90`, textColor, 'px-4', 'py-2', 'rounded-lg', 'font-medium', 'transition-colors', 'cursor-pointer'],
        h1: ['text-4xl', 'font-bold', textColor, 'mb-4'],
        h2: ['text-3xl', 'font-bold', textColor, 'mb-4'],
        h3: ['text-2xl', 'font-semibold', textColor, 'mb-3'],
        p: [textColor, 'opacity-90', 'mb-2'],
        input: [`border-2`, `[border-color:${customColor}]`, 'rounded-lg', 'px-4', 'py-2', 'bg-white', 'text-gray-900', 'focus:outline-none'],
        a: [`[color:${customColor}]`, 'hover:underline', 'transition-colors']
      };
      
      return styleMap[elementName] || [];
    }
    
    // Otherwise use theme colors
    colors = colorConfig.colors[themeOrColor];
    if (!colors) return [];

    const darkPrefix = isDarkMode ? 'dark:' : '';
    
    const styleMap = {
      div: [
        `${darkPrefix}bg-gradient-to-br`,
        `${darkPrefix}from-${getColorValue(colors.main)}`,
        `${darkPrefix}to-${getColorValue(colors.dark)}`,
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`,
        'p-6', 'rounded-lg', 'shadow-lg'
      ],
      h1: [
        'text-4xl', 'font-bold',
        `${darkPrefix}text-${getColorValue(colors.light)}`,
        'mb-4'
      ],
      h2: [
        'text-3xl', 'font-bold',
        `${darkPrefix}text-${getColorValue(colors.light)}`,
        'mb-4'
      ],
      h3: [
        'text-2xl', 'font-semibold',
        `${darkPrefix}text-${getColorValue(colors.light)}`,
        'mb-3'
      ],
      h4: [
        'text-xl', 'font-semibold',
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`,
        'mb-2'
      ],
      p: [
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`,
        'opacity-90', 'mb-2'
      ],
      button: [
        `${darkPrefix}bg-${getColorValue(colors.dark)}`,
        `${darkPrefix}hover:bg-${getColorValue(colors.main)}`,
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`,
        'px-4', 'py-2', 'rounded-lg', 'font-medium',
        'transition-colors', 'duration-200',
        'shadow-md', 'hover:shadow-lg', 'cursor-pointer'
      ],
      input: [
        'border-2',
        `${darkPrefix}border-${getColorValue(colors.light)}`,
        `${darkPrefix}focus:border-${getColorValue(colors.dark)}`,
        'rounded-lg', 'px-4', 'py-2',
        'bg-white', 'text-gray-900',
        'focus:outline-none', 'focus:ring-2',
        `${darkPrefix}focus:ring-${getColorValue(colors.main)}`,
        'focus:ring-opacity-50'
      ],
      a: [
        `${darkPrefix}text-${getColorValue(colors.light)}`,
        `${darkPrefix}hover:text-${getColorValue(colors.text || '#ffffff')}`,
        'underline', 'transition-colors'
      ],
      span: [
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`
      ],
      label: [
        `${darkPrefix}text-${getColorValue(colors.text || '#ffffff')}`,
        'font-medium', 'mb-2', 'block'
      ]
    };

    return styleMap[elementName] || [];
  }

  // Parse rule syntax: filename:button:primary, button:primary*, .classname:primary, #id:primary
  function parseRule(rule) {
    const parts = rule.split(':');
    const isGlobal = rule.endsWith('*');
    const cleanRule = rule.replace('*', '');
    const cleanParts = cleanRule.split(':');

    let selector = {
      isGlobal,
      filename: null,
      element: null,
      classOrId: null,
      theme: null
    };

    // Determine what each part represents
    if (cleanParts.length === 1) {
      // Just a theme or element: "primary" or "button"
      selector.theme = cleanParts[0];
    } else if (cleanParts.length === 2) {
      // Two parts: could be filename:theme, element:theme, or .class:theme
      const first = cleanParts[0];
      const second = cleanParts[1];
      
      if (first.startsWith('.') || first.startsWith('#')) {
        // .classname:primary or #id:primary
        selector.classOrId = first;
        selector.theme = second;
      } else if (['button', 'div', 'input', 'a', 'h1', 'h2', 'h3', 'h4', 'p', 'span', 'label'].includes(first)) {
        // element:primary
        selector.element = first;
        selector.theme = second;
      } else {
        // filename:primary
        selector.filename = first;
        selector.theme = second;
      }
    } else if (cleanParts.length === 3) {
      // filename:element:theme or filename:.class:theme
      selector.filename = cleanParts[0];
      
      if (cleanParts[1].startsWith('.') || cleanParts[1].startsWith('#')) {
        selector.classOrId = cleanParts[1];
      } else {
        selector.element = cleanParts[1];
      }
      
      selector.theme = cleanParts[2];
    }

    return selector;
  }

  // Check if element matches a rule
  function matchesRule(elementName, className, id, componentName, rule) {
    const selector = parseRule(rule);

    // Check filename match
    if (selector.filename && selector.filename !== componentName) {
      return false;
    }

    // Check element match
    if (selector.element && selector.element !== elementName) {
      return false;
    }

    // Check class/id match
    if (selector.classOrId) {
      if (selector.classOrId.startsWith('.')) {
        const classToMatch = selector.classOrId.substring(1);
        if (!className || !className.split(' ').includes(classToMatch)) {
          return false;
        }
      } else if (selector.classOrId.startsWith('#')) {
        const idToMatch = selector.classOrId.substring(1);
        if (id !== idToMatch) {
          return false;
        }
      }
    }

    return selector;
  }

  // Get applicable rules for an element
  function getApplicableRules(elementName, className, id, componentName, config) {
    if (!config.rules) return [];

    const applicableRules = [];

    for (const rule of config.rules) {
      const match = matchesRule(elementName, className, id, componentName, rule);
      if (match) {
        applicableRules.push(match);
      }
    }

    return applicableRules;
  }

  // Merge className values
  function mergeClassNames(existing, newClasses) {
    if (!existing) return newClasses.join(' ');
    
    const existingClasses = existing.split(' ');
    const merged = [...existingClasses];
    
    newClasses.forEach(newClass => {
      const [property] = newClass.split('-');
      const hasConflict = existingClasses.some(existing => 
        existing.startsWith(property + '-') || existing === property
      );
      
      if (!hasConflict) {
        merged.push(newClass);
      }
    });
    
    return merged.join(' ');
  }

  // Extract className and id from JSX attributes
  function getElementIdentifiers(attributes) {
    let className = null;
    let id = null;

    attributes.forEach(attr => {
      if (t.isJSXAttribute(attr)) {
        if (attr.name.name === 'className' && t.isStringLiteral(attr.value)) {
          className = attr.value.value;
        } else if (attr.name.name === 'id' && t.isStringLiteral(attr.value)) {
          id = attr.value.value;
        }
      }
    });

    return { className, id };
  }

  return {
    name: 'react-auto-style',
    visitor: {
      Program: {
        enter(programPath, state) {
          const configPath = state.opts.configPath || './theme.config.js';
          loadConfig(configPath);
          currentFileName = state.file.opts.filename;
          currentComponentName = getComponentName(currentFileName);
        }
      },

      FunctionDeclaration(path) {
        if (path.node.id && path.node.id.name) {
          currentComponentName = path.node.id.name;
        }
      },

      VariableDeclarator(path) {
        if (
          path.node.id.type === 'Identifier' &&
          path.node.init &&
          (path.node.init.type === 'ArrowFunctionExpression' ||
            path.node.init.type === 'FunctionExpression')
        ) {
          currentComponentName = path.node.id.name;
        }
      },

      JSXOpeningElement(path) {
        if (!config || !currentComponentName) return;

        const elementName = path.node.name.name;
        if (!elementName || typeof elementName !== 'string') return;

        const { className, id } = getElementIdentifiers(path.node.attributes);

        let stylesToApply = [];

        // Priority 1: Check specific rules (global and local)
        const applicableRules = getApplicableRules(elementName, className, id, currentComponentName, config);
        
        for (const rule of applicableRules) {
          const styles = getStylesForElement(elementName, rule.theme, config);
          stylesToApply.push(...styles);
        }

        // Priority 2: Check component-level theme (filename:theme)
        if (stylesToApply.length === 0 && config.components && config.components[currentComponentName]) {
          const componentTheme = config.components[currentComponentName];
          const styles = getStylesForElement(elementName, componentTheme, config);
          stylesToApply.push(...styles);
        }

        // Priority 3: Dark mode support
        if (config.darkMode && config.darkMode[currentComponentName]) {
          const darkTheme = config.darkMode[currentComponentName];
          const darkStyles = getStylesForElement(elementName, darkTheme, config, true);
          stylesToApply.push(...darkStyles);
        }

        if (stylesToApply.length === 0) return;

        // Apply styles to element
        const classNameAttr = path.node.attributes.find(
          attr => t.isJSXAttribute(attr) && attr.name.name === 'className'
        );

        if (classNameAttr) {
          if (t.isStringLiteral(classNameAttr.value)) {
            const merged = mergeClassNames(classNameAttr.value.value, stylesToApply);
            classNameAttr.value = t.stringLiteral(merged);
          } else if (t.isJSXExpressionContainer(classNameAttr.value)) {
            const newStyles = stylesToApply.join(' ');
            const originalExpr = classNameAttr.value.expression;
            
            classNameAttr.value = t.jsxExpressionContainer(
              t.templateLiteral(
                [
                  t.templateElement({ raw: newStyles + ' ', cooked: newStyles + ' ' }),
                  t.templateElement({ raw: '', cooked: '' }, true)
                ],
                [originalExpr]
              )
            );
          }
        } else {
          const newAttr = t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(stylesToApply.join(' '))
          );
          path.node.attributes.push(newAttr);
        }
      }
    }
  };
};