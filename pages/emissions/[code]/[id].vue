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
const id = route.params.id; // Accessing the `id` param

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;

let podcastData;
switch (+id) {
    case 1:
        podcastData = {
            title: 'Micropolis des Improvistes - Le Japon',
            cover: BASE_URL + '/images/japon.jpg',
            duration: '44min',
            description: "Eeeet c'est parti pour un petit voyage au Japon! Eva, Elvire, Jazzya, Sarah et Cassandre nous proposent plusieurs chroniques pour découvrir des petits coins de...",
            url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
            date: '26 déc',
            path: '/emissions/micropolis/1',
            emission: {
                name: 'Micropolis',
                code: 'micropolis',
                description: "People stopped telling jokes",
                cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp'
            }
        }
        break;
    case 2:
        podcastData = {
            title: 'Micropolis des Bananabreads du 28.11.2023',
            cover: BASE_URL + '/images/montagne.jpg',
            duration: '39min',
            description: "Pour ce micropolis, les Bananabreads discutent des vacances, plus précisemment d'anecdotes, de volontariats et de faits divers!",
            url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
            date: '28 nov',
            path: '/emissions/micropolis/2',
            emission: {
                name: 'Micropolis',
                code: 'micropolis',
                description: "People stopped telling jokes",
                cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp'
            }
        }
        break;
    default:
        window.location.href = '/'
        break;
}

</script>

<template>
    <div class="flex flex-col w-full items-start justify-start h-full grow">
        <!-- Hero --->
        <div :class="`flex flex-col items-center justify-center bg-cover bg-center w-full h-full min-h-[30vh]`"
            :style='`background-image: url(${podcastData?.cover})`'>
            <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-80 min-h-[30vh]">
                <div
                    class="flex items-center justify-between gap-5 w-full h-full max-w-screen-xl text-white p-8 flex-col lg:flex-row-reverse">
                    <div class="flex flex-col w-full lg:w-1/2 max-w-lg ">
                        <img :src="podcastData?.cover" :alt="podcastData?.title"
                            class="object-cover w-full aspect-video rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-2 w-full lg:w-1/2">
                        <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                            {{ podcastData?.title }}
                        </h1>
                        <p class="leading-7 text-slate-400 lg:text-xl">
                            {{ podcastData?.description }}
                        </p>
                        <div class="flex items-center gap-3 mt-1">
                            <button
                                class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                @click="useSong.playOrPauseThisSong(podcastData?.emission, {
                                    name: podcastData?.title,
                                    path: podcastData?.url,
                                })">
                                <Play :size="25" />

                            </button>
                            <div class="flex font-thin gap-2 italic pl-1">
                                <span class="text-sm font-light">{{ podcastData?.date }}</span>
                                <span class="text-sm font-light">&#x2022;</span>
                                <span class="text-sm font-light">{{ podcastData?.duration }}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


        <div
            class="flex flex-col w-full items-center justify-start bg-gradient-to-b from-background to-background via-slate-100 dark:via-secondary h-full grow">

            <div class="flex flex-row max-w-screen-md w-full justify-start p-4">

                <div class="flex flex-row max-w-screen-md w-full justify-start bg-secondary shadow rounded-xl">
                    <div class="flex group/emission">
                        <NuxtLink class="p-5" :to="`/emissions/${podcastData?.emission?.code}`">
                            <img :src="podcastData?.emission?.cover" :alt="podcastData?.emission?.name"
                                class="object-cover w-full aspect-square rounded-xl" />
                        </NuxtLink>
                        <div class="flex flex-col justify-start p-5">
                            <span>Provenant de l'émission</span>
                            <NuxtLink class=" transition-all duration-300 ease-in-out text-2xl font-semibold pt-2"
                                :to="`/emissions/${podcastData?.emission?.code}`">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcastData?.emission?.name }}
                                </span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
            <!-- A la une -->
            <div class="flex flex-col items-center justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b border-muted-foreground pb-3 text-3xl lg:text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                    Épisodes similaires</h2>
                <div class="flex flex-col w-full gap-5 mt-6">
                </div>
            </div>
        </div>
    </div>
</template>