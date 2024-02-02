<script setup>
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

const route = useRoute();
const code = route.params.code; // Accessing the `code` param

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;

const emissionData = {
    name: 'Micropolis',
    description: "People stopped telling jokes",
    cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
    link: '/emissions/micropolis'
}
const podcastsData = [
    {
        title: 'Micropolis des Improvistes - Le Japon',
        cover: BASE_URL + '/images/japon.jpg',
        duration: '44min',
        description: "Eeeet c'est parti pour un petit voyage au Japon! Eva, Elvire, Jazzya, Sarah et Cassandre nous proposent plusieurs chroniques pour découvrir des petits coins de...",
        url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
        date: '26 déc',
        link: '/emissions/micropolis/1'
    }, {
        title: 'Micropolis des Bananabreads du 28.11.2023',
        cover: BASE_URL + '/images/montagne.jpg',
        duration: '39min',
        description: "Pour ce micropolis, les Bananabreads discutent des vacances, plus précisemment d'anecdotes, de volontariats et de faits divers!",
        url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
        date: '28 nov',
        link: '/emissions/micropolis/2'
    }
]

</script>

<template>
    <div class="flex flex-col w-full items-start justify-center">
        <!-- Hero --->
        <div
            class="flex flex-col items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-secondary w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="flex flex-row items-center justify-between gap-3 w-full h-full max-w-screen-xl text-primary p-8">
                    <div class="flex flex-col gap-2">
                        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {{ emissionData.name }}
                        </h1>
                        <p class="leading-7 text-muted-foreground text-xl">
                            {{ emissionData.description }}
                        </p>
                        <div class="flex items-center gap-3">
                            <button
                                class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                @click="useSong.playOrPauseThisSong(emissionData, {
                                    name: podcastsData[0].title,
                                    path: podcastsData[0].url,
                                    link: podcastsData[0].link
                                })">
                                <Play :size="25" />

                            </button>
                            <span class="dark:text-slate-200 font-light italic">
                            {{  podcastsData.length }} épisodes
                        </span>
                        </div>
                    </div>
                    <div class="flex flex-col w-1/2 max-w-64">
                        <img :src="emissionData.cover" :alt="emissionData.name"
                            class="object-cover w-full aspect-square rounded-xl" />
                    </div>
                </div>
            </div>
        </div>

        <!-- A la une -->
        <div
            class="flex flex-col w-full items-center justify-start bg-gradient-to-t from-background to-slate-100 dark:to-secondary">
            <div class="flex flex-col items-center justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b border-muted-foreground pb-3 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                    Épisodes</h2>
                <div class="flex flex-col w-full gap-8 mt-6">

                    <div class="flex group/title flex-col md:flex-row w-full gap-3 mx-auto" v-for="podcast in podcastsData">
                        <NuxtLink
                            :to="podcast.link"
                            class="flex w-full md:w-1/3 md:max-w-md object-cover rounded-xl aspect-video  overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-primary/50 transition duration-300">
                            <img :src="podcast.cover" :alt="podcast.title" class="object-cover w-full aspect-video" />
                        </NuxtLink>
                        <div class="flex flex-col items-start justify-center gap-2 md:ml-2 md:pl-4 self-stretch w-full md:w-2/3">
                            <NuxtLink class="group/title transition-all duration-300 ease-in-out text-2xl font-semibold pt-2" :to="podcast.link">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcast.title }}
                                </span>
                            </NuxtLink>
                            <p class="text-muted-foreground">{{ podcast.description }}</p>
                            <div class="flex gap-2 items-center mt-1">
                                <button
                                    class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                    @click="useSong.playOrPauseThisSong(emissionData, {
                                        name: podcast.title,
                                        path: podcast.url,
                                        link: podcast.link
                                    })">

                                    <Pause v-if="currentTrack?.name == podcast.title && isPlaying" :size="25" />
                                    <Play v-else :size="25" />

                                </button>
                                <div class="flex font-thin gap-2 italic pl-1">
                                    <span class="text-sm font-light">{{ podcast.date }}</span>
                                    <span class="text-sm font-light">&#x2022;</span>
                                    <span class="text-sm font-light">{{ podcast.duration }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>