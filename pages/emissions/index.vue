<script setup>

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;
const STRAPI_URL = config.public.STRAPI_URL;

const { find } = useStrapi()

const { data: emissionsData } = useAsyncData('emissionsData', async () => {
    try {
        const response = (await find('emissions', {
            sort: 'title:asc',
            populate: {
                cover: true
            }
        }))

        return response.data.map((emission) => {
            const image = extractImage(emission)

            if (image) {
                image.url = `${STRAPI_URL}${image.url}`
            }

            return {
                id: emission.id,
                ...emission.attributes,
                image
            }
        })

    } catch (e) {
        console.error(e)
        return []
    }
})

</script>

<template>
    <div class="flex flex-col w-full h-full grow items-start justify-start bg-gradient-to-t from-background to-background via-slate-100 dark:via-secondary ">
        <!-- Hero --->
        <div
            class="flex flex-col items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white p-8">
                    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Émissions
                    </h1>
                </div>
            </div>
        </div>

        <!-- Emissions -->
        <SectionCards :items="emissionsData" cardAspectRatio="square" columns="5" />

    </div>
</template>