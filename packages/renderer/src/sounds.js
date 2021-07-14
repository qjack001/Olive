
function bound(value, floor, ceiling)
{
	return Math.min(Math.max(value, floor), ceiling)
}

export default
{
	/**
	 * Creates a new sound effect, and returns a function that plays it. Note that it fails silently,
	 * as sound is not a critical function (if it is, don't use this).
	 * 
	 * @param {String} filePath source of audio file (relative to index.html)
	 * @param {float} varience [0–2], range of varience in speed & pitch (0 = no change/original, 1 = 0.5x to 1.5x speed, 2 = 0.1x to 2x)
	 * @param {float} volume (1 = full volume, 0 = muted)
	 */
	createNew(filePath, varience = 0, volume = 1)
	{
		try
		{
			varience = bound(varience, 0, 2)
			volume   = bound(volume,   0, 1)

			const SOUND = new Audio(filePath);
			const MIN_PITCH = (1 - (varience / 2)) + 0.1
			SOUND.volume = volume

			return function call() 
			{
				try
				{
					SOUND.playbackRate = MIN_PITCH + (varience * Math.random());
					SOUND.currentTime = 0;
					SOUND.play();

				} catch (e) { /* pass */ }
			}
		}
		catch (e)
		{
			console.error('Unable to create sound effect in sound.js, error: ' + e)
			return function empty() {}
		}
	}
}