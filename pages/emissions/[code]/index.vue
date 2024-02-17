<script setup>
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { parseMarkdown } from '~/utils/parseMarkdown';

const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

const { findOne, find } = useStrapi()

const route = useRoute();
const code = route.params.code; // Accessing the `code` param

const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { data: combinedData } = useAsyncData(`combinedData-${code}`, async () => {
    try {

        const response = (await findOne('emissions', {
            filters: {
                code: code
            },
            populate: {
                cover: true
            }
        }))

        const image = extractImage(response.data[0])

        if (image) {
            image.url = `${STRAPI_URL}${image.url}`
        }

        const emission = {
            id: response.data[0].id,
            ...response.data[0].attributes,
            image
        }

        emission.url = `/emissions/${emission.code}`

        if (emission.description) {
            emission.description = await parseMarkdown(emission.description)
        }

        let podcasts = []

        if (emission && emission.id) {
            const podcastsResponse = (await find('podcasts', {
                filters: {
                    emission: emission.id,
                },
                sort: 'date:desc',
                populate: {
                    cover: true
                }
            }))

            podcasts = await Promise.all(podcastsResponse.data.map(async (podcast) => {
                

                let podcastData = {
                    id: podcast.id,
                    ...podcast.attributes,
                    url: `/emissions/${route.params.code}/${podcast.id}`
                }

                const podcastImage = extractImage(podcast)

                if (podcastImage) {
                    podcastImage.url = `${STRAPI_URL}${podcastImage.url}`
                    podcastData.image = podcastImage
                } else if (emission.image) {
                    podcastData.image = emission.image
                }

                if (podcastData.description) {
                    podcastData.description = await parseMarkdown(podcastData.description)
                }

                podcastData.date = formatDate(podcastData.date)
                podcastData.duration = formatDuration(podcastData.duration)

                return podcastData
            }))
        }

        return { emission, podcasts }


    } catch (e) {
        console.error(e)
        return { emission: {}, podcasts: [] }
    }
}, {
    watch: [code]
})

// Accessing the emission and podcasts data
const emissionData = computed(() => combinedData.value.emission);
const podcastsData = computed(() => combinedData.value.podcasts);

</script>

<template>
    <main class="flex flex-col w-full items-start justify-center" :key="route.fullPath">
        <!-- Hero --->
        <div
            class="flex flex-col items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-secondary w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="flex flex-col-reverse gap-6 lg:flex-row items-center justify-between lg:gap-3 w-full h-full max-w-screen-xl text-primary py-8 px-10 lg:px-8">
                    <div class="flex flex-col gap-2">
                        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {{ emissionData?.title }}
                        </h1>
                        <div class="leading-7 text-muted-foreground text-xl">
                            <ContentRendererMarkdown :value="emissionData?.description" />
                        </div>
                        <div class="flex items-center gap-3">
                            <button
                                v-if="podcastsData"
                                class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                @click="useSong.playOrPauseThisSong(emissionData, {
                                    title: podcastsData[0].title,
                                    audio_url: podcastsData[0].audio_url,
                                    url: podcastsData[0].url,
                                    image: podcastsData[0].image
                                })">
                                <Play :size="25" />

                            </button>
                            <span class="dark:text-slate-200 font-light italic">
                            {{  podcastsData?.length }} épisodes
                        </span>
                        </div>
                    </div>
                    <div class="flex flex-col w-full lg:w-1/2 max-w-64">
                        <img :src="emissionData?.image?.url" :alt="emissionData?.title"
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
                <div class="flex flex-col w-full gap-20 lg:gap-8 mt-6 px-10 sm:px-0">

                    <div class="flex group/title flex-col md:flex-row w-full gap-3 mx-auto" v-for="podcast in podcastsData">
                        <NuxtLink
                            :to="podcast.url"
                            class="flex w-full lg:w-1/5 md:max-w-md object-cover rounded-xl aspect-square  overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-primary/50 transition duration-300">
                            <img :src="podcast?.image?.url" :alt="podcast?.title" class="object-cover w-full aspect-square" />
                        </NuxtLink>
                        <div class="flex flex-col items-start justify-center gap-2 md:ml-2 md:pl-4 self-stretch w-full lg:w-4/5">
                            <NuxtLink class="group/title transition-all duration-300 ease-in-out text-2xl font-semibold pt-2" :to="podcast?.url">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcast?.title }}
                                </span>
                            </NuxtLink>
                            <div class="text-muted-foreground">
                                <ContentRendererMarkdown :value="podcast?.description" />
                            </div>
                            <div class="flex gap-2 items-center mt-1">
                                <button
                                    class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                    @click="useSong.playOrPauseThisSong(emissionData, {
                                        title: podcast.title,
                                        audio_url: podcast.audio_url,
                                        url: podcast.url,
                                        image: podcast.image
                                    })">

                                    <Pause v-if="currentTrack?.title == podcast.title && isPlaying" :size="25" />
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
    </main>
</template>