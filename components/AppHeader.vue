<template>
    <header class="h-24 flex items-center justify-between sticky top-0 left-0 w-full z-[100]" >
        <div
            class="flex w-full h-full text-primary bg-background m-0 gap-6 px-6 items-center justify-between lg:justify-between text-center flex-wrap z-[90]"
            >
            <div class="logo">
                <NuxtLink to="/">
                    <img v-if="colorMode.value == 'light'" src="/logoFB.png" alt="Logo Fréquence Banane"
                        class="w-32 md:w-48 h-full" />
                    <img v-else-if="colorMode.value == 'dark'" src="/logoFB_white.png" alt="Logo Fréquence Banane"
                        class="w-32 md:w-48 h-full" />
                </NuxtLink>
            </div>
            <div class="flex flex-row items-center justify-center">
                <NavigationMenu class="hidden lg:flex flex-row gap-6 items-center justify-center">
                    <NavigationMenuList>
                        <NavigationMenuItem v-for="item in navItems" :key="item.name">
                            <NavigationMenuLink asChild :class="navigationMenuTriggerStyle()" class="font-semibold">
                                <NuxtLink :to="item.url" :class="linkClass(item)" rel="noreferrer noopener">
                                    {{ item.name }}
                                </NuxtLink>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div class="flex gap-5 md:mx-5 items-center justify-center">
                    <NuxtLink href="https://www.instagram.com/frequencebanane/" target="_blank" rel="noreferrer noopener">
                        <InstagramLogoIcon class="w-7 h-7 hover:text-banane" />
                    </NuxtLink>
                    <ModeToggle />
                </div>
                <div class="flex lg:hidden  hover:bg-accent/50 rounded p-2 aspect-square hover:cursor-pointer"
                    @click="() => setIsMobileMenuOpen(true)">
                    <Menu class="text-light text-xl" :size="25" />
                </div>
            </div>


        </div>
        <!-- Mobile menu -->
        <TransitionRoot appear :show="isMobileMenuOpen" as="template">
            <Dialog as="div" @close="setIsMobileMenuOpen">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                    leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/50 z-[100]" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto overflow-x-hidden z-[100]" >
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 translate-x-full"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 translate-x-full">
                        <DialogPanel class="h-full w-2/3 ml-auto">
                            <div class="flex flex-col bg-background h-full w-full overflow-y-auto p-8">
                                <button class="bg-secondary hover:bg-muted-foreground hover:text-background rounded-full p-3 text-primary flex ml-auto"
                                    title="Fermer le menu" @click="() => setIsMobileMenuOpen(false)">
                                    <XMarkIcon class="w-6 h-6" />
                                </button>

                                <div v-for="item in navItems" :key="item.name" class="mt-4 flex flex-col">
                                    <NuxtLink
                                    :to="item?.url"
                                    :class="{
                                        'bg-accent text-accent-foreground': route.path === item.url,
                                    }"
                                    class="text-xl font-regular rounded-lg duration-200 bg-background px-6 py-4  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                                        <span>
                                            {{ item?.name }}
                                        </span>
                                    </NuxtLink>
                                </div>

                                <NuxtLink to="/" class="mt-auto">
                                    <img v-if="colorMode.value == 'light'" src="/logoFB.png" alt="Logo Fréquence Banane"
                                        class="w-48" />
                                    <img v-else-if="colorMode.value == 'dark'" src="/logoFB_white.png"
                                        alt="Logo Fréquence Banane" class="w-48" />
                                </NuxtLink>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

    </header>
</template>

<script setup lang="ts">
import navItems from '@/navigationConfig'; // Update the path accordingly
import Menu from 'vue-material-design-icons/Menu.vue'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
    PopoverGroup,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel
} from '@headlessui/vue'

import { MagnifyingGlassIcon, Bars3Icon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { InstagramLogoIcon } from "@radix-icons/vue"

const colorMode = useColorMode()

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const menuOpen = ref(false);

const route = useRoute();


function linkClass(item: any) {
    const isActive = route.path === item.url;
    return [
        'rounded-full p-2 font-bold px-4',
        isActive ? 'bg-dark text-light' : 'bg-light text-dark'
    ];
}

const isMobileMenuOpen = ref(false)
function setIsMobileMenuOpen(value: boolean) {
    isMobileMenuOpen.value = value
}

watch(route, () => {
    setIsMobileMenuOpen(false)
})

onMounted(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    handleWindowSizeChange()
})
onUnmounted(() => {
    window.removeEventListener('resize', handleWindowSizeChange)
})
const handleWindowSizeChange = () => {
    if (window.innerWidth >= 768) { // Tailwind’s md breakpoint
        setIsMobileMenuOpen(false)
    }
}

</script>