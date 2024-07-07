<script setup>

const colorMode = useColorMode()
const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

import { default as processSectionsCards } from '~/controllers/sections.cards'
import { default as processSectionsHero } from '~/controllers/sections.hero'
import { default as processSectionsEmissions } from '~/controllers/sections.emissions'
import { default as processHero } from '~/controllers/hero'

const { data: homeData } = useAsyncData(`homeData`, async () => {
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
                        emissions: {
                            populate: {
                                cover: true
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
                section = await processSectionsCards(section, config, find)
            } else if (section.__component == 'sections.hero') {
                section = await processSectionsHero(section, config)
            } else if (section.__component == 'sections.emissions') {
                section = await processSectionsEmissions(section, config, find)
            }

            return section
        }))

        const hero = await processHero(responseHome.data.attributes.hero, config)

        return { heros: [hero], content: content }



    } catch (e) {
        console.error(e)
        return { hero: null, content: [] }
    }
})

// Accessing the emission and podcasts data
const heroData = computed(() => homeData.value.heros);
const contentData = computed(() => homeData.value.content);

</script>

<template>
    <div
        class="flex flex-col w-full items-start justify-center bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">

        <!-- Hero --->
        <Hero v-if="heroData && heroData.length == 1" :data="heroData[0]" />
        <Carousel v-else-if="heroData" :data="heroData" />

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

        <div v-for="section in contentData" :key="section.id"
            class="flex w-full flex-col items-center px-8 mt-8 lg:mt-0">
            <SectionCards v-if="section.__component == 'sections.cards'" :header="section.header" :items="section.items"
                :cardAspectRatio="section.aspect_ratio" :columns="+section.columns" :layout="section.layout" class="" />
            
            <SectionCards v-if="section.__component == 'sections.emissions'" :header="section.header" :items="section.items"
                cardAspectRatio="square" :columns="+section.columns" />

            <div class="flex flex-col px-8 w-full max-w-screen-xl" v-else-if="section.__component == 'sections.hero'">
                <SectionHero :hero="section" class="lg:px-0 mt-6" />
            </div>
        </div>

    </div>
</template>