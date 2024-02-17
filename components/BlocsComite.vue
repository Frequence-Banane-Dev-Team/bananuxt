<template>
    <Card>
        <CardHeader>
            <CardTitle v-if="title">
                {{ title }}
            </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div v-for="(member, index) in comite" :key="index" class="flex items-center justify-between space-x-4">
            
                <div class="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage :src="member.avatar?.url" />
                        <AvatarFallback>
                            {{ member.name?.split(' ').map((n) => n[0]).join('') }}
                        </AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col gap-0">
                        <p class="text-sm font-medium leading-none">
                            {{ member.name }}
                        </p>
                        <NuxtLink class="!text-sm !text-yellow-400 !leading-7 !font-normal !no-underline hover:!underline transition !pb-0" :to="member.mail ? `mailto:${member.mail}` : null">
                            {{ member.role }}
                        </NuxtLink>
                        <p class="text-sm text-muted-foreground !-mt-0.5">
                            {{ member.description }}
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup>


defineProps({
    comite: {
        type: Array,
        required: true
    },
    title: {
        type: String
    }
})
</script>