<template>
    <div class="flex flex-col w-full items-center justify-start">
        <div class="flex flex-col items-start justify-start w-full h-full max-w-screen-xl p-8">
            <NuxtLink v-if="header && header.link" :to="header.link" class="group/header transition-all duration-300 ease-in-out">
                <h2
                    class="
                    bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/header:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]
                    flex items-center gap-1 mt-10 scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">
                    {{ header.title }}
                    <ChevronRight class="w-8 h-8 inline-block" />
                </h2>
            </NuxtLink>
            <h2 v-else-if="header"
                class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                {{ header.title }}
            </h2>
            <div class="grid w-full gap-5 mt-6"
               :style="gridStyle"
            >

                <div class="flex flex-col w-full" v-for="item in items">
                    <div v-if="item.link" class="group/title flex flex-col w-full mb-2">
                        <NuxtLink :to="item.link">
                            <div class="w-full object-cover rounded-xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300"
                                :class="{
                                    'aspect-video': cardAspectRatio == 'video',
                                    'aspect-square': cardAspectRatio == 'square'
                                }">

                                <img :src="item.cover" :alt="item.title" class="object-cover w-full h-full" :class="{
                                    'aspect-video': cardAspectRatio == 'video',
                                    'aspect-square': cardAspectRatio == 'square'
                                }" />
                            </div>
                        </NuxtLink>
                        <NuxtLink class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2"
                            :to="item.link">
                            <span
                                class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                {{ item.title }}
                            </span>
                        </NuxtLink>
                    </div>
                    <div v-else class="group/title flex flex-col w-full mb-2">
                        <div>
                            <div class=" w-full object-cover rounded-xl overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300"
                                :class="{
                                    'aspect-video': cardAspectRatio === 'video',
                                    'aspect-square': cardAspectRatio === 'square'
                                }">


                                <img :src="item.cover" :alt="item.title" class="object-cover w-full" :class="{
                                    'aspect-video': cardAspectRatio === 'video',
                                    'aspect-square': cardAspectRatio === 'square'
                                }" />
                            </div>
                        </div>
                        <div class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2">
                            <span
                                class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                {{ item.title }}
                            </span>
                        </div>
                    </div>
                    <div v-if="item.emission || item.article" class="flex flex-col items-start justify-start gap-2 ">

                        <div class="flex gap-2 items-center" v-if="item.emission">
                            <button
                                class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                @click="useSong.playOrPauseThisSong(item.emission, {
                                    name: item.title,
                                    path: item.url,
                                    link: item.link
                                })">

                                <Pause v-if="currentTrack?.name == item.title && isPlaying" :size="25" />
                                <Play v-else :size="25" />

                            </button>
                            <div class="flex flex-col font-thin">
                                <NuxtLink class="group/emission transition-all duration-300 ease-in-out text-sm font-light"
                                    :to="`/emissions/${item.emission.code}`">
                                    <span
                                        class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                        {{ item.emission.name }}
                                    </span>
                                </NuxtLink>
                                <span class="text-sm font-light">{{ item.duration }}</span>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center" v-else-if="item.article">
                            <span class="text-primary">
                                <Icon :name="categoryMap[item.article.category].icon" size="24" />
                            </span>
                            <div class="flex flex-col font-thin">
                                <span class="text-sm font-light">{{ categoryMap[item.article.category].name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup >
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
import { ChevronRight } from 'lucide-vue-next';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

const categoryMap = {
    'politique_societe': {
        name: 'Politique & Société',
        icon: 'lucide:newspaper'
    },
}

// items as props
const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    header: {
        type: Object,
        required: true
    },
    cardAspectRatio: {
        type: String,
        default: 'video',
        validator: (value) => {
            return ['square', 'video'].includes(value)
        }
    },
    columns: {
        type: Number,
        default: 3
    }
})

let windowWidth = ref(0);

const handleResize = () => {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
})

const gridStyle = computed(() => {
    const baseColumns = 1; // Default to 1 column
    const mdColumns = Math.ceil(props.columns / 2);
    const xlColumns = props.columns;

    let renderedColumns = baseColumns;

    if (windowWidth.value > 768) {
        renderedColumns = mdColumns;
    }

    if (windowWidth.value > 1024) {
        renderedColumns = xlColumns;
    }

    return {
        gridTemplateColumns: `repeat(${renderedColumns}, minmax(0, 1fr))`
    }
})

</script>
