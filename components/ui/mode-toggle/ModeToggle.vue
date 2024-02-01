<script setup lang="ts">
import { MoonIcon, SunIcon } from "@radix-icons/vue"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colorMode = useColorMode()

function setTheme(theme: string) {
    colorMode.preference = theme
}

</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <SunIcon v-if="colorMode.value == 'light'" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon 
                    v-else-if="colorMode.value == 'dark'"
                    className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem @click="()=> setTheme('light')">
                Light
            </DropdownMenuItem>
            <DropdownMenuItem @click="()=> setTheme('dark')">
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem @click="()=> setTheme('system')">
                System
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>