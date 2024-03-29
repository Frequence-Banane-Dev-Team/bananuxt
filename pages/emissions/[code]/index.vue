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

function summarizeText(text, maxLength = 250) {
  let summary = text.replace(/\\n/g, '\n');

    if (summary.length > maxLength) {
        summary = summary.substring(0, maxLength);
        summary = summary.substring(0, Math.min(summary.length, summary.lastIndexOf(' ')));
        summary += '...';
    }

  return summary;
}

const { data: combinedData } = useAsyncData(`combinedData-${code}`, async () => {
    try {

        const response = (await findOne('emissions', {
            filters: {
                code: code
            },
            populate: {
                cover: {
                    populate: {
                        image: true
                    }
                }
            }
        }))

        if (!response || !response.data || response.data.length === 0) {
            // redirect to /emissions
            return navigateTo('/emissions')
        }

        const image = extractImage({ item: response.data[0], baseUrl: STRAPI_URL })

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
            let page = 1
            let done = false
            while (!done) {
                const podcastsResponse = (await find('podcasts', {
                    pagination: {
                        page: page,
                        pageSize: 100
                    },
                    filters: {
                        emission: emission.id,
                    },
                    sort: 'date:desc',
                    populate: {
                        cover: {
                            populate: {
                                image: true
                            }
                        }
                    }
                }))

                if (podcastsResponse.meta.pagination.pageCount <= page) {
                
                    done = true
                } else {
                    page++
                }

                podcasts = podcasts.concat(podcastsResponse.data)

            }
        
            podcasts = await Promise.all(podcasts.map(async (podcast) => {

                let podcastData = {
                    id: podcast.id,
                    ...podcast.attributes,
                    url: `/emissions/${route.params.code}/${podcast.id}`
                }

                const podcastImage = extractImage({ item: podcast, baseUrl: STRAPI_URL })

                if (podcastImage) {
                    podcastData.image = podcastImage
                } else if (emission.image) {
                    podcastData.image = emission.image
                }

                if (podcastData && podcastData.description) {
                    
                    podcastData.description = await parseMarkdown(summarizeText(podcastData?.description))
                }

                podcastData.date = formatDate(podcastData.date, 'long')
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
            class="flex flex-col w-full items-center justify-center bg-gradient-to-b from-background to-slate-100 dark:to-secondary w-full">
            <div class="flex flex-col w-full items-center justify-center w-full h-full">
                <div class="flex flex-col-reverse gap-6 lg:flex-row items-center justify-between lg:gap-3 w-full h-full max-w-screen-xl text-primary py-12 px-10 lg:px-8">
                    <div class="flex flex-col w-full gap-2 lg:pr-6">
                        <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                            {{ emissionData?.title }}
                        </h1>
                        <div class="leading-7 text-muted-foreground text-normal lg:text-xl description overflow-x-auto text-justify">
                            <ContentRendererMarkdown :value="emissionData?.description" v-if="emissionData?.description" />
                        </div>
                        <div class="flex items-center gap-3 mt-1">
                            <button
                                v-if="podcastsData && podcastsData.length > 0"
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

        <!-- Podcasts -->
        <div
            class="flex flex-col w-full items-center justify-start bg-gradient-to-t from-background to-slate-100 dark:to-secondary">
            <div class="flex flex-col items-center justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b border-muted-foreground pb-3 text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                    Épisodes</h2>
                <div class="flex flex-col w-full gap-20 lg:gap-8 mt-6 px-2 sm:px-0">

                    <div class="flex group/title flex-col md:flex-row w-full gap-3 mx-auto" v-for="podcast in podcastsData">
                        <NuxtLink
                            :to="podcast.url"
                            class="flex w-full lg:w-1/5 max-w-64 mx-auto md:max-w-md rounded-xl aspect-square  overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-primary/50 transition duration-300">
                            <img :src="podcast?.image?.url" :alt="podcast?.title" class="object-cover w-full aspect-square" />
                        </NuxtLink>
                        <div class="flex flex-col items-start justify-center gap-2 md:ml-2 md:pl-4 self-stretch w-full lg:w-4/5">
                            <NuxtLink class="group/title transition-all duration-300 ease-in-out text-2xl font-semibold pt-2" :to="podcast?.url">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcast?.title }}
                                </span>
                            </NuxtLink>
                            <div class="text-muted-foreground description text-justify">
                                <ContentRendererMarkdown :value="podcast?.description" v-if="podcast?.description" />
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