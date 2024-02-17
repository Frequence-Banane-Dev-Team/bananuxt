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

const route = useRoute();
const id = route.params.id; // Accessing the `id` param

const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { findOne } = useStrapi()

const { data: podcastData } = useAsyncData(`podcastData-${id}`, async () => {
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
                },
                article: {
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

        if (!response.data[0]) {
            return { podcast: {} }
        }

        const podcast = {
            id: response.data[0].id,
            ...response.data[0].attributes,
            image
        }

        podcast.date = formatDate(podcast.date)
        podcast.duration = formatDuration(podcast.duration)

        if (podcast.description) {
            podcast.description = await parseMarkdown(podcast.description)
        }

        if (podcast.emission) {
            const emissionImage = extractImage(podcast.emission.data)

            if (emissionImage) {
                emissionImage.url = `${STRAPI_URL}${emissionImage.url}`
            }

            podcast.emission = {
                ...podcast.emission.data.attributes,
                image: emissionImage
            }

            podcast.emission.url = `/emissions/${podcast.emission.code}`

            podcast.url = `/emissions/${podcast.emission.code}/${podcast?.id}`

        }

        if (podcast.article) {
            if (podcast.article.content) {
                podcast.article.content = await parseMarkdown(podcast.article.content)
            }
        }

        return podcast


    } catch (e) {
        console.error(e)
        return { podcast: {} }
    }
})

</script>

<template>
    <main class="flex flex-col w-full items-start justify-start h-full grow">
        <!-- Hero --->
        <div :class="`flex flex-col items-center justify-center bg-cover bg-center w-full h-full min-h-[30vh]`"
            :style='`background-image: url(${podcastData?.image?.url})`'>
            <div class="flex flex-col items-center justify-center w-full h-full min-h-[30vh]" :class="{
                'bg-black bg-opacity-80': podcastData?.image?.url,
            }">
                <div class="flex text-primary items-center lg:justify-between gap-5 w-full h-full max-w-screen-sm lg:max-w-screen-xl mx-auto py-8 px-10 lg:px-8 flex-col lg:flex-row-reverse"
                    :class="{
                        'text-white': podcastData?.image?.url,

                    }">
                    <div class="flex flex-col w-full lg:w-1/2 sm:max-w-sm ">
                        <img v-if="podcastData?.image?.url" :src="podcastData?.image?.url" :alt="podcastData?.title"
                            class="object-cover w-full aspect-square rounded-xl" />
                        <img v-else-if="podcastData?.emission?.image?.url" :src="podcastData?.emission?.image?.url"
                            :alt="podcastData?.emission?.title" class="object-cover w-full aspect-square rounded-xl" />
                    </div>
                    <div class="flex flex-col gap-2 w-full lg:w-1/2">
                        <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                            {{ podcastData?.title }}
                        </h1>
                        <div class="leading-7 text-muted-foreground lg:text-xl description py-2">
                            <ContentRendererMarkdown :value="podcastData?.description" v-if="podcastData?.description" />
                        </div>
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

            <!-- Emission -->
            <div class="flex flex-row max-w-screen-md w-full justify-center p-4 px-10">
                <NuxtLink :to="`/emissions/${podcastData?.emission?.code}`"
                    class="flex flex-row group/emission justify-start bg-primary hover:bg-primary/95 text-secondary neon-sm-slate rounded-3xl w-full p-5">
                    <div class="flex gap-5">
                        <img :src="podcastData?.emission?.image?.url" :alt="podcastData?.emission?.title"
                            class="object-cover w-24 aspect-square rounded-xl" />
                        <div class="flex flex-col justify-center pr-8">
                            <span>Provenant de l'émission</span>
                            <div class="flex">
                                <span
                                    class='text-xl lg:text-2xl font-semibold pt-2 bg-left-bottom bg-gradient-to-r from-background to-background bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ podcastData?.emission?.title }}
                                </span>
                            </div>

                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Article -->
            <div class="flex flex-col items-center justify-start w-full h-full max-w-screen-xl p-8" v-if="podcastData.article">
                <div class="flex flex-col w-full gap-5 mt-6 article">
                    <p class="leading-7 text-muted-foreground">
                        <ContentRendererMarkdown :value="podcastData.article?.content"
                            v-if="podcastData.article?.content" />
                    </p>
                </div>
            </div>

            <!-- Episodes similaires -->
            <div class="flex flex-col items-center justify-start w-full h-full max-w-screen-xl p-8">
                <h2
                    class="mt-10 scroll-m-20 border-b border-muted-foreground pb-3 text-3xl lg:text-4xl font-semibold tracking-tight transition-colors first:mt-0">
                    Épisodes similaires</h2>
                <div class="flex flex-col w-full gap-5 mt-6">

                    <!-- #TODO : fetch episodes from same emission -->
                </div>
            </div>
        </div>
    </main>
</template>