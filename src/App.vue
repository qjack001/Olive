<template>
	<writer/>
</template>

<script setup>
	import Writer from './components/Writer.vue'
</script>

<style>
	@font-face 
	{
		font-family: "typewriter";
		src: url("./AtlasTypewriter-er.ttf");
	}

	@media print
	{
		/* print styles */
	}
</style>
