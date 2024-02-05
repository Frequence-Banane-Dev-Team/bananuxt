<template>
  <NuxtLayout>
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt,
#__layout {
  margin: 0;
  padding: 0;
  width: 100% !important;
  min-height: 100% !important;
  font-family: 'Inter', sans-serif;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSongStore } from './stores/song'
import { storeToRefs } from 'pinia';
const useSong = useSongStore()
const { isPlaying, currentTrack } = storeToRefs(useSong)

import { useRoute } from 'vue-router';

const route = useRoute();

useHead({
  title: "Fréquence Banane"
})

watch(route, () => {
  console.log('Route changed', route)
})

onMounted(() => { 
  
  console.log('App mounted')
  isPlaying.value = false

})

</script>