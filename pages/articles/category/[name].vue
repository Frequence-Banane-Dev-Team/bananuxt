<script setup>
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { parseMarkdown } from '~/utils/parseMarkdown';
import { ChevronLeft } from 'lucide-vue-next';

const useSong = useSongStore()

const route = useRoute();
const name = route.params.name; // Accessing the `name` param

const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: articleData } = useAsyncData(`articleData-category-${name}`, async () => {
    let articles = []
    try {

        const response = (await find('articles', {
            filters: {
                category:
                {
                    name: name
                }
            },
            sort: 'date:desc',
            populate: {
                cover: true,
                category: true,
                background_image: true
            }
        }))

        articles = response.data.map((article) => {
            const image = extractImage({ item: article, baseUrl: STRAPI_URL })

            let articleData = {
                id: article.id,
                ...article.attributes,
                image
            }

            if (articleData.category) {
                articleData.category = articleData.category.data.attributes
            }

            if (articleData.date) {
                articleData.date = formatDate(articleData.date)
            }

            articleData.url = `/articles/${articleData.id}`

            return articleData
        })

        return { articles }

    } catch (e) {
        console.error(e)
        return { articles: [] }
    }
})
</script>


<template>
    <div
        class="flex flex-col w-full h-full grow items-start justify-start bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
        <!-- Hero --->
        <div class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div
                    class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-primary p-8 pb-2">
                    <NuxtLink class="flex group/category transition-all duration-300 ease-in-out text-sm font-light"
                        :to="`/articles`">
                        <h1
                            class='items-center bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/category:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                            <ChevronLeft class="w-10 h-10 inline-block mb-1" />
                            Articles
                        </h1>
                    </NuxtLink>
                    <h2 class="flex items-center gap-2 mx-auto sm:mx-0">
                        <Icon :name="articleData.articles[0]?.category.icon" />
                        {{ name }}
                    </h2>
                </div>
            </div>
        </div>

        <SectionCards :items="articleData.articles" cardAspectRatio="video" :columns="3" />

    </div>
</template>