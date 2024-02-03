<script setup>

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;

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

</script>

<template>
    <div class="flex flex-col w-full h-full grow items-start justify-start bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
        <!-- Hero --->
        <div
            class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white p-8">
                    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Émissions
                    </h1>
                </div>
            </div>
        </div>

        <!-- Emissions -->
        <SectionCards :items="emissionsData" cardAspectRatio="square" columns="5" />

    </div>
</template>