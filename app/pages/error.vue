<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "An unknown error occurred";
</script>

<template>
  <div
    class="card bg-base-300 container mx-auto mt-4 min-h-72 text-center flex flex-col gap-4 justify-center items-center"
  >
    <div role="alert" class="alert alert-error min-w-1/2 text-center">
      <span>Oh no! {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Home
      <Icon name="tabler:circle-arrow-left" size="22"></Icon>
    </NuxtLink>
  </div>
</template>
