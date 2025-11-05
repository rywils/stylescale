# StyleScale Tests

This directory contains comprehensive tests for the StyleScale Babel plugin.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- plugin.test.js
```

## Test Structure

### `plugin.test.js`
Main test file covering:

#### Basic Component Theming
- Adding classes to simple components
- Styling mapped components
- Handling unmapped components

#### Manual className Preservation
- Preserving existing className attributes
- Merging with existing classes
- Handling className expressions

#### Global Rules
- Applying global element rules (`button:primary*`)
- Applying global class rules (`.custom-class:primary*`)
- Applying global ID rules (`#submit:success*`)

#### File-Scoped Rules
- File-specific element rules (`TestComponent:button:warning`)
- File-specific class rules (`Modal:.header:purple`)
- Ensuring rules don't leak to other files

#### Custom Colors
- Hex colors in brackets (`[#ff0000]`)
- RGB/RGBA colors (`[rgb(255,0,0)]`)
- CSS variables (`[var(--custom-color)]`)
- OKLCH colors (`[oklch(0.7 0.2 180)]`)

#### Element Type Detection
- Headings (h1-h6) with hierarchy
- Paragraphs with proper styling
- Buttons with hover states
- Inputs with focus states
- Links with transitions
- Labels and spans

#### Component Name Detection
- Function declarations
- Arrow functions
- Anonymous functions (uses filename)
- Default exports

#### Multiple Elements
- Nested element styling
- Sibling elements
- Complex component trees

#### Edge Cases
- Components with no JSX
- Empty components
- Custom React components
- Missing config files

## Test Coverage Goals

- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

## Writing New Tests

When adding new features, follow this pattern:

```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    const input = `
      function Component() {
        return <element>content</element>;
      }
    `;
    
    const output = transform(input);
    
    expect(output).toContain('expected-class');
  });
});
```

## Mocking

The tests use a mock config:

```javascript
const mockConfig = {
  colors: {
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', text: '#ffffff' },
    secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', text: '#ffffff' }
  },
  components: {
    'TestComponent': 'primary'
  },
  rules: [
    'button:primary*',
    'TestComponent:div:secondary',
    '.custom-class:primary*'
  ]
};
```

Modify this for specific test scenarios.

## Continuous Integration

These tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Before publishing to npm

## Troubleshooting

### Tests Failing?

1. **Check Babel version**: Ensure `@babel/core` is installed
2. **Clear cache**: `npm test -- --clearCache`
3. **Check config**: Verify mock config matches plugin expectations
4. **Update snapshots**: `npm test -- -u` (if using snapshots)

### Temp Files Not Cleaning Up?

The tests create temporary config files. They should auto-delete, but if not:

```bash
rm __tests__/temp-theme.config.js
```

## Future Test Additions

- [ ] Dark mode transformation tests
- [ ] Performance benchmarks
- [ ] Integration tests with real projects
- [ ] TypeScript config file tests
- [ ] Responsive variant tests
- [ ] Complex selector matching tests