<template>
	<section class="drag-region-container">
		<div id="drag-region"/>
		<button v-if="props.closePage != undefined" class="close" :onclick="closeModel">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M18 6 6 18M6 6l12 12"/>
			</svg>
		</button>
	</section>
</template>

<script setup lang="ts">
	const props = defineProps({
		closePage: String
	})

	function closeModel() {
		window.menu?.send('close_page', props.closePage)
	}
</script>

<style scoped>
	section.drag-region-container
	{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 40px;
		z-index: 9999;
		margin: 0;
		padding: 0;

		display: flex;
		flex-direction: row;
	}

	div#drag-region
	{
		-webkit-app-region: drag;
		cursor: default;
		flex-grow: 1;
		height: 100%;
	}

	button.close
	{
		position: relative;
		display: flex;
		height: 100%;
		aspect-ratio: 1 / 1;
		align-items: center;
		justify-content: center;

		border: none;
		outline: none;
		box-shadow: none;
		background: transparent;
		cursor: pointer;
	}

	button.close::after
	{
		content: "";
		position: absolute;
		top: 5px;
		left: 5px;
		right: 5px;
		bottom: 5px;
		background: black;
		border-radius: 8px;
		opacity: 0;
	}

	button.close:hover::after,
	button.close:focus::after
	{
		opacity: 0.1;
	}

	button.close svg
	{
		width: 24px;
		stroke: currentColor;
		stroke-width: 1.5;
	}
</style>
