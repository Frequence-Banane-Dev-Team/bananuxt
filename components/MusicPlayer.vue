<script setup>
import { ref, watch, onMounted } from 'vue'
import MusicPlayerVolume from '../components/MusicPlayerVolume.vue'
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import Loading from 'vue-material-design-icons/Loading.vue';
import RadioboxMarked from 'vue-material-design-icons/RadioboxMarked.vue';
import RadioboxBlank from 'vue-material-design-icons/RadioboxBlank.vue';
import Rewind15 from 'vue-material-design-icons/Rewind15.vue';
import { DrawerRoot, DrawerTrigger, DrawerOverlay, DrawerContent, DrawerPortal } from 'vaul-vue'
import { useRoute } from 'vue-router';
import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission, isLoaded } = storeToRefs(useSong)

let isHover = ref(false)
let isTrackTimeCurrent = ref(null)
let isTrackTimeTotal = ref(null)
let seeker = ref(null)
let seekerMobile = ref(null)
let seekerContainer = ref(null)
let seekerContainerMobile = ref(null)
let range = ref(0)
let windowWidth = ref(window?.innerWidth)

const emissionLink = ref(null)
const trackLink = ref(null)
watch(currentTrack, () => {
    if (currentTrack.value) {
        trackLink.value = currentTrack.value.url
    }
})
watch(currentEmission, () => {
    if (currentEmission.value) {
        emissionLink.value = currentEmission.value.url
    }
})

const open = ref(false)

const route = useRoute();
watch(route, () => {
    open.value = false
    if (currentEmission.value) {
        emissionLink.value = currentEmission.value.url
    }
    if (currentTrack.value) {
        trackLink.value = currentTrack.value.url
    }
})

const toggleDrawer = () => {
    if (windowWidth.value < 768) {
        open.value = !open.value
    }
}

const updateSeeker = () => {
    const time = audio.value.duration * (seeker.value.value / 100);
    audio.value.currentTime = time;
}

const updateSeekerContainer = (e) => {
    const clickPosition = (e.pageX - seekerContainer.value.offsetLeft) / seekerContainer.value.offsetWidth;
    const time = audio.value.duration * clickPosition;
    audio.value.currentTime = time;
    seeker.value.value = (100 / audio.value.duration) * audio.value.currentTime;
}


