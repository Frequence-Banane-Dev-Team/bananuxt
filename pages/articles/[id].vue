<script setup>
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { parseMarkdown } from '~/utils/parseMarkdown';

const useSong = useSongStore()

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
                cover: true,
                category: true,
                background_image: true
            }
        }))

        if (!response.data[0]) {
            return { article: {} }
        }


        const image = extractImage({item: response.data[0], baseUrl: STRAPI_URL})
        
        const background_image = extractImage({item: response.data[0], baseUrl: STRAPI_URL, field: 'background_image'})

        const article = {
            id: response.data[0].id,
            ...response.data[0].attributes,
            image,
            background_image
        }

        if (article.content) {
            article.content = await parseMarkdown(article.content)
        }

        if (article.category) {
            article.category = article.category.data.attributes
        }


        article.date = formatDate(article.date, 'DD MMM YYYY')

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
            :style='`background-image: url(${articleData?.background_image?.url})`'>
            <div class="flex flex-col items-center justify-center w-full h-full min-h-[30vh]"
                :class="{
                    'text-white bg-black bg-opacity-80': articleData?.background_image?.url,
                    'text-primary': !articleData?.background_image?.url
                }">
                <div
                    class="flex items-center lg:justify-between gap-5 w-full h-full max-w-screen-xl px-10 lg:px-8 py-10 flex-col lg:flex-row-reverse">
                    <div class="flex flex-col w-full lg:w-1/3 max-w-sm ">
                        <img v-if="articleData?.image?.url" :src="articleData?.image?.url" :alt="articleData?.title"
                            class="object-cover w-full aspect-video rounded-xl" />

                    </div>
                    <div class="flex flex-col lg:gap-1 w-full lg:w-2/3">
                        <h1 class="text-2xl lg:text-4xl font-bold">
                            {{ articleData?.title }}
                        </h1>
                        <p class="!mt-1 lg:!mt-2 text-slate-300 dark:text-slate-300 lg:text-xl">
                            {{ articleData?.description }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                            <div class="flex gap-2 items-center" v-if="articleData?.category">
                                <span>
                                    <Icon :name="articleData.category?.icon" size="24" />
                                </span>
                                <div class="flex flex-col">
                                    <span class="text-sm font-light">{{ articleData.category?.name }}</span>
                                </div>
                            </div>
                            <span class="text-sm font-light">&#x2022;</span>
                            <span class="text-sm font-light italic">
                                {{ articleData?.date }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        
        <!-- Content -->
        <main class="flex flex-col items-center justify-center w-full h-full  bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary">
            <div class="flex flex-col gap-5 w-full article max-w-screen-xl mx-auto px-10 lg:px-8 py-10 ">
                <ContentRendererMarkdown :value="articleData?.content" v-if="articleData?.content" />
            </div>
        </main>
    </div>
</template>