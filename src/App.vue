<script setup>
// Helpers

import { RouterLink, RouterView } from 'vue-router'
import { APP_NAME, TREEMAP } from '@/helpers/Text.helper'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">{{ APP_NAME }}</RouterLink>
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
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link active" to="/Treemap">{{ TREEMAP }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main class="container-fluid">
    <RouterView />
  </main>
</template>

<style scoped></style>
