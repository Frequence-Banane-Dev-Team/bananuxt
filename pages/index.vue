<script setup>
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;

const categoryMap = {
    'politique_societe': {
        name: 'Politique & Société',
        icon: 'lucide:newspaper'
    },
}
const unesData = [
    {
        title: 'Micropolis des Improvistes - Le Japon',
        cover:  `${BASE_URL}/images/japon.jpg`,
        emission: {
            name: 'Micropolis',
            cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
            code: 'micropolis'
        },
        duration: '44min',
        url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
        path: `/emissions/micropolis/1`
    }, {
        title: 'Transition énergétique : des États contraints de dédommager des producteurs d\'énergies fossiles',
        cover: BASE_URL + '/images/article.webp',
        article: {
            category: 'politique_societe'
        }
    }, {
        title: 'Micropolis des Bananabreads du 28.11.2023',
        cover: `${BASE_URL}/images/montagne.jpg`,
        emission: {
            name: 'Micropolis',
            cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
            code: 'micropolis'
        },
        duration: '39min',
        url: "https://samplelib.com/lib/preview/mp3/sample-12s.mp3",
        //url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
        path: `/emissions/micropolis/2`
    }
]

</script>

<template>
    <div class="flex flex-col w-full items-start justify-center">
        <!-- Hero --->
        <div
            class="flex flex-col items-center justify-center bg-[url('/images/30ans_hero.jpg')] bg-cover bg-center w-full h-[40vh]">
            <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white p-8">
                    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">30 ans de Fréquence Banane
                    </h1>
                    <p class="leading-7">
                        Pour fêter ses 30 années d'existence, Fréquence Banane organise une semaine d'émissions en public et
                        de concerts, gratuits et ouverts à toutes et tous !
                    </p>
                    <Button
                        class="mt-1 bg-banane hover:bg-banane/90 font-semibold text-primary dark:text-primary-foreground">Voir
                        plus</Button>
                </div>
            </div>
        </div>

        <!-- A la une -->
        <div
            class="flex flex-col w-full items-center justify-start bg-gradient-to-t from-background to-slate-100 dark:to-secondary">
            <div class="flex flex-col items-start justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    À
                    la une</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

                    <div class="flex flex-col w-full" v-for="une in unesData">
                        <div v-if="une.path" class="group/title flex flex-col w-full mb-2" >
                            <NuxtLink :to="une.path">
                                <div
                                    class=" w-full object-cover rounded-xl aspect-video  overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300">
                                    <img :src="une.cover" :alt="une.title" class="object-cover w-full aspect-video" />
                                </div>
                            </NuxtLink>
                            <NuxtLink class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2" :to="une.path">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ une.title }}
                                </span>
                            </NuxtLink>
                        </div>
                        <div v-else class="group/title flex flex-col w-full mb-2" >
                            <div>
                                <div
                                    class=" w-full object-cover rounded-xl aspect-video  overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300">
                                    <img :src="une.cover" :alt="une.title" class="object-cover w-full aspect-video" />
                                </div>
                            </div>
                            <div class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ une.title }}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col items-start justify-start gap-2 ">

                            <div class="flex gap-2 items-center" v-if="une.emission">
                                <button
                                    class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                    @click="useSong.playOrPauseThisSong(une.emission, {
                                        name: une.title,
                                        path: une.url,
                                    })">

                                    <Pause v-if="currentTrack?.name == une.title && isPlaying" :size="25" />
                                    <Play v-else :size="25" />

                                </button>
                                <div class="flex flex-col font-thin">
                                    <NuxtLink class="group/emission transition-all duration-300 ease-in-out text-sm font-light"
                                        :to="`/emissions/${une.emission.code}`">
                                        <span
                                            class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                            {{ une.emission.name }}
                                        </span>
                                    </NuxtLink>
                                    <span class="text-sm font-light">{{ une.duration }}</span>
                                </div>
                            </div>
                            <div class="flex gap-2 items-center" v-else-if="une.article">
                                <span class="text-primary">
                                    <Icon :name="categoryMap[une.article.category].icon" size="24" />
                                </span>
                                <div class="flex flex-col font-thin">
                                    <span class="text-sm font-light">{{ categoryMap[une.article.category].name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>