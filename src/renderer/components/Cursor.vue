<template>
	<svg :class="{eraseMode}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 9" role="presentation">
		<path d="M14.01 9H0V0h2v5.5h.37l.88-2.23A2 2 0 015.11 2H9.9a2 2 0 011.86 1.27l.88 2.23H13V0h2v9z"/>
	</svg>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'

	const eraseMode = ref(false)

	onMounted(() => {
		window.menu?.receive('erase_mode', (modeValue: boolean) => {
			eraseMode.value = modeValue
		})
	})
</script>

<style scoped>
	svg
	{
		width: 15px;

		position: fixed;
		top: calc(50vh + 14px);
		left: calc(50vw - 2px);
		z-index: 99;
		pointer-events: none;
	}

	svg.eraseMode
	{
		fill: none;
		stroke-width: 1.5px;
		stroke: currentColor;
	}

	@media print
	{
		svg
		{
			opacity: 0;
			display: none;
		}
	}
</style>
