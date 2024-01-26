import type { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        // 主要颜色
        primary: {
          50: '#F2FFF3',
          100: '#E6FFEB',
          200: '#C0FAC6',
          300: '#95EC69',
          400: '#89D961',
          500: '#3CB371', // 浅绿色，作为主要的背景颜色
          600: '#36A665',
          700: '#258E4A',
          800: '#1C6937',
          900: '#144C26'
        },
        // 次要颜色
        secondary: {
          50: '#E6FFE6',
          100: '#CCFFCC',
          200: '#99FF99',
          300: '#66FF66',
          400: '#33FF33',
          500: '#008000', // 深绿色，作为主要文本和图标的颜色
          600: '#006600',
          700: '#004C00',
          800: '#003300',
          900: '#001900'
        },
        // 强调颜色
        accent: {
          50: '#E0FFFF',
          100: '#C1FFFF',
          200: '#85FFFF',
          300: '#4AFFFA',
          400: '#1EFFFF',
          500: '#00CED1', // 青绿色，作为按钮和链接的颜色
          600: '#00B3B3',
          700: '#008080',
          800: '#005A5A',
          900: '#003333'
        },
        // 警告提示
        warning: {
          50: '#FFFFE6',
          100: '#FFFFCC',
          200: '#FFFF99',
          300: '#FFFF66',
          400: '#FFFF33',
          500: '#FFD700', // 黄色，作为警告提示的背景色
          600: '#CCCC00',
          700: '#999900',
          800: '#666600',
          900: '#333300'
        }
      }
    }
  },
  plugins: []
} as Config
