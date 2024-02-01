<template>
  <div id="root" class="flex flex-col m-0 p-0 w-full h-full min-h-screen max-w-screen">
    <AppHeader />
    <div class="flex flex-col grow">
      <slot />
    </div>
    <AppFooter class="mt-auto" />
    <MusicPlayer class="sticky bottom-0 p-0 m-0" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';


</script>
