<script setup>
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { Newspaper } from 'lucide-vue-next'
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)
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
        <div class="flex flex-col w-full items-center justify-start bg-gradient-to-t from-background to-slate-100 dark:to-slate-900">
            <div class="flex flex-col items-start justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    À
                    la une</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

                    <div class="flex flex-col w-full">
                        <img src="/images/japon.jpg" alt="30 ans de Fréquence Banane"
                            class="w-full h-full object-cover rounded-xl aspect-video shadow">
                        <div class="flex flex-col items-start justify-start gap-2 mt-2">
                            <h3 class="text-xl font-semibold">Micropolis des Improvistes - Le Japon</h3>
                            <div class="flex gap-3 items-center">
                                <button
                                    class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                    @click="useSong.playOrPauseThisSong({
                                        name: 'Micropolis',
                                        cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp'
                                    }, {
                                        name: 'Micropolis des Improvistes - Le Japon',
                                        path: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
                                    })">

                                    <Pause v-if="currentTrack?.name == 'Micropolis des Improvistes - Le Japon' && isPlaying"
                                        :size="25" />
                                    <Play v-else :size="25" />
                                </button>
                                <div class="flex flex-col font-thin">
                                    <span class="text-sm font-light">Micropolis</span>
                                    <span class="text-sm font-light">44min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col w-full">
                        <img src="/images/article.webp" class="w-full h-full object-cover rounded-xl aspect-video shadow">
                        <div class="flex flex-col items-start justify-start gap-2 mt-2">
                            <h3 class="text-xl font-semibold">Transition énergétique : des États contraints de dédommager
                                des producteurs d'énergies fossiles</h3>
                            <div class="flex gap-2 items-center">
                                <span class="text-primary">
                                    <Newspaper :size="20" />
                                </span>
                                <div class="flex flex-col font-thin">
                                    <span class="text-sm font-light">Politique & Société</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col w-full">
                        <img src="/images/montagne.jpg" class="w-full h-full object-cover rounded-xl aspect-video shadow">
                        <div class="flex flex-col items-start justify-start gap-2 mt-2">
                            <h3 class="text-xl font-semibold">Micropolis des Improvistes - Le Japon</h3>
                            <div class="flex gap-3 items-center">
                                <button
                                    class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                    @click="useSong.playOrPauseThisSong({
                                        name: 'Micropolis',
                                        cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp'
                                    }, {
                                        name: 'Micropolis des Bananabreads du 28.11.2023',
                                        path: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
                                    })">

                                    <Pause
                                        v-if="currentTrack?.name == 'Micropolis des Bananabreads du 28.11.2023' && isPlaying"
                                        :size="25" />
                                    <Play v-else :size="25" />

                                </button>
                                <div class="flex flex-col font-thin">
                                    <span class="text-sm font-light">Micropolis</span>
                                    <span class="text-sm font-light">39min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>