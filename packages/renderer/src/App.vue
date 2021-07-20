<template>
	<div id="drag-region"></div>
	<writer/>
	<cursor/>
	<panel/>
	<font-loader/>
</template>

<script setup>
	import { onMounted } from 'vue'
	import Writer from './components/Writer.vue'
	import Cursor from './components/Cursor.vue'
	import Panel from './components/Panel.vue'
	import FontLoader from './components/FontLoader.vue'

	onMounted(() => { 
		window.menu.receive('set_font', (font) => document.body.className = font)
		window.menu.receive('set_color', (color) => document.documentElement.className = color)
	})
</script>

<style>
	@font-face
	{
		font-family: 'modern-typewriter';
		src: url('/modern-typewriter.woff2') format('woff2'),
			url('/modern-typewriter.woff') format('woff');
		font-display: swap;
	}

	@font-face
	{
		font-family: 'classic-typewriter';
		src: url('/classic-typewriter.woff2') format('woff2'),
			url('/classic-typewriter.woff') format('woff');
		font-display: block;
	}

	@font-face
	{
		font-family: 'old-typewriter';
		src: url('/old-typewriter.woff2') format('woff2'),
			url('/old-typewriter.woff') format('woff');
		font-display: block;
	}

	@font-face
	{
		font-family: 'italic-typewriter';
		src: url('/italic-typewriter.woff2') format('woff2'),
			url('/italic-typewriter.woff') format('woff');
		font-display: block;
	}

	html
	{
		--background: rgb(255 255 255);
		--tint: rgb(238 238 238 / 50%);
	}

	html.aged
	{
		--background: rgb(255 246 232);
		--tint: rgb(210 199 175 / 50%);
	}

	html.red
	{
		--background: rgb(204 107 107);
		--tint: rgb(165 78 78 / 50%);
	}

	html.blue
	{
		--background: rgb(157 181 222);
		--tint: rgb(118 141 181 / 50%);
	}

	html.green
	{
		--background: rgb(157 222 187);
		--tint: rgb(98 183 137 / 50%);
	}

	html.purple
	{
		--background: rgb(159 132 208);
		--tint: rgb(126 100 173 / 50%);
	}

	html.pink
	{
		--background: rgb(255 212 249);
		--tint: rgb(206 158 199 / 50%);
	}

	html.brown
	{
		--background: rgb(169 139 106);
		--tint: rgb(144 111 72 / 50%);
	}

	body
	{
		font-family: "modern-typewriter", "classic-typewriter", "old-typewriter", "italic-typewriter", monospace;
		font-size: 14px;
		background: var(--background);
	}

	body.modern
	{
		font-family: "modern-typewriter", monospace;
	}

	body.classic
	{
		font-family: "classic-typewriter", monospace;
	}

	body.old
	{
		font-family: "old-typewriter", monospace;
		font-size: 12px; /* adjustment for specific font */
	}

	body.italic
	{
		font-family: "italic-typewriter", monospace;
		font-size: 12px; /* adjustment for specific font */
	}

	#drag-region
	{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 40px;
		z-index: 9999;
		-webkit-app-region: drag;
	}

	@media print
	{
		/* print styles */
	}
</style>
