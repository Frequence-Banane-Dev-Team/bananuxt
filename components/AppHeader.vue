<template>
    <header class="grid sticky top-0 z-10 w-full ">
        <div
            class="flex text-primary  bg-background m-0 gap-6 items-center justify-between lg:justify-between p-6 lg:p-4 text-center flex-wrap">
            <div class="logo">
                <NuxtLink to="/">
                    <img v-if="colorMode.value == 'light'" src="/logoFB.png" alt="Logo Fréquence Banane"
                        class="w-48 h-full" />
                    <img v-else-if="colorMode.value == 'dark'" src="/logoFB_white.png" alt="Logo Fréquence Banane"
                        class="w-48 h-full" />
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
                <div class="flex gap-6 mx-2 items-center justify-center">
                    <ModeToggle />
                </div>
                <div class="flex lg:hidden  hover:bg-accent/50 rounded p-2 aspect-square hover:cursor-pointer"
                    @click="toggleMenu" ref="menuToggleButton">
                    <Menu class="text-light text-xl" :size="25" />
                </div>
            </div>


        </div>
        <div v-if="menuOpen" v-click-outside="{ handler: closeMenu, exclude: $refs.menuToggleButton }"
            class="flex flex-col w-full relative">
            <transition name="collapse">
                <div class="flex flex-col w-full justify-center fixed shadow bg-background">
                    <NuxtLink v-for="item in navItems" :key="item.name" :to="item.url"
                        :class="mobileLinkClass(item)">
                        {{ item.name }}
                    </NuxtLink>
                </div>
            </transition>
        </div>
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

const colorMode = useColorMode()

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const menuOpen = ref(false);

const route = useRoute();

function closeMenu() {
    menuOpen.value = false;
}

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
}

function linkClass(item: any) {
    const isActive = route.path === item.url;
    return [
        'rounded-full p-2 font-bold px-4',
        isActive ? 'bg-dark text-light' : 'bg-light text-dark'
    ];
}

function mobileLinkClass(item: any) {
    const isActive = route.path === item.url;
    return [
        'flex py-3 font-bold px-6 items-center gap-1',
        isActive ? 'text-light hover:bg-accent/90' : 'text-dark hover:bg-accent/90'
    ];
}

watch(route, () => {
    closeMenu();
});

const onClickOutside = (handler: any, exclude: any) => {
    const onClick = (e: any) => {
        if (!el) return;
        if (el.value.contains(e.target) || (exclude && exclude.contains(e.target))) {
            return;
        }
        handler();
    };
    onMounted(() => document.addEventListener('click', onClick));
    onUnmounted(() => document.removeEventListener('click', onClick));
    return onClick;
};

const el = ref(null);
const directive = {
    mounted(el: any, binding: any) {
        el._vueClickOutside_ = onClickOutside(binding.value.handler, binding.value.exclude);
    },
    unmounted(el: any) {
        document.removeEventListener('click', el._vueClickOutside_);
    },
};
</script>

<style>
/* Add CSS for the collapse transition */
.collapse-enter-active,
.collapse-leave-active {
    transition: opacity 0.5s;
}

.collapse-enter-from,
.collapse-leave-to {
    opacity: 0;
}
</style>