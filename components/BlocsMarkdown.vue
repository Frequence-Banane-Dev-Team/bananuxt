<template>
    <div class="flex flex-col max-w-screen-xl mx-auto article">
        <ContentRendererMarkdown :value="content" v-if="content" />
    </div>
</template>

<script setup>
defineProps({
    content: {
        type: Object,
        required: true
    }
})
</script>
