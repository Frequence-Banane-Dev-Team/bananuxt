<script setup>
import { ref, watch, onMounted } from 'vue'
import MusicPlayerVolume from '../components/MusicPlayerVolume.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import Loading from 'vue-material-design-icons/Loading.vue';
import RadioboxMarked from 'vue-material-design-icons/RadioboxMarked.vue';
import RadioboxBlank from 'vue-material-design-icons/RadioboxBlank.vue';
import Rewind15 from 'vue-material-design-icons/Rewind15.vue';

import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

let isHover = ref(false)
let isTrackTimeCurrent = ref(null)
let isTrackTimeTotal = ref(null)
let seeker = ref(null)
let seekerContainer = ref(null)
let range = ref(0)
let isLoaded = ref(false)

onMounted(() => {

    if (audio.value) {
        setTimeout(() => {
            timeupdate()
            loadmetadata()
        }, 300)
    } else {
        useSong.preloadLive()
    }

    if (currentTrack.value) {
        seeker.value.addEventListener("change", function () {
            const time = audio.value.duration * (seeker.value.value / 100);
            audio.value.currentTime = time;
        });

        seeker.value.addEventListener("mousedown", function () {
            audio.value.pause();
            isPlaying.value = false
        });

        seeker.value.addEventListener("mouseup", function () {
            audio.value.play();
            isPlaying.value = true
        });

        seekerContainer.value.addEventListener("click", function (e) {
            const clickPosition = (e.pageX - seekerContainer.value.offsetLeft) / seekerContainer.value.offsetWidth;
            const time = audio.value.duration * clickPosition;
            audio.value.currentTime = time;
            seeker.value.value = (100 / audio.value.duration) * audio.value.currentTime;
        });
    }
})

const timeupdate = () => {
    audio.value.addEventListener("timeupdate", function () {
        var minutes = Math.floor(audio.value.currentTime / 60);
        var seconds = Math.floor(audio.value.currentTime - minutes * 60);
        isTrackTimeCurrent.value = minutes + ':' + seconds.toString().padStart(2, '0')
        const value = (100 / audio.value.duration) * audio.value.currentTime;
        range.value = value
        if (seeker.value) seeker.value.value = value;
    });
}

const loadmetadata = () => {
    isLoaded.value = false
    audio.value.addEventListener('loadedmetadata', function () {
        isLoaded.value = true
        const duration = audio.value.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        isTrackTimeTotal.value = minutes + ':' + seconds.toString().padStart(2, '0')

    });
}

watch(() => audio.value, () => {
    timeupdate()
    loadmetadata()
})

watch(() => isTrackTimeCurrent.value, (time) => {
    if (time && time == isTrackTimeTotal.value) {
        useSong.nextSong(currentTrack.value)
    }
})

</script>

<template>
    <div id="MusicPlayer" class="
            fixed
            flex
            items-center
            justify-between
            bottom-0
            w-full
            z-50
            h-[90px]
            bg-secondary
            dark:bg-primary-foreground
        ">
        <div class="flex items-center w-1/4">
            <div class="flex items-center ml-4">
                <img v-if="currentEmission" class="rounded-sm shadow-2xl aspect-square object-cover w-16" :src="currentEmission?.cover">
                <div class="ml-4">
                    <div v-if="currentTrack" class="text-[14px] text-primary">
                        <a class="hover:underline cursor-pointer" v-if="!currentTrack.isLive" :href="currentTrack?.link">
                            {{ currentTrack?.name }}
                        </a>
                        <span v-else>{{ currentTrack?.name }}</span>
                    </div>
                    <div v-if="currentEmission" class="text-[11px] text-muted-foreground">
                        <a class="hover:underline hover:text-primary cursor-pointer" v-if="!currentTrack.isLive"
                            :href="currentEmission?.link">
                            {{ currentEmission?.name }}
                        </a>
                        <span v-else>{{ currentEmission?.name }}</span>

                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-[35%] mx-auto w-2/4 mb-3">
            <div class="flex-col items-center justify-center">
                <div class="buttons flex items-center justify-center h-[30px]">
                    <span class="mx-2">
                        <Rewind15 v-if="!currentTrack?.isLive" class="text-primary hover:cursor-pointer" :size="25" @click="useSong.rewindCurrentSong(15)"/>
                        <Rewind15 v-else class="text-muted-foreground" :size="25"/>
                    </span>
                    <button v-if="isLoaded" class="p-1 rounded-full mx-3 bg-primary text-primary-foreground  hover:bg-banane hover:text-primary hover:dark:text-primary-foreground"
                        @click="useSong.playOrPauseThisSong(currentEmission, currentTrack)">
                        <Play v-if="!isPlaying" :size="25" />
                        <Pause v-else  :size="25" />
                    </button>
                    <div v-else class="p-1 rounded-full mx-3 bg-muted-foreground">
                        <Loading class="text-primary-foreground [&>*]:animate-spin" :size="25" />
                    </div>
                    <span class="mx-2">
                        <RadioboxMarked v-if="currentTrack?.isLive && isPlaying && isLoaded" class="text-red-500" :size="25" />
                        <RadioboxMarked v-else-if="currentTrack?.isLive" class="text-muted-foreground" :size="25" />
                        <RadioboxBlank v-else class="text-primary hover:cursor-pointer" :size="25" @click="useSong.loadLive()" title="Revenir au direct"/>
                    </span>
        
                </div>


                <div v-if="!currentTrack?.isLive" class="flex items-center h-[25px]" :class="{'hidden': !currentTrack}">
                    <div v-if="isTrackTimeCurrent" class="text-primary text-[12px] pr-2 pt-[11px]">{{ isTrackTimeCurrent }}
                    </div>
                    <div ref="seekerContainer" class="w-full relative mt-2 mb-3" @mouseenter="isHover = true"
                        @mouseleave="isHover = false">
                        <input v-model="range" ref="seeker" type="range" class="
                                absolute
                                rounded-full
                                my-2
                                w-full
                                h-0
                                z-40
                                appearance-none
                                bg-opacity-100
                                focus:outline-none
                                accent-primary
                            " :class="{ 'rangeDotHidden': !isHover }">
                        <div class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
                            :style="`width: ${range}%;`" :class="isHover ? 'bg-banane' : 'bg-primary'" />
                        <div class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full" />

                    </div>
                    <div v-if="isTrackTimeTotal" class="text-primary text-[12px] pl-2 pt-[11px]">{{ isTrackTimeTotal }}</div>
                </div>
            </div>
        </div>

        <div class="flex items-center w-1/4 justify-end pr-10">
            <MusicPlayerVolume />
        </div>
    </div>
</template>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
}
</style>