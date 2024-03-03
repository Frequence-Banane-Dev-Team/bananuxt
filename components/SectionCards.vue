<template>
    <div class="flex flex-col w-full items-center justify-start">
        <div class="flex flex-col items-start justify-start w-full h-full max-w-screen-xl p-8">

            <SectionHeader v-if="header" :header="header" />

            <div class="grid w-full gap-5" :class="{
                'mt-6': header
            }" :style="gridStyle">

                <div class="flex flex-col w-full" v-for="item in items" :class="{
                    'md:col-span-2': layout == 'mixed' && item?.image?.format === 'video'
                }">
                    <div v-if="item.url" class="group/title flex flex-col w-full mb-2">
                        <NuxtLink :to="item.url" class="flex" v-if="item.image">
                            <div class="flex rounded-xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300 w-full"
                            :class="{
                                'aspect-video': cardAspectRatio == 'video' || item?.image?.format == 'video',
                                'aspect-square': cardAspectRatio == 'square' && item?.image?.format !== 'video',
                                'md:max-h-[180px] xl:max-h-[220px]': layout == 'mixed'
                            }">
                                <img :src="item.image?.url" :alt="item.title" class="object-cover object-center w-full" :class="{
                                    'aspect-video': cardAspectRatio == 'video' || item.image?.format == 'video',
                                    'aspect-square': cardAspectRatio == 'square' && item.image?.format !== 'video'
                                }" />
                            </div>
                        </NuxtLink>
                        <NuxtLink class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2"
                            :to="item.url">
                            <span
                                class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                {{ item?.title }}
                            </span>
                        </NuxtLink>
                    </div>
                    <div v-else class="group/title flex flex-col w-full mb-2">
                        <div v-if="item.image">
                            <div class=" w-full object-cover rounded-xl overflow-hidden  hover:scale-[1.02] hover:-translate-y-1 shadow shadow-white/50 transition duration-300"
                                :class="{
                                    'aspect-video': cardAspectRatio === 'video' || item.image?.format == 'video',
                                    'aspect-square': cardAspectRatio === 'square' && item.image?.format !== 'video'
                                }">

                                <img :src="item.image?.url" :alt="item.title" class="object-cover w-full" :class="{
                                    'aspect-video': cardAspectRatio === 'video' || item.image?.format == 'video',
                                    'aspect-square': cardAspectRatio === 'square' && item.image?.format !== 'video'
                                }" />
                            </div>
                        </div>
                        <div class="transition-all duration-300 ease-in-out text-xl font-semibold pt-2">
                            <span
                                class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/title:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                {{ item?.title }}
                            </span>
                        </div>
                    </div>
                    <div v-if="item.emission || item.category" class="flex flex-col items-start justify-start gap-2 ">

                        <div class="flex gap-2 items-center" v-if="item.emission">
                            <button
                                class="bg-banane hover:bg-banane/90 shadow-md font-semibold text-primary dark:text-primary-foreground flex rounded-full h-9 w-9 items-center justify-center p-1.5"
                                @click="useSong.playOrPauseThisSong({
                                    ...item.emission,
                                }, {
                                    title: item.title,
                                    audio_url: item.audio_url,
                                    url: item.url,
                                    image: item.image
                                })">

                                <Pause v-if="currentTrack?.title == item.title && isPlaying" :size="25" />
                                <Play v-else :size="25" />

                            </button>
                            <div class="flex flex-col font-thin">
                                <NuxtLink
                                    class="group/emission transition-all duration-300 ease-in-out text-sm font-light"
                                    :to="`/emissions/${item.emission.code}`">
                                    <span
                                        class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/emission:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                        {{ item.emission?.title }}
                                    </span>
                                </NuxtLink>
                                <span class="text-sm font-light">{{ item.duration }}</span>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center" v-else-if="item.category">
                            <span class="text-primary pb-1">
                                <Icon :name="item.category?.icon" size="24" />
                            </span>
                            <NuxtLink
                                class="flex group/category transition-all duration-300 ease-in-out text-sm font-light"
                                :to="`/articles/category/${item.category.name}`">
                                <span
                                    class='bg-left-bottom bg-gradient-to-r from-primary to-primary bg-[length:0%_1.5px] bg-no-repeat group-hover/category:bg-[length:100%_1.5px] transition-all duration-500 ease-out pb-[1px]'>
                                    {{ item.category?.name }}
                                </span>
                            </NuxtLink>
                            <span class="text-sm font-light">&#x2022;</span>
                            <span class="text-sm font-light italic">
                                {{ item?.date }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Button } from '~/components/ui/button';
import Play from 'vue-material-design-icons/Play.vue';
import Pause from 'vue-material-design-icons/Pause.vue';
import { useSongStore } from '~/stores/song';
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, audio, currentTrack, currentEmission } = storeToRefs(useSong)

// items as props
const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    header: {
        type: Object
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
    },
    layout: {
        type: String
    }
})

let windowWidth = ref(null);

const handleResize = () => {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
})

const gridStyle = computed(() => {

    const totalColumns = props.columns;

    const baseColumns = 1; // Default to 1 column
    const mdColumns = Math.ceil(totalColumns / 2);
    const xlColumns = totalColumns;

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
