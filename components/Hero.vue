<template>
    <div class="flex flex-col items-center justify-center bg-cover bg-center w-full min-h-[40vh]"
        :style="`background-image: url(${data.background_image?.url})`">
        <div class="flex flex-col gap-6 lg:flex-row items-center justify-center w-full min-h-[40vh] h-full bg-black px-12 py-12"
            :class="{
                'bg-opacity-80': data.background_image?.url,
                'bg-opacity-0': !data.background_image?.url
            }">
            <div class="flex order-2 lg:order-1 flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white lg:px-8"
                :class="{
                    'lg:w-1/2 ': data.cover?.url,
                }">
                <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                    {{ data.title }}
                </h1>
                <p v-if="data.description" class="leading-7 !mt-0" :class="{
                    'text-slate-300': data.background_image?.url,
                    'text-muted-foreground': !data.background_image?.url
                }">
                    {{ data.description }}
                </p>
                <NuxtLink v-if="data.button" :to="data.button.url" class="mt-1">
                    <Button
                        class="bg-banane hover:bg-banane/90 font-semibold text-primary dark:text-primary-foreground">
                        {{ data.button.title }}
                    </Button>
                </NuxtLink>
            </div>
            <div class="w-full order-1 lg:order-2 lg:w-1/2" v-if="data.cover?.url">
                <img v-if="data.cover?.url" :src="data.cover.url" :alt="data.cover.title"
                    class="object-cover aspect-video w-full h-full rounded-xl max-w-lg mr-auto lg:mx-auto" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the props
const props = defineProps({
    data: Object,
});

</script>