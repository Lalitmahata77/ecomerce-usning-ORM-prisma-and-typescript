import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// import { plugin } from 'postcss'
// import daisyui from "daisyui"
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
