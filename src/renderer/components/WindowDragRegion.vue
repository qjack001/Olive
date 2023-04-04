<template>
	<section class="drag-region-container">
		<div id="drag-region"/>
		<slot/>
	</section>
</template>

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
</style>
