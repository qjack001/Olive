<template>
	<template v-if="page == 'help'">
		<window-drag-region closePage="HELP"/>
		<help/>
	</template>
	<template v-else-if="page == 'settings'">
		<window-drag-region/>
		<settings/>
	</template>
	<template v-else>
		<window-drag-region/>
		<writer/>
		<cursor/>
		<panel/>
	</template>
	
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import { Color, ColorName, TintColor, DEFAULT_COLOR, CssColor } from './paper-color'
	import { userPreferences } from './preferences'
	import WindowDragRegion from './components/WindowDragRegion.vue'
	import Writer from './components/Writer.vue'
	import Cursor from './components/Cursor.vue'
	import Panel from './components/Panel.vue'
	import Help from './components/Help.vue'
	import Settings from './components/Settings.vue'

	const page = ref<string | null>(null)

	onMounted(() => {
		page.value = new URLSearchParams(document.location.search).get('page')

		setRootCssVariables(Color[DEFAULT_COLOR], TintColor[DEFAULT_COLOR])
		window.menu?.send('set_color', DEFAULT_COLOR)
		window.menu?.receive('set_color', (color: ColorName) => {
			if (color) {
				setRootCssVariables(Color[color], TintColor[color])
			}
		})
	})

	function setRootCssVariables(backgroundColor: CssColor, tintColor: CssColor): void
	{
		document.documentElement.style.setProperty('--background', backgroundColor)
		document.documentElement.style.setProperty('--tint', tintColor)
	}
</script>

<style>
	@font-face
	{
		font-family: 'Olivetti';
		src: url('/font/olivetti.woff2') format('woff2'),
			url('/font/olivetti.woff') format('woff');
		font-display: block;
	}

	@font-face
	{
		font-family: 'Atari';
		src: url('/font/atari.woff2') format('woff2'),
			url('/font/atari.woff') format('woff');
		font-weight: bold;
		font-display: block;
	}

	body
	{
		font-family: 'Olivetti', monospace;
		font-size: 16px;
		background: var(--background);
		overflow: hidden;
	}

	h1
	{
		font-family: 'Atari', serif;
		font-size: 1rem;
		text-transform: uppercase;
	}

	@media print
	{
		body
		{
			--background: rgb(255, 255, 255) !important;
		}
	}
</style>
