<script setup>
const colorMode = useColorMode()
const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

import { default as processSectionsHero } from '~/controllers/sections.hero'
import { default as processBlocMarkdown } from '~/controllers/blocs.markdown'
import { default as processSectionsHeader } from '~/controllers/sections.header'

const { findOne } = useStrapi()

const { data: associationData } = useAsyncData('associationData', async () => {
    try {

        const responseAssociation = (await findOne('association', {
            populate: {
                cover: true,
                background_image: true,
                button: true,
                comite_lausanne: true,
                comite_geneve: true,
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

        let content = await Promise.all(responseAssociation.data.attributes.content.map(async (section) => {

            if (section.__component == 'blocs.markdown') {
                section = await processBlocMarkdown(section)
            } else if (section.__component == 'sections.hero') {
                section = await processSectionsHero(section, config)
            } else if (section.__component == 'sections.header') {
                section = await processSectionsHeader(section)
            }

            return section
        }))

        const association = responseAssociation.data.attributes
        association.content = content

        return association

    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <div class="flex flex-col w-full gap-5 py-8 px-10 md:px-8">
        <div class="flex flex-col w-full max-w-screen-xl mx-auto">
            <h1>
                {{ associationData?.title }}
            </h1>
        </div>
        <div v-for="(section, index) in associationData?.content" :key="index">
            <BlocsMarkdown v-if="section.__component === 'blocs.markdown'" :content="section.content" />
            <SectionHero v-else-if="section.__component === 'sections.hero'" :hero="section" :hover="false" />
            <SectionHeader v-else-if="section.__component === 'sections.header'" :header="section" />
        </div>
        <div class="flex flex-col w-full article max-w-screen-xl mx-auto">
            <h2>Nos antennes</h2>
            <div class="flex flex-col md:flex-row justify-center gap-2 md:gap-5 items-center mt-3 w-full">


            </div>
        </div>
        <div class="flex flex-wrap w-full max-w-screen-xl mx-auto">
            <div class="flex w-full md:w-1/2 gap-3 justify-center md:justify-end p-2">
                <div class="flex flex-col mx-auto md:mr-0 gap-3">
                    <BlocsComite :comite="associationData.comite_lausanne" :title="'Comité Lausanne'" />
                    <Button :to="associationData.statuts_lausanne_url" as="NuxtLink" class="min-w-64">
                        Statuts Lausanne
                    </Button>
                </div>
               
            </div>
            <div class="flex flex-col w-full md:w-1/2 gap-3 justify-center md:justify-start p-2">
                <div class="flex flex-col mx-auto md:ml-0 gap-3">
                    <BlocsComite :comite="associationData.comite_geneve" :title="'Comité Genève'" />
                    <Button :to="associationData.statuts_geneve_url" as="NuxtLink" class="min-w-64">
                        Statuts Genève
                    </Button>
                </div>

            </div>
        </div>
    </div>
</template>