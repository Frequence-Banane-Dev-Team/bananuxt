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
const id = route.params.id; // Accessing the `id` param

const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { findOne } = useStrapi()

const { data: podcastData } = useAsyncData('podcastData', async () => {
    try {

        const response = (await findOne('podcasts', {
            filters: {
                id: id
            },
            populate: {
                cover: true,
                emission: {
                    populate: {
                        cover: true
                    }
                }
            }
        }))

        const image = extractImage(response.data[0])

        if (image) {
            image.url = `${STRAPI_URL}${image.url}`
        }

        const podcast = {
            id: response.data[0].id,
            ...response.data[0].attributes,
            image
        }

        podcast.date = formatDate(podcast.date)
        podcast.duration = formatDuration(podcast.duration)
        if (podcast.emission) {
            const image = extractImage(podcast.emission.data)

            if (image) {
                image.url = `${STRAPI_URL}${image.url}`
            }

            podcast.emission = {
                ...podcast.emission.data.attributes,
                image
            }

            podcast.emission.url = `/emissions/${podcast.emission.code}`

            podcast.url = `/emissions/${podcast.emission.code}/${podcast.id}`
        }

       

        return podcast


    } catch (e) {
        console.error(e)
        return { podcast: {} }
    }
})

</script>

<template>
    <div class="flex flex-col w-full items-start justify-start h-full grow">
        <!-- Hero --->
        <div :class="`flex flex-col items-center justify-center bg-cover bg-center w-full h-full min-h-[30vh]`"
            :style='`background-image: url(${podcastData?.image?.url})`'>
            <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-80 min-h-[30vh]">
                <div
                    class="flex items-center lg:justify-between gap-5 w-full h-full max-w-screen-xl text-white p-8 flex-col lg:flex-row-reverse">
                    <div class="flex flex-col w-full lg:w-1/2 max-w-sm ">
                        <img :src="podcastData?.image?.url" :alt="podcastData?.title"
                            class="object-cover w-full aspect-square rounded-xl" />
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
                                    title: podcastData?.title,
                                    audio_url: podcastData?.audio_url,
                                    url: podcastData?.url,
                                    image: podcastData?.image
                                })">
                                <Pause v-if="currentTrack?.title == podcastData?.title && isPlaying" :size="25" />
                                <Play v-else :size="25" />

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
                            <img :src="podcastData?.emission?.image?.url" :alt="podcastData?.emission?.title"
                                class="object-cover w-48 aspect-square rounded-xl" />
                        </NuxtLink>
                        <div class="flex flex-col justify-start p-5">
                            <span>Provenant de l'émission</span>
                            <NuxtLink class=" transition-all duration-300 ease-in-out text-2xl font-semibold pt-2"
                                :to="`/emissions/${podcastData?.emission?.code}`">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcastData?.emission?.title }}
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