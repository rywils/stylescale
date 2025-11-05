// index.d.ts - TypeScript definitions for stylescale

declare module 'stylescale' {
  import { PluginObj } from '@babel/core';

  /**
   * Color theme definition with main, light, dark, and text colors
   */
  export interface ColorTheme {
    /** Main/primary color for the theme */
    main: string;
    /** Lighter shade for accents, headings */
    light: string;
    /** Darker shade for emphasis, buttons */
    dark: string;
    /** Text color for contrast (usually white or black) */
    text: string;
  }

  /**
   * Theme configuration object
   */
  export interface ThemeConfig {
    /**
     * Define your color themes with any custom names
     * @example
     * {
     *   primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', text: '#ffffff' },
     *   ocean: { main: '#0ea5e9', light: '#38bdf8', dark: '#0284c7', text: '#ffffff' },
     *   sunset: { main: '#f97316', light: '#fb923c', dark: '#ea580c', text: '#ffffff' }
     * }
     */
    colors: Record<string, ColorTheme>;

    /**
     * Map component filenames to theme names
     * This auto-styles the entire component with the specified theme
     * @example
     * {
     *   'Clock': 'primary',
     *   'Dashboard': 'ocean',
     *   'UserCard': 'sunset'
     * }
     */
    components?: Record<string, string>;

    /**
     * Advanced rules for granular control over styling
     * 
     * Rule Syntax:
     * - Global: `button:primary*` (all buttons everywhere)
     * - File-scoped: `Clock:primary` (entire Clock.tsx)
     * - Element in file: `Dashboard:button:warning` (buttons in Dashboard.tsx)
     * - Class selector: `.cta:danger*` (all .cta elements)
     * - ID selector: `#submit:success*` (all #submit elements)
     * - Custom colors: `button:[#ff0000]` or `[var(--brand)]`
     * 
     * @example
     * [
     *   'button:primary*',              // All buttons everywhere
     *   'Dashboard:button:warning',     // Buttons in Dashboard.tsx
     *   '.cta:danger*',                 // All .cta class elements
     *   'Header:[#1a1a1a]',            // Custom color for Header
     *   'Modal:button:[var(--brand)]'  // CSS variable for Modal buttons
     * ]
     */
    rules?: string[];

    /**
     * Dark mode theme overrides
     * Maps component names to theme names for dark mode
     * @example
     * {
     *   'Dashboard': 'darkTheme',
     *   'Header': 'midnight'
     * }
     */
    darkMode?: Record<string, string>;
  }

  /**
   * Plugin options for configuring the Babel plugin
   */
  export interface PluginOptions {
    /**
     * Path to your theme configuration file
     * @default './theme.config.js'
     */
    configPath?: string;
  }

  /**
   * Babel plugin function
   */
  export default function plugin(api: any): PluginObj;
}

/**
 * Type definition for theme.config.js files
 * Use this in your theme configuration for autocomplete and type checking
 * 
 * @example
 * // theme.config.js
 * /** @type {import('stylescale').ThemeConfig} *\/
 * module.exports = {
 *   colors: {
 *     primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', text: '#ffffff' }
 *   },
 *   components: {
 *     'Clock': 'primary'
 *   }
 * };
 */
declare module 'theme.config' {
  import { ThemeConfig } from 'stylescale';
  const config: ThemeConfig;
  export default config;
}