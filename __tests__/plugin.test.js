// __tests__/plugin.test.js
const babel = require('@babel/core');
const plugin = require('../index');
const path = require('path');
const fs = require('fs');

// Mock theme config
const mockConfig = {
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
    }
  },
  components: {
    'TestComponent': 'primary',
    'AnotherComponent': 'secondary'
  },
  rules: [
    'button:primary*',
    'TestComponent:div:secondary',
    '.custom-class:primary*'
  ]
};

// Helper to create a temporary config file
function createTempConfig(config) {
  const configPath = path.join(__dirname, 'temp-theme.config.js');
  fs.writeFileSync(
    configPath,
    `module.exports = ${JSON.stringify(config, null, 2)};`
  );
  return configPath;
}

// Helper to run Babel transformation
function transform(code, filename = 'TestComponent.jsx') {
  const configPath = createTempConfig(mockConfig);
  
  const result = babel.transform(code, {
    filename: path.join(__dirname, filename),
    plugins: [
      '@babel/plugin-syntax-jsx',
      [plugin, { configPath }]
    ]
  });
  
  // Cleanup
  fs.unlinkSync(configPath);
  
  return result.code;
}

describe('StyleScale Babel Plugin', () => {
  
  describe('Basic Component Theming', () => {
    test('should add classes to a simple component', () => {
      const input = `
        function TestComponent() {
          return <div><button>Click</button></div>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('className=');
      expect(output).toContain('bg-gradient-to-br');
      expect(output).toContain('from-blue-500');
    });

    test('should style elements in mapped component', () => {
      const input = `
        function TestComponent() {
          return <button>Click Me</button>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('bg-blue-600');
      expect(output).toContain('hover:bg-blue-500');
      expect(output).toContain('text-white');
      expect(output).toContain('px-4');
      expect(output).toContain('py-2');
    });

    test('should not style unmapped components', () => {
      const input = `
        function UnmappedComponent() {
          return <button>Click Me</button>;
        }
      `;
      
      const output = transform(input, 'UnmappedComponent.jsx');
      
      // Should still have button but with global rule styling
      expect(output).toContain('<button');
    });
  });

  describe('Manual className Preservation', () => {
    test('should preserve existing className', () => {
      const input = `
        function TestComponent() {
          return <button className="my-custom-class">Click</button>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('my-custom-class');
      expect(output).toContain('className=');
    });

    test('should merge with existing className', () => {
      const input = `
        function TestComponent() {
          return <div className="existing-class">Content</div>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('existing-class');
      // Should also have auto-generated classes
      expect(output).toContain('bg-gradient-to-br');
    });

    test('should preserve className expressions', () => {
      const input = `
        function TestComponent() {
          const customClass = "dynamic-class";
          return <button className={customClass}>Click</button>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('customClass');
    });
  });

  describe('Global Rules', () => {
    test('should apply global button rule everywhere', () => {
      const input = `
        function AnyComponent() {
          return <button>Global Button</button>;
        }
      `;
      
      const output = transform(input, 'AnyComponent.jsx');
      
      // Global rule: button:primary* should apply
      expect(output).toContain('bg-blue-600');
      expect(output).toContain('hover:bg-blue-500');
    });

    test('should apply global class rule', () => {
      const input = `
        function AnyComponent() {
          return <div className="custom-class">Content</div>;
        }
      `;
      
      const output = transform(input, 'AnyComponent.jsx');
      
      expect(output).toContain('custom-class');
      // Should have styling from .custom-class:primary* rule
      expect(output).toContain('className=');
    });
  });

  describe('File-Scoped Rules', () => {
    test('should apply file-specific element rules', () => {
      const input = `
        function TestComponent() {
          return <div>Test</div>;
        }
      `;
      
      const output = transform(input);
      
      // TestComponent:div:secondary rule should override component theme
      expect(output).toContain('from-purple-500');
    });

    test('should not apply file rules to other files', () => {
      const input = `
        function OtherComponent() {
          return <div>Test</div>;
        }
      `;
      
      const output = transform(input, 'OtherComponent.jsx');
      
      // Should not have TestComponent:div:secondary styling
      expect(output).not.toContain('from-purple-500');
    });
  });

  describe('Custom Colors', () => {
    test('should handle hex colors in brackets', () => {
      const customConfig = {
        ...mockConfig,
        rules: ['TestComponent:[#ff0000]']
      };
      
      const configPath = createTempConfig(customConfig);
      
      const input = `
        function TestComponent() {
          return <div>Red Component</div>;
        }
      `;
      
      const result = babel.transform(input, {
        filename: path.join(__dirname, 'TestComponent.jsx'),
        plugins: [
          '@babel/plugin-syntax-jsx',
          [plugin, { configPath }]
        ]
      });
      
      fs.unlinkSync(configPath);
      
      expect(result.code).toContain('[background-color:#ff0000]');
    });

    test('should handle CSS variables', () => {
      const customConfig = {
        ...mockConfig,
        rules: ['TestComponent:[var(--custom-color)]']
      };
      
      const configPath = createTempConfig(customConfig);
      
      const input = `
        function TestComponent() {
          return <div>Variable Color</div>;
        }
      `;
      
      const result = babel.transform(input, {
        filename: path.join(__dirname, 'TestComponent.jsx'),
        plugins: [
          '@babel/plugin-syntax-jsx',
          [plugin, { configPath }]
        ]
      });
      
      fs.unlinkSync(configPath);
      
      expect(result.code).toContain('var(--custom-color)');
    });
  });

  describe('Element Type Detection', () => {
    test('should style h1 elements correctly', () => {
      const input = `
        function TestComponent() {
          return <h1>Title</h1>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('text-4xl');
      expect(output).toContain('font-bold');
    });

    test('should style h2 elements correctly', () => {
      const input = `
        function TestComponent() {
          return <h2>Subtitle</h2>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('text-3xl');
      expect(output).toContain('font-bold');
    });

    test('should style paragraph elements', () => {
      const input = `
        function TestComponent() {
          return <p>Paragraph text</p>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('opacity-90');
      expect(output).toContain('mb-2');
    });

    test('should style input elements', () => {
      const input = `
        function TestComponent() {
          return <input type="text" />;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('border-2');
      expect(output).toContain('rounded-lg');
      expect(output).toContain('px-4');
    });

    test('should style link elements', () => {
      const input = `
        function TestComponent() {
          return <a href="#">Link</a>;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('underline');
      expect(output).toContain('transition-colors');
    });
  });

  describe('Component Name Detection', () => {
    test('should detect function declaration names', () => {
      const input = `
        function MyComponent() {
          return <div>Test</div>;
        }
      `;
      
      const customConfig = {
        ...mockConfig,
        components: { 'MyComponent': 'primary' }
      };
      
      const configPath = createTempConfig(customConfig);
      
      const result = babel.transform(input, {
        filename: path.join(__dirname, 'MyComponent.jsx'),
        plugins: [
          '@babel/plugin-syntax-jsx',
          [plugin, { configPath }]
        ]
      });
      
      fs.unlinkSync(configPath);
      
      expect(result.code).toContain('bg-gradient-to-br');
    });

    test('should detect arrow function names', () => {
      const input = `
        const ArrowComponent = () => {
          return <div>Test</div>;
        };
      `;
      
      const customConfig = {
        ...mockConfig,
        components: { 'ArrowComponent': 'primary' }
      };
      
      const configPath = createTempConfig(customConfig);
      
      const result = babel.transform(input, {
        filename: path.join(__dirname, 'ArrowComponent.jsx'),
        plugins: [
          '@babel/plugin-syntax-jsx',
          [plugin, { configPath }]
        ]
      });
      
      fs.unlinkSync(configPath);
      
      expect(result.code).toContain('bg-gradient-to-br');
    });

    test('should use filename when function is anonymous', () => {
      const input = `
        export default function() {
          return <div>Test</div>;
        }
      `;
      
      // Should use filename (TestComponent) for lookup
      const output = transform(input);
      
      expect(output).toContain('bg-gradient-to-br');
    });
  });

  describe('Multiple Elements', () => {
    test('should style nested elements correctly', () => {
      const input = `
        function TestComponent() {
          return (
            <div>
              <h2>Title</h2>
              <p>Description</p>
              <button>Click</button>
            </div>
          );
        }
      `;
      
      const output = transform(input);
      
      // div should have styles
      expect(output).toContain('bg-gradient-to-br');
      // h2 should have styles
      expect(output).toContain('text-3xl');
      // p should have styles
      expect(output).toContain('opacity-90');
      // button should have styles
      expect(output).toContain('hover:bg-blue-500');
    });
  });

  describe('Edge Cases', () => {
    test('should handle components with no JSX', () => {
      const input = `
        function TestComponent() {
          return null;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('null');
    });

    test('should handle empty components', () => {
      const input = `
        function TestComponent() {
          return <div />;
        }
      `;
      
      const output = transform(input);
      
      expect(output).toContain('<div');
    });

    test('should not crash on custom components', () => {
      const input = `
        function TestComponent() {
          return <CustomComponent>Test</CustomComponent>;
        }
      `;
      
      const output = transform(input);
      
      // Should not try to style custom components
      expect(output).toContain('CustomComponent');
    });
  });
});

describe('Config Loading', () => {
  test('should handle missing config file gracefully', () => {
    const input = `
      function Test() {
        return <div>Test</div>;
      }
    `;
    
    // Don't create config file
    const result = babel.transform(input, {
      filename: path.join(__dirname, 'Test.jsx'),
      plugins: [
        '@babel/plugin-syntax-jsx',
        [plugin, { configPath: './nonexistent.config.js' }]
      ]
    });
    
    // Should not crash, just not apply styles
    expect(result.code).toBeDefined();
  });
});