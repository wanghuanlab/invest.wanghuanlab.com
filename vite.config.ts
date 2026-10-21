import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import net from 'node:net'

function isPortOccupied(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' })
    socket.setTimeout(200)
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.once('error', () => {
      const server = net.createServer()
      server.once('error', () => resolve(true))
      server.listen(port, '0.0.0.0', () => {
        server.close(() => resolve(false))
      })
    })
  })
}

async function getAvailablePort(startPort = 5173): Promise<number> {
  let port = startPort
  while (await isPortOccupied(port)) {
    port++
  }
  return port
}

export default defineConfig(async () => {
  const port = await getAvailablePort(5173)

  return {
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      allowedHosts: ['invest.wanghuanlab.com'],
    },
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'node',
    },
  }
})

