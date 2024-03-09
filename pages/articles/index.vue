<script setup>

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: articlesPageData } = useAsyncData('articlesPageData', async () => {
    let categories = []
    /*try {
        const response = (await find('categories', {}))

        categories = response.data.map((category) => {
            return {
                id: category.id,
                ...category.attributes
            }
        })
    } catch (e) {
        console.error(e)
    }*/

    let articles = []
    try {
        const response = (await find('articles', {
            sort: 'date:desc',
            populate: {
                cover: true,
                category: true
            }
        }))

        articles = response.data.map((article) => {
            const image = extractImage({ item: article, baseUrl: STRAPI_URL })

            let articleData = {
                id: article.id,
                ...article?.attributes,
                image
            }

            if (articleData.category) {
                articleData.category = articleData.category?.data?.attributes
            }

            if (articleData.date) {
                articleData.date = formatDate(articleData.date)
            }

            articleData.url = `/articles/${articleData.id}`

            return articleData
        })

    } catch (e) {
        console.error(e)
    }

    return {
        categories,
        articles
    }
})

const LIMIT_PER_CATEGORY = 3

// Group articles by category
const articlesGroupedByCategory = computed(() => {
    const grouped = {}
    articlesPageData.value.articles.forEach(article => {
        const categoryId = article.category ? article.category.name : 'autres'
        if (!grouped[categoryId]) {
            grouped[categoryId] = {
                category: article.category || { name: 'Autres' },
                articles: []
            }
        }
        if (grouped[categoryId].articles.length < LIMIT_PER_CATEGORY) {
            grouped[categoryId].articles.push(article)
        }
    })

    // sort grouped dictionary by key and sort articles by publishedAt per category
    const ordered = {}
    Object.keys(grouped).sort().forEach(key => {
        ordered[key] = grouped[key]
        /*ordered[key].articles.sort((a, b) => {
            return new Date(b.publishedAt) - new Date(a.publishedAt)
        })*/
    })

    return Object.values(ordered)
})


</script>

<template>
    <div
        class="flex flex-col w-full h-full grow items-start justify-start bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
        <!-- Hero --->
        <div class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div
                    class="flex flex-col items-center sm:items-start justify-center gap-3 w-full h-full max-w-screen-xl text-primary p-8 pb-2">
                    <h1>Articles</h1>
                </div>
            </div>
        </div>

        <SectionCards :items="articlesPageData.articles.slice(0, LIMIT_PER_CATEGORY)" cardAspectRatio="video"
            :columns="LIMIT_PER_CATEGORY" :header="{
            title: 'Derniers articles',
        }" />


        <!-- Sections per category -->
        <div v-for="(group, index) in articlesGroupedByCategory" :key="index"
            class="flex flex-col w-full max-w-screen-xl mx-auto">
            <SectionCards :items="group.articles" cardAspectRatio="video" :columns="LIMIT_PER_CATEGORY" :header="{
            icon: group.category.icon,
            title: group.category.name,
            url: `/articles/category/${group.category.name}`
        }" />
        </div>

    </div>
</template>