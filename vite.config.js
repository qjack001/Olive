import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
	base: path.resolve(__dirname, './dist/'),
	plugins: [
		vue(),
		VitePWA({
			manifest: {
				"name": "Typeright",
				"short_name": "Typeright",
				"icons": [
					{
						"src": "/android-chrome-192x192.png",
						"sizes": "192x192",
						"type": "image/png"
					},
					{
						"src": "/android-chrome-512x512.png",
						"sizes": "512x512",
						"type": "image/png"
					}
				],
				"theme_color": "#efefef",
				"background_color": "#efefef",
				"display": "standalone",
				"start_url": "/"
			}
		})
	]
})
