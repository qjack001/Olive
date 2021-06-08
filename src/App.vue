<template>
	<writer/>
</template>

<script setup>
	import Writer from './components/Writer.vue'
</script>

<style>
	@font-face 
	{
		font-family: "old-typewriter";
		src: url("./old-typewriter.ttf");
	}

	@font-face 
	{
		font-family: "modern-typewriter";
		src: url("./modern-typewriter-edit.ttf");
	}

	@font-face 
	{
		font-family: "italic-typewriter";
		src: url("./italic-typewriter.otf");
	}

	body
	{
		font-family: "modern-typewriter", "old-typewriter", "italic-typewriter", monospace;
		font-size: 14px;
	}

	body.modern
	{
		font-family: "modern-typewriter", monospace;
	}

	body.old
	{
		font-family: "old-typewriter", monospace;
	}

	body.italic
	{
		font-family: "italic-typewriter", monospace;
	}

	@media print
	{
		/* print styles */
	}
</style>
