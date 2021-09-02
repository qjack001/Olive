import {
    useSound
} from "@vueuse/sound";

import {
    ref
} from 'vue'

function useSoundWithRandomPitch(id, volume, variation) {
    const MIN_PITCH = (1 - (variation / 2)) + 0.1
    const playbackRate = ref(MIN_PITCH);
    const {
        play
    } = useSound(id, {
        volume,
        playbackRate,
        // interrupt: true,
    });

    function playSound() {
        playbackRate.value = MIN_PITCH + (variation * Math.random());
        play();
    }

    return {
        playSound
    }

}

export default useSoundWithRandomPitch;