<template>
    <div class="flex flex-col max-w-screen-xl">
        <NuxtLink v-if="header && header.url" :to="header?.url"
            class="group/header transition-all duration-300 ease-in-out">
            <h2
                class="
                    bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/header:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]
                    flex items-center gap-1 mt-10 scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">
                <Icon :name="header?.icon" class="w-8 h-8 inline-block mr-1" v-if="header?.icon" />
                    {{ header?.title }}
                <ChevronRight class="w-8 h-8 inline-block" />
            </h2>
        </NuxtLink>
        <h2 v-else-if="header"
            class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {{ header.title }}
        </h2>
    </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next';
defineProps({
    header: {
        type: Object,
        required: true
    }
})
</script>