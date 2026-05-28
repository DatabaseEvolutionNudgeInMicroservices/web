<script setup>
// Helpers
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/"
          ><img src="/src/assets/img/icon.png" class="icon-header"
        /></RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav"></ul>
        </div>
      </div>
    </nav>
  </header>
  <main class="container-fluid">
    <RouterView />
  </main>
</template>

<style>
/* Images */

.icon-header {
  width: 30px;
}
</style>
