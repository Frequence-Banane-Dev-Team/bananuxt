<script setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue'
import { DotFilledIcon, DotIcon } from "@radix-icons/vue"

const props = defineProps({
    data: Array,
})

const selectedTab = ref(0)
let intervalId = null

function changeTab(index) {
    selectedTab.value = index
    resetInterval()
}

function loopTabs() {
    selectedTab.value = (selectedTab.value + 1) % props.data.length
}

function resetInterval() {
    clearInterval(intervalId)
    intervalId = setInterval(loopTabs, 10000)
}

onMounted(() => {
    resetInterval()
})

onBeforeUnmount(() => {
    clearInterval(intervalId)
})

</script>

<template>
    <div class="flex flex-col items-center justify-center w-full min-h-[40vh] relative">
        <TabGroup :selectedIndex="selectedTab" @change="changeTab">
            <TabPanels class="flex flex-col w-full">
                <TabPanel v-for="tab in data" :key="tab.id">
                    <Hero :data="tab" />
                </TabPanel>
            </TabPanels>
            <TabList class="flex gap-2 mt-4 items-center absolute bottom-4">
                <Tab v-for="tab in data" :key="tab.id" as="template" v-slot="{ selected }">
                    <DotFilledIcon class="w-10 h-10" v-if="selected" />
                    <DotIcon class="w-10 h-10 cursor-pointer hover:text-banane" v-else />
                </Tab>
            </TabList>
        </TabGroup>
    </div>
</template>
