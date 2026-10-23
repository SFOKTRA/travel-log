<script setup lang="ts">
const authStore = useAuthStore();
</script>
<template>
  <button
    :disabled="authStore.loading"
    class="btn btn-accent"
    @click="authStore.signIn"
  >
    Sign In with Github
    <span
      v-if="authStore.loading"
      class="loading loading-spinner loading-md"
    ></span>
    <Icon v-else name="tabler:brand-github-filled" size="18" />
  </button>
</template>
