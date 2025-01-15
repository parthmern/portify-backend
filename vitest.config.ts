// import { defineConfig } from 'vitest/config'

// export default defineConfig({
//   test: {
//     globals: true
//   },
  
// })

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})