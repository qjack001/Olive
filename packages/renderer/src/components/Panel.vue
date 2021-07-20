<template>
	<div id="panel"></div>
</template>

<script setup>
	import Logo from './Logo.vue'
</script>

<style scoped>
	div
	{
		z-index: 999;
		pointer-events: none;

		background: var(--tint);
		backdrop-filter: blur(5px);

		position: fixed;
		top: calc(50vh + 23px);
		left: 0;
		right: 0;
		bottom: 0;
	}

	@media print
	{
		div
		{
			opacity: 0 !important;
			display: none !important;
		}
	}
</style>
