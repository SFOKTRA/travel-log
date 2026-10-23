<script setup lang="ts">
import AuthButton from "./auth-button.vue";
</script>
<template>
  <div class="navbar bg-primary">
    <div class="navbar-start">
      <NuxtLink
        to="/"
        class="btn bg-primary btn-ghost border border-primary text-lg"
        >Travel Log</NuxtLink
      >
    </div>
    <div class="navbar-end">
      <ThemeToggle class="mr-4" />
      <AuthButton />
    </div>
  </div>
</template>
