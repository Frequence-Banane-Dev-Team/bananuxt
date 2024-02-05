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
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: combinedData } = useAsyncData('combinedData', async () => {
    try {

        const response = (await find('emissions', {
            sort: 'title:asc',
            populate: {
                cover: true
            }
        }))

        const image = extractImage(response.data[0])

        const emissions = await Promise.all(response.data.map(async (emission) => {
            const image = extractImage(emission)

            if (image) {
                image.url = `${STRAPI_URL}${image.url}`
            }

            let emissionData = {
                id: emission.id,
                ...emission.attributes,
                image
            }

            emissionData.url = `/emissions/${emissionData.code}`

            return emissionData
        }))

        const podcastsResponse = (await find('podcasts', {
            sort: 'date:desc',
            populate: {
                cover: true,
                emission: {
                    populate: {
                        cover: true
                    }
                }
            }
        }))

        const LIMIT = 4
        let podcasts = await Promise.all(podcastsResponse.data.slice(
            0, LIMIT
        ).map(async (podcast) => {

            const image = extractImage(podcast) || extractImage(podcast.attributes.emission?.data)

            if (image) {
                image.url = `${STRAPI_URL}${image.url}`
            }

            let podcastData = {
                id: podcast.id,
                ...podcast.attributes,
                url: `/emissions/${podcast.attributes.emission?.data.attributes.code}/${podcast.id}`,
                image
            }


            const emissionImage = extractImage(podcast.attributes.emission?.data)

            podcastData.emission = podcast.attributes.emission?.data.attributes

            if (emissionImage) {
                emissionImage.url = `${STRAPI_URL}${emissionImage.url}`
            }

            podcastData.emission.image = emissionImage
            podcastData.emission.url = `/emissions/${podcastData.emission.code}`

            podcastData.duration = formatDuration(podcastData.duration)

            return podcastData
        }))

        const articlesResponse = (await find('articles', {
            sort: 'date:desc',
            populate: {
                cover: true,
                category: true
            }
        }))

        const articles = await Promise.all(articlesResponse.data.slice(
            0, LIMIT
        ).map(async (article) => {
            const image = extractImage(article)

            if (image) {
                image.url = `${STRAPI_URL}${image.url}`
                image.format = 'video'
            }

            let articleData = {
                id: article.id,
                ...article.attributes,
                //url: `/articles/${article.id}`,
                image
            }

            articleData.category = article.attributes.category?.data.attributes

            return articleData
        }))
        
        // sort the articles and podcasts by date and take the first 3
        let unes = [...articles, ...podcasts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

        podcasts = podcasts.map(podcast => {
            podcast.date = formatDate(podcast.date)
            return podcast
        })

        return { emissions, unes, podcasts, articles }


    } catch (e) {
        console.error(e)
        return { emissions: [], unes: [], podcasts: [], articles: []}
    }
})

// Accessing the emission and podcasts data
const unesData = computed(() => combinedData.value.unes);
const podcastsData = computed(() => combinedData.value.podcasts);
const emissionsData = computed(() => combinedData.value.emissions);
const articlesData = computed(() => combinedData.value.articles);

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
        <SectionCards :header="{ title: 'À la une' }" :items="unesData" cardAspectRatio="square" :columns="3" layout="mixed" />

        <!-- Emissions -->
        <SectionCards :header="{ title: 'Émissions', url: '/emissions' }" :items="emissionsData" cardAspectRatio="square" :columns="5" />

        <!-- Podcasts -->
        <SectionCards :header="{ title: 'Podcasts récents' }" :items="podcastsData" cardAspectRatio="square" :columns="4" />

        <!-- Articles -->
        <SectionCards :header="{ title: 'Articles récents' }" :items="articlesData" />
    </div>
</template>