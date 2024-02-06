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

const { data: articleData } = useAsyncData(`articleData-${id}`, async () => {
    try {

        const response = (await findOne('articles', {
            filters: {
                id: id
            },
            populate: {
                cover: true
            }
        }))

        if (!response.data[0]) {
            return { article: {} }
        }


        const image = extractImage(response.data[0])

        if (image) {
            image.url = `${STRAPI_URL}${image.url}`
        }

    

        const article = {
            id: response.data[0].id,
            ...response.data[0].attributes,
            image
        }

        return article


    } catch (e) {
        console.error(e)
        return { article: {} }
    }
})

</script>

<template>
    <div class="flex flex-col w-full items-start justify-start h-full grow">
        <!-- Hero --->
        <div :class="`flex flex-col items-center justify-center bg-cover bg-center w-full h-full min-h-[30vh]`"
            :style='`background-image: url(${articleData?.image?.url})`'>
            <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-80 min-h-[30vh]">
                <div
                    class="flex items-center lg:justify-between gap-5 w-full h-full max-w-screen-xl text-white px-8 py-10 flex-col lg:flex-row-reverse">
                    <div class="flex flex-col w-full lg:w-1/2 max-w-sm ">
                        <img v-if="articleData?.image?.url" :src="articleData?.image?.url" :alt="articleData?.title"
                            class="object-cover w-full aspect-video rounded-xl" />
                        
                    </div>
                    <div class="flex flex-col gap-2 w-full lg:w-1/2">
                        <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                            {{ articleData?.title }}
                        </h1>
                        <p class="leading-7 text-slate-400 lg:text-xl">
                            {{ articleData?.description }}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>