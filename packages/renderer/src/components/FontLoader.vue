<template>
	<div id="font-preloader" role="presentation">
		<p class="classic-type">Load "Classic" typeface</p>
		<p class="old-type">Load "Very Old" typeface</p>
		<p class="italic-type">Load "Italic" typeface</p>
	</div>
</template>

<style scoped>
	.classic-type
	{
		font-family: "classic-typewriter";
	}

	.old-type
	{
		font-family: "old-typewriter";
	}

	.italic-type
	{
		font-family: "italic-typewriter";
	}

	#font-preloader
	{
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		user-select: none;
		z-index: -1;
		opacity: 0;
		color: transparent;
	}

	@media print
	{
		#font-preloader
		{
			opacity: 0 !important;
			display: none !important;
		}
	}
</style>
