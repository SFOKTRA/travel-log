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
      <a class="btn btn-accent"
        >Sign In with Github
        <Icon name="tabler:brand-github-filled" size="18" />
      </a>
    </div>
  </div>
</template>
