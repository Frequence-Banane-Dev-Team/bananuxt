<script setup>

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: articlesData } = useAsyncData('articlesData', async () => {
    try {
        const response = (await find('articles', {
            sort: 'date:desc',
            populate: {
                cover: true,
                category: true
            }
        }))

        return response.data.map((article) => {
            const image = extractImage({ item: article, baseUrl: STRAPI_URL })

            let articleData = {
                id: article.id,
                ...article.attributes,
                image
            }

            if (articleData.category) {
                articleData.category = articleData.category.data.attributes
            }

            articleData.url = `/articles/${articleData.id}`

            return articleData
        })

    } catch (e) {
        console.error(e)
        return []
    }
})

</script>

<template>
    <div
        class="flex flex-col w-full h-full grow items-start justify-start bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
        <!-- Hero --->
        <div class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-primary p-8 pb-2">
                    <h1>Articles
                    </h1>
                </div>
            </div>
        </div>

        <!-- Emissions -->
        <SectionCards :items="articlesData" cardAspectRatio="video" :columns="3" />

    </div>
</template>