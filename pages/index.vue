<script setup>
import { Button } from '~/components/ui/button';

const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: homeData } = useAsyncData('homeData', async () => {
    try {

        const responseHome = (await find('home', {
            populate: {
                hero: {
                    populate: {
                        cover: true,
                        background_image: true
                    }
                },
                content: {
                    populate: {
                        header: true,
                    }
                }
            }
        }))

        

        let content = await Promise.all(responseHome.data.attributes.content.map(async (section) => {

            if (section.__component == 'sections.cards') {
                let data = []

                if (section.slug == 'unes') {
                    const response = await find('podcasts', {
                        sort: 'date:desc',
                        populate: {
                            cover: true,
                            emission: {
                                populate: {
                                    cover: true
                                }
                            }
                        }
                    })

                    const podcasts = response.data.map(item => {
                        item.slug = 'podcasts'
                        return item
                    })

                    const responseArticles = (await find('articles', {
                        sort: 'date:desc',
                        populate: {
                            cover: true,
                            category: true
                        }
                    }))

                    const articles = responseArticles.data.map(item => {
                        item.slug = 'articles'
                        if (item.attributes.cover) {
                            item.attributes.cover.format = 'video'
                        }
                        return item
                    })

                    data = [...podcasts, ...articles]

                    data = data.sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date))
                    
                } else {
                    
                    data = (await find(section.slug, {
                        sort: section.slug == 'emissions' ? 'title:asc' : 'date:desc',
                        populate: {
                            cover: true,
                            category: true,
                            emission: {
                                populate: {
                                    cover: true
                                }
                            }
                        }
                    })).data.map(item => {
                        item.slug = section.slug
                        return item
                    })             

                }

                const LIMIT = section.columns;

                const items = await Promise.all(data.slice(0, LIMIT).map(async (item) => {
                    const image = extractImage(item)

                    if (image) {
                        image.url = `${STRAPI_URL}${image.url}`
                        image.format = item.attributes.cover?.format
                    }

                    let itemData = {
                        id: item.id,
                        ...item.attributes,
                        slug: item.slug,
                        image
                    }

                    if (itemData.slug == 'podcasts') {
                        itemData.url = `/emissions/${itemData.emission?.data.attributes.code}/${itemData.id}`
                    } else if (itemData.slug == 'emissions') {
                        itemData.url = `/emissions/${itemData.code}`
                    } else {
                        itemData.url = `/${itemData.slug}/${itemData.id}`
                    }

                    if (item.attributes.category && item.attributes.category.data) {
                        itemData.category = item.attributes.category.data.attributes
                    }

                    if (itemData.date) {
                        itemData.date = formatDate(itemData.date)
                    }

                    if (itemData.duration) {
                        itemData.duration = formatDuration(itemData.duration)
                    }

                    if (itemData.emission) {

                        const emissionImage = extractImage(itemData.emission?.data)

                        itemData.emission = itemData.emission?.data.attributes

                        if (emissionImage) {
                            emissionImage.url = `${STRAPI_URL}${emissionImage.url}`
                        }

                        itemData.emission.image = emissionImage
                        itemData.emission.url = `/emissions/${itemData.emission.code}`

                        if (!itemData.image) {
                            itemData.image = emissionImage
                        }
                    }

                    return itemData
                }))

                section.items = items

                return section
            }
        }))

        return { hero : responseHome.data.attributes.hero, content: content }



    } catch (e) {
        console.error(e)
        return { hero: null, content: [] }
    }
})

// Accessing the emission and podcasts data
const heroData = computed(() => homeData.value.hero);
const contentData = computed(() => homeData.value.content);

</script>

<template>
    <div
        class="flex flex-col w-full items-start justify-center bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
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
        <SectionCards v-for="item in contentData" :header="item.header" :items="item.items" :cardAspectRatio="item.aspect_ratio" :columns="+item.columns" :layout="item.layout" />

        
</div></template>