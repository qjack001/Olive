<template>
	<writer/>
	<cursor/>
	<control-panel/>
	<font-loader/>
</template>

<script setup>
	import Writer from './components/Writer.vue'
	import Cursor from './components/Cursor.vue'
	import ControlPanel from './components/ControlPanel.vue'
	import FontLoader from './components/FontLoader.vue'
</script>

<style>
	@font-face
	{
		font-family: 'modern-typewriter';
		src: url('modern-typewriter.woff2') format('woff2'),
			url('modern-typewriter.woff') format('woff');
		font-display: swap;
	}

	@font-face
	{
		font-family: 'classic-typewriter';
		src: url('classic-typewriter.woff2') format('woff2'),
			url('classic-typewriter.woff') format('woff');
		font-display: block;
	}

	@font-face
	{
		font-family: 'old-typewriter';
		src: url('old-typewriter.woff2') format('woff2'),
			url('old-typewriter.woff') format('woff');
		font-display: block;
	}

	@font-face
	{
		font-family: 'italic-typewriter';
		src: url('italic-typewriter.woff2') format('woff2'),
			url('italic-typewriter.woff') format('woff');
		font-display: block;
	}

	body
	{
		font-family: "modern-typewriter", "classic-typewriter", "old-typewriter", "italic-typewriter", monospace;
		font-size: 14px;
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

	@media print
	{
		/* print styles */
	}
</style>
