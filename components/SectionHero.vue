<template>
    <div class="flex flex-col w-full items-center justify-start">
        <div class="flex flex-col items-start justify-start w-full h-full max-w-screen-xl">
            <div v-if="hero" class="flex flex-col items-center justify-center bg-cover bg-center w-full rounded-xl transition duration-300 ease-in-out overflow-hidden"
                :class="{
                    'hover:scale-[1.01]': hover
                }"
                :style="`background-image: url(${hero.background_image?.url})`">
                <div class="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div
                        class="flex flex-col items-start justify-center gap-3 w-full h-full max-w-screen-xl text-white px-8 py-20 min-h-[250px]">
                        <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
                            {{ hero.title }}
                        </h1>
                        <p v-if="hero.description" class="leading-7 text-slate-300 dark:text-slate-300">
                            {{ hero.description }}
                        </p>
                        <NuxtLink v-if="hero.button" :to="hero.button.url" class="mt-1">
                            <Button
                                class="bg-banane hover:bg-banane/90 font-semibold text-primary dark:text-primary-foreground">
                                {{ hero.button.title }}
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup >

const props = defineProps({
    hero: {
        type: Object
    },
    hover: {
        type: Boolean,
        default: true
    }
})

</script>
