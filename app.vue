<template>
  <NuxtLayout>
    <NuxtPage />
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

useHead({
  title: "Fréquence Banane"
})

onMounted(() => { isPlaying.value = false })

</script>