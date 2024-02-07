<script setup>

const colorMode = useColorMode()
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
                        background_image: true,
                        button: true
                    }
                },
                content: {
                    populate: {
                        header: true,
                        background_image: {
                            populate: {
                                image: true
                            }
                        },
                        cover: {
                            populate: {
                                image: true
                            }
                        },
                        button: true
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
            } else if (section.__component == 'sections.hero') {

                const hero_background_image = section.background_image?.image?.data?.attributes

                if (hero_background_image) {
                    section.background_image = {
                        url: `${STRAPI_URL}${hero_background_image.url}`,
                        alternativeText: hero_background_image.alternativeText
                    }
                }

                const hero_cover_image = section.cover?.image.data?.attributes

                if (hero_cover_image) {

                    section.cover = {
                        url: `${STRAPI_URL}${hero_cover_image.url}`,
                        alternativeText: hero_cover_image.alternativeText
                    }
                }

                console.log(section)

                return section
            }
        }))

        const hero = responseHome.data.attributes.hero?.data?.attributes

        if (hero) {

            const hero_background_image = responseHome.data.attributes.hero?.data.attributes.background_image?.data?.attributes

            if (hero_background_image) {
                hero_background_image.url = `${STRAPI_URL}${hero_background_image.url}`
            }

            const hero_cover_image = responseHome.data.attributes.hero?.data.attributes.cover?.data?.attributes

            if (hero_cover_image) {
                hero_cover_image.url = `${STRAPI_URL}${hero_cover_image.url}`
            }


            hero.background_image = hero_background_image
            hero.cover = hero_cover_image
        }

        return { hero: hero, content: content }



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
        <div v-if="heroData" class="flex flex-col items-center justify-center bg-cover bg-center w-full h-[40vh]"
            :style="`background-image: url(${heroData.background_image?.url})`">
            <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-50">
                <div class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white p-8">
                    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {{ heroData.title }}
                    </h1>
                    <p v-if="heroData.description" class="leading-7">
                        {{ heroData.description }}
                    </p>
                    <NuxtLink v-if="heroData.button" :to="heroData.button.url" class="mt-1">
                        <Button
                            class="bg-banane hover:bg-banane/90 font-semibold text-primary dark:text-primary-foreground">
                            {{ heroData.button.title }}
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-[40vh]">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div
                    class="flex flex-col items-center justify-center gap-6 w-full h-full max-w-screen-xl text-white p-8 object-contain">
                    <img v-if="colorMode.value == 'dark'" src="/logoFB_white.png" alt="Logo Fréquence Banane"
                        class="object-contain h-full mx-auto" />
                    <img v-else-if="colorMode.value == 'light'" src="/logoFB.png" alt="Logo Fréquence Banane"
                        class="object-contain h-full mx-auto" />
                    <h2
                        class="scroll-m-20 text-2xl font-light tracking-tight lg:text-3xl text-muted-foreground text-center">
                        La radio des étudiant·e·s UNIL-EPFL-UNIGE
                    </h2>
                </div>
            </div>
        </div>

        <div v-for="section in contentData" :key="section.id" class="flex w-full flex-col items-center ">
            <SectionCards v-if="section.__component == 'sections.cards'" :header="section.header" :items="section.items"
                :cardAspectRatio="section.aspect_ratio" :columns="+section.columns" :layout="section.layout" />

            <SectionHero v-else-if="section.__component == 'sections.hero'" :hero="section" />
        </div>

    </div>
</template>