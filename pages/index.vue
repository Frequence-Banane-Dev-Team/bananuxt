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
        cover: `${BASE_URL}/images/japon.jpg`,
        emission: {
            name: 'Micropolis',
            cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
            code: 'micropolis',
            link: '/emissions/micropolis'
        },
        duration: '44min',
        url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
        link: `/emissions/micropolis/1`
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
            code: 'micropolis',
            link: '/emissions/micropolis'
        },
        duration: '39min',
        url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
        link: `/emissions/micropolis/2`
    }
]

const emissionsData = [{
    title: 'Micropolis',
    cover: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/cover_medium.webp',
    link: '/emissions/micropolis'
}, {
    title: 'Café Kawa',
    cover: 'https://podcasts.frequencebanane.ch/media/podcasts/cafekawa/cover_medium.webp'
}, {
    title: 'Purple Talk',
    cover: 'https://podcasts.frequencebanane.ch/media/podcasts/purpletalk/cover_medium.webp'
}, {
    title: 'Place Publique',
    cover: 'https://podcasts.frequencebanane.ch/media/podcasts/PlacePublique/cover_medium.webp'
}, {
    title: 'Dans Ton Campus',
    cover: 'https://podcasts.frequencebanane.ch/media/podcasts/dans_ton_campus/cover_medium.webp'
}]

const podcastsData = [{
    title: 'Micropolis des Improvistes - Le Japon',
    cover: `${BASE_URL}/images/japon.jpg`,
    emission: {
        name: 'Micropolis',
        cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
        code: 'micropolis',
        link: '/emissions/micropolis'
    },
    duration: '44min',
    url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701341636_54831f493997763a5bb3.mp3',
    link: `/emissions/micropolis/1`
}, {
    title: 'Micropolis des Bananabreads du 28.11.2023',
    cover: `${BASE_URL}/images/montagne.jpg`,
    emission: {
        name: 'Micropolis',
        cover: 'https://strapi.frequencebanane.ch/uploads/cover_thumbnail_991dbdc677.webp',
        code: 'micropolis',
        link: '/emissions/micropolis'
    },
    duration: '39min',
    url: 'https://podcasts.frequencebanane.ch/media/podcasts/micropolis/1701470878_513c195255e4764e375d.mp3',
    link: `/emissions/micropolis/2`
}]

const articlesData = [{
    title: 'Transition énergétique : des États contraints de dédommager des producteurs d\'énergies fossiles',
    cover: BASE_URL + '/images/article.webp',
    article: {
        category: 'politique_societe'
    }
}]

</script>

<template>
    <div class="flex flex-col w-full items-start justify-center bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
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
        <SectionCards :header="{ title: 'À la une' }" :items="unesData" />

        <!-- Emissions -->
        <SectionCards :header="{ title: 'Émissions', link: '/emissions' }" :items="emissionsData" cardAspectRatio="square" columns="5" />

        <!-- Podcasts -->
        <SectionCards :header="{ title: 'Podcasts récents' }" :items="podcastsData" />

        <!-- Articles -->
        <SectionCards :header="{ title: 'Articles récents' }" :items="articlesData" />
    </div>
</template>