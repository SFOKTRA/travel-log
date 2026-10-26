<script setup lang="ts">
const authStore = useAuthStore();
onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div
    class="card bg-base-300 container mx-auto mt-4 min-h-72 text-center flex flex-col gap-4 justify-center items-center"
  >
    <span class="loading loading-spinner loading-xl"/>
  </div>
</template>
