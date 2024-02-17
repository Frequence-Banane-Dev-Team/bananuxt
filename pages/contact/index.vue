<script setup>
const colorMode = useColorMode()
const config = useRuntimeConfig();
const STRAPI_URL = config.public.STRAPI_URL;

import { parseMarkdown } from '~/utils/parseMarkdown'

const { findOne } = useStrapi()

const { data: contactData } = useAsyncData('contactData', async () => {
    try {

        const responseContact = (await findOne('contact', {

        }))


        const contact = responseContact.data.attributes

        if (contact.content) {
            contact.content = await parseMarkdown(contact.content)
        }

        if (contact.address_lausanne) {
            contact.address_lausanne = await parseMarkdown(contact.address_lausanne)
        }

        if (contact.address_geneve) {
            contact.address_geneve = await parseMarkdown(contact.address_geneve)
        }

        return contact

    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <div class="flex flex-col w-full gap-5 py-8 px-10 md:px-8">
        <div class="flex flex-col w-full max-w-screen-xl mx-auto">
            <h1>
                {{ contactData?.title }}
            </h1>
        </div>
        <div>
            <BlocsMarkdown :content="contactData.content" />
        </div>
        <div class="flex flex-col w-full article max-w-screen-xl mx-auto">
            <h2>Nos antennes</h2>
            <div class="flex flex-col md:flex-row justify-center gap-2 md:gap-5 items-center md:items-start mt-5 w-full">
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle>
                            Antenne de Lausanne
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="flex flex-col contact">
                        <ContentRendererMarkdown :value="contactData.address_lausanne" />
                        <h5 v-if="contactData.mail_lausanne" class="text-lg font-semibold mt-3">Contact</h5>
                        <NuxtLink :to="contactData.mail_lausanne ? `mailto:${contactData.mail_lausanne}` : null"
                            class="!text-sm !text-yellow-400 !leading-7 !font-normal !no-underline hover:!underline transition !pb-0">
                            {{ contactData.mail_lausanne }}
                        </NuxtLink>
                    </CardContent>
                </Card>
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle>
                            Antenne de Genève
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="flex flex-col contact">
                        <ContentRendererMarkdown :value="contactData.address_geneve" />
                        <h5 v-if="contactData.mail_geneve" class="text-lg font-semibold mt-3">Contact</h5>
                        <NuxtLink :to="contactData.mail_geneve ? `mailto:${contactData.mail_geneve}` : null"
                            class="!text-sm !text-yellow-400 !leading-7 !font-normal !no-underline hover:!underline transition !pb-0">
                            {{ contactData.mail_geneve }}
                        </NuxtLink>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div class="flex flex-wrap w-full max-w-screen-xl mx-auto">

        </div>
    </div>
</template>

<style>
.contact p {
    margin: 0 !important;
}
</style>