onMounted(() => {

    if (audio.value) {
        setTimeout(() => {
            timeupdate()
            loadmetadata()
        }, 300)
    } else {
        useSong.preloadLive()
    }

    window.addEventListener('resize', () => {
        windowWidth.value = window?.innerWidth
    })

    if (currentTrack.value) {

        seeker.value.addEventListener("change", function () {
            updateSeeker()
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
            if (windowWidth.value < 768) return
            updateSeekerContainer(e)
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
    if (time && !currentTrack.isLive && time == isTrackTimeTotal.value) {
        isPlaying.value = false
    }
})

</script>

<template>
    <div id="MusicPlayer" class="
            fixed
            flex
            flex-row
            items-center
            justify-between
            bottom-0
            w-full
            z-50
            h-[90px]
            bg-secondary
            dark:bg-primary-foreground
        ">
        <DrawerRoot v-model:open="open">
            <DrawerPortal>
                <DrawerOverlay class="fixed bg-black/40 inset-0" />
                <DrawerContent
                    class="bg-background z-[100] flex flex-col rounded-t-[10px] mt-24 max-h-[100%] fixed bottom-0 left-0 right-0">
                    <div class="p-4 bg-gradient-to-b to-background from-primary-foreground rounded-t-[10px] flex-1 pb-16">
                        <div class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8"></div>
                        <div class="flex  flex-col  max-w-80 mx-auto">
                            <img v-if="currentEmission" class="rounded-sm shadow-2xl aspect-square object-cover w-full"
                                :src="currentEmission?.image?.url">
                            <div class="flex flex-col gap-5 py-5">
                                <div class="flex flex-col w-full">
                                    <div v-if="currentTrack" class="text-[14px] text-primary">
                                        <NuxtLink class="text-xl font-semibold hover:underline cursor-pointer"
                                            v-if="!currentTrack.isLive" :to="trackLink">
                                            {{ currentTrack?.title }}
                                        </NuxtLink>
                                        <span class="text-xl font-semibold " v-else>{{ currentTrack?.title }}</span>
                                    </div>
                                    <div v-if="currentEmission" class="text-[11px] text-muted-foreground">
                                        <NuxtLink class="text-[15px] hover:underline hover:text-primary cursor-pointer"
                                            v-if="!currentTrack.isLive" :to="emissionLink">
                                            {{ currentEmission?.title }}
                                        </NuxtLink>
                                        <span class="text-[15px]" v-else>{{ currentEmission?.title }}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col items-center h-[25px]" :class="{ 'hidden': !currentTrack }">

                                    <div class="flex items-center h-[25px] w-full" :class="{
                                        'hidden': currentTrack?.isLive
                                    }">
                                        <div ref="seekerContainerMobile" @click="updateSeekerContainer($event)"
                                            class="w-full relative mt-2 mb-3" @mouseenter="isHover = true"
                                            @mouseleave="isHover = false">
                                            <input v-model="range" @change="updateSeeker" ref="seekerMobile" type="range"
                                                class="
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
                                                :style="`width: ${range}%;`"
                                                :class="isHover ? 'bg-banane' : 'bg-primary'" />
                                            <div
                                                class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full" />
                                        </div>

                                    </div>
                                    <div class="flex w-full justify-between">
                                        <div v-if="isTrackTimeCurrent && !currentTrack?.isLive"
                                            class="text-primary text-[12px] pr-2 pt-[11px]">{{
                                                isTrackTimeCurrent }}
                                        </div>
                                        <div v-if="isTrackTimeTotal && !currentTrack?.isLive"
                                            class="text-primary text-[12px] pl-2 pt-[11px]">{{
                                                isTrackTimeTotal }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex w-full justify-center gap-6 items-center pt-3">
                                    <span class="mx-2">
                                        <Rewind15 v-if="!currentTrack?.isLive" class="text-primary hover:cursor-pointer"
                                            :size="35" @click="useSong.rewindCurrentSong(15)" />
                                        <Rewind15 v-else class="text-muted-foreground" :size="35" />
                                    </span>
                                    <button v-if="isLoaded"
                                        class="p-1 rounded-full mx-3 bg-primary text-primary-foreground  hover:bg-banane hover:text-primary hover:dark:text-primary-foreground"
                                        @click="useSong.playOrPauseThisSong(currentEmission, currentTrack)">
                                        <Play v-if="!isPlaying" :size="35" />
                                        <Pause v-else :size="35" />
                                    </button>
                                    <div v-else class="p-1 rounded-full mx-3 bg-muted-foreground">
                                        <Loading class="text-primary-foreground [&>*]:animate-spin" :size="35" />
                                    </div>
                                    <span class="mx-2">
                                        <RadioboxMarked v-if="currentTrack?.isLive && isPlaying && isLoaded"
                                            class="text-red-500" :size="35" />
                                        <RadioboxMarked v-else-if="currentTrack?.isLive" class="text-muted-foreground"
                                            :size="35" />
                                        <RadioboxBlank v-else class="text-primary hover:cursor-pointer" :size="35"
                                            @click="useSong.loadLive()" title="Revenir au direct" />
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </DrawerPortal>
            <div class="
                flex
                flex-col
                md:flex-row
                items-start
                md:items-center
                justify-center
                md:
                w-full
                h-full
                hover:cursor-pointer
                md:hover:cursor-auto" @click.self="windowWidth < 768 ? toggleDrawer() : null">
                <div class="flex items-center justify-between w-full md:w-1/4">
                    <div class="flex items-center justify-start w-3/4 md:w-full pl-4" @click="toggleDrawer()">
                        <NuxtLink :to="trackLink">
                            <img v-if="currentTrack?.image" class="rounded-sm shadow-2xl aspect-square object-cover w-14 md:w-16"
                                :src="currentTrack?.image?.url" />
                            <img v-else-if="currentEmission?.image" class="rounded-sm shadow-2xl aspect-square object-cover w-14 md:w-16"
                                :src="currentEmission?.image?.url" />
                        </NuxtLink>

                        <div class="pl-4 flex flex-col items-start text-start">
                            <div v-if="currentTrack" class="flex flex-wrap text-[14px] text-primary">
                                <NuxtLink class="hidden md:block hover:underline cursor-pointer" v-if="!currentTrack.isLive"
                                    :to="trackLink">
                                    {{ currentTrack?.title }}
                                </NuxtLink>
                                <span v-else>{{ currentTrack?.title }}</span>
                                <span class="md:hidden" v-if="!currentTrack.isLive">
                                    {{ currentTrack?.title }}
                                </span>
                            </div>
                            <div v-if="currentEmission" class="flex flex-wrap text-[11px] text-muted-foreground">
                                <NuxtLink class="hidden md:block hover:underline hover:text-primary cursor-pointer"
                                    v-if="!currentTrack.isLive" :to="emissionLink">
                                    {{ currentEmission?.title }}
                                </NuxtLink>
                                <span v-else>{{ currentEmission?.title }}</span>
                                <span class="md:hidden" v-if="!currentTrack.isLive">
                                    {{ currentEmission?.title }}
                                </span>
                            </div>

                        </div>
                    </div>
                    <div class="buttons flex md:hidden items-center justify-end pr-4 gap-3 h-[25px] md:h-[30px] w-1/4">
                        <span>
                            <RadioboxMarked v-if="currentTrack?.isLive && isPlaying && isLoaded" class="text-red-500"
                                :size="25" />
                            <RadioboxMarked v-else-if="currentTrack?.isLive" class="text-muted-foreground" :size="25" />
                            <RadioboxBlank v-else class="text-primary hover:cursor-pointer" :size="25"
                                @click="useSong.loadLive()" title="Revenir au direct" />
                        </span>
                        <button v-if="isLoaded"
                            class="p-1 rounded-full bg-primary text-primary-foreground  hover:bg-banane hover:text-primary hover:dark:text-primary-foreground"
                            @click="useSong.playOrPauseThisSong(currentEmission, currentTrack)">
                            <Play v-if="!isPlaying" :size="25" />
                            <Pause v-else :size="25" />
                        </button>
                        <div v-else class="p-1 rounded-full bg-muted-foreground">
                            <Loading class="text-primary-foreground [&>*]:animate-spin" :size="25" />
                        </div>
                    </div>
                </div>

                <div class="flex w-full md:max-w-[35%] mx-auto md:mb-3" @click.self="toggleDrawer()">
                    <div class="flex-col w-full px-4 items-center justify-center" @click.self="toggleDrawer()">
                        <div class="buttons hidden md:flex items-center justify-center h-[30px]"
                            @click.self="toggleDrawer()" :class="{
                                'md:pt-2': !currentTrack?.isLive
                            }">
                            <span v-if="!currentTrack?.isLive" class="mx-2">
                                <Rewind15 v-if="!currentTrack?.isLive" class="text-primary hover:cursor-pointer" :size="25"
                                    @click="useSong.rewindCurrentSong(15)" />
                                <Rewind15 v-else class="text-muted-foreground" :size="25" />
                            </span>
                            <button v-if="isLoaded"
                                class="p-1 rounded-full mx-3 bg-primary text-primary-foreground  hover:bg-banane hover:text-primary hover:dark:text-primary-foreground"
                                @click="useSong.playOrPauseThisSong(currentEmission, currentTrack)">
                                <Play v-if="!isPlaying" :size="25" />
                                <Pause v-else :size="25" />
                            </button>
                            <div v-else class="p-1 rounded-full mx-3 bg-muted-foreground">
                                <Loading class="text-primary-foreground [&>*]:animate-spin" :size="25" />
                            </div>
                            <span class="mx-2" @click.self="toggleDrawer()">
                                <RadioboxMarked v-if="currentTrack?.isLive && isPlaying && isLoaded" class="text-red-500"
                                    :size="25" />
                                <RadioboxMarked v-else-if="currentTrack?.isLive" class="text-muted-foreground" :size="25" />
                                <RadioboxBlank v-else class="text-primary hover:cursor-pointer" :size="25"
                                    @click="useSong.loadLive()" title="Revenir au direct" />
                            </span>
                        </div>


                        <div class="flex items-center md:h-[25px]" @click.self="toggleDrawer()" :class="{
                            'hidden': currentTrack?.isLive

                        }" v-show="isLoaded">


                            <div v-if="isTrackTimeCurrent && !currentTrack.isLive"
                                class="hidden md:block text-primary text-[12px] pr-2 md:pt-[11px]">{{
                                    isTrackTimeCurrent }}</div>
                            <div ref="seekerContainer" class="w-full relative md:mt-2 mb-3" @mouseenter="isHover = true"
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
                                mobileSeeker
                            " :class="{ 'rangeDotHidden': !isHover }">
                                <div class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
                                    :style="`width: ${range}%;`" :class="isHover ? 'bg-banane' : 'bg-primary'" />
                                <div
                                    class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full" />

                            </div>
                            <div v-if="isTrackTimeTotal && !currentTrack.isLive"
                                class="hidden md:block text-primary text-[12px] pl-2 pt-[11px]">{{ isTrackTimeTotal
                                }}</div>
                        </div>
                    </div>
                </div>

                <div class="hidden md:flex items-center w-1/4 justify-end pr-10">
                    <MusicPlayerVolume />
                </div>
            </div>
        </DrawerRoot>
    </div>
</template>

<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
}

@media screen and (max-width: 768px) {

    .mobileSeeker[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 0;
        height: 0;
    }
}
</style>