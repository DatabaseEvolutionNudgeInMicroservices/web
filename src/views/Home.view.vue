<script>
// Libraries
import { RouterLink } from 'vue-router'

// Helpers
import {
  ANIMATED_HEAT_TREEMAP,
  APP_NAME,
  COMPARISON_TREEMAP,
  DIFFERENCE_TREEMAP,
  DOWNLOAD,
  DOWNLOADING,
  DYNAMIC_ANALYSIS,
  EVOLUTIONARY_TREEMAP,
  EVOLVING,
  GET_STARTED,
  GET_STARTED_TEXT,
  REVERSE_ENGINEERING,
  SLOGAN,
  STATIC_ANALYSIS,
  TIMELINE,
  TREEMAP,
  VISUALIZING
} from '@/helpers/Text.helper'

export default {
  methods: {
    scrollToDownloading() {
      const el = document.getElementById('downloading')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  components: {
    RouterLink
  },
  data() {
    return {
      // Texts.
      APP_NAME,
      SLOGAN,
      GET_STARTED,
      GET_STARTED_TEXT,
      DOWNLOADING,
      DOWNLOAD,
      REVERSE_ENGINEERING,
      STATIC_ANALYSIS,
      DYNAMIC_ANALYSIS,
      VISUALIZING,
      TREEMAP,
      ANIMATED_HEAT_TREEMAP,
      TIMELINE,
      EVOLVING,
      EVOLUTIONARY_TREEMAP,
      DIFFERENCE_TREEMAP,
      COMPARISON_TREEMAP
    }
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-layout">
        <!-- Left -->
        <div class="hero-left">
          <div class="container">
            <!--<img src="/src/assets/img/icon.png" class="icon-home" />-->
            <h1 class="display-4 fw-bold">{{ APP_NAME }}</h1>
            <p class="lead" v-html="SLOGAN"></p>
          </div>
        </div>

        <!-- Right -->
        <div class="hero-right">
          <div class="hero-grid">
            <div class="tile img1"></div>
            <div class="tile img2"></div>
            <div class="tile img3"></div>
            <div class="tile img4"></div>
            <div class="tile img5"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Getting Started -->
    <section class="getting-started text-center">
      <div class="container">
        <h2 class="fw-semibold">{{ GET_STARTED }}</h2>
        <p class="text-muted">
          {{ GET_STARTED_TEXT }}
        </p>
        <div class="mt-3">
          <span class="large-button top" @click="scrollToDownloading">↓</span>
        </div>
      </div>
    </section>

    <!-- Downloading -->
    <section class="py-5 text-center">
      <div class="container">
        <h3 class="mb-4" id="downloading">{{ DOWNLOADING }}</h3>
        <div class="d-flex flex-wrap gap-4 justify-content-center">
          <RouterLink to="/Downloading" class="tool-card">
            <div class="icon">⬇</div>
            <div>{{ DOWNLOAD }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Reverse Engineering -->
    <section class="py-5 text-center">
      <div class="container">
        <h3 class="mb-4">{{ REVERSE_ENGINEERING }}</h3>
        <div class="d-flex flex-wrap gap-4 justify-content-center">
          <RouterLink to="/ReverseEngineering" class="tool-card">
            <div class="icon">🔬</div>
            <div>{{ STATIC_ANALYSIS }}</div>
          </RouterLink>

          <RouterLink to="#" class="tool-card">
            <div class="icon">⚡</div>
            <div>{{ DYNAMIC_ANALYSIS }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Visualizing -->
    <section class="py-5 text-center">
      <div class="container">
        <h3 class="mb-4">{{ VISUALIZING }}</h3>
        <div class="d-flex flex-wrap gap-4 justify-content-center">
          <RouterLink to="/Treemap" class="tool-card">
            <div class="icon">🌳</div>
            <div>{{ TREEMAP }}</div>
          </RouterLink>

          <RouterLink to="/Timeline" class="tool-card">
            <div class="icon">⏱</div>
            <div>{{ TIMELINE }}</div>
          </RouterLink>

          <RouterLink to="/AnimatedHeatTreemap" class="tool-card">
            <div class="icon">🔥</div>
            <div>{{ ANIMATED_HEAT_TREEMAP }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Evolving -->
    <section class="py-5 text-center">
      <div class="container">
        <h3 class="mb-4">{{ EVOLVING }}</h3>
        <div class="d-flex flex-wrap gap-4 justify-content-center">
          <RouterLink to="/EvolutionaryTreemap" class="tool-card">
            <div class="icon">🧬</div>
            <div>{{ EVOLUTIONARY_TREEMAP }}</div>
          </RouterLink>

          <RouterLink to="/DifferenceTreemap" class="tool-card">
            <div class="icon">➖/➕</div>
            <div>{{ DIFFERENCE_TREEMAP }}</div>
          </RouterLink>

          <RouterLink to="/ComparisonTreemap" class="tool-card">
            <div class="icon">⚖</div>
            <div>{{ COMPARISON_TREEMAP }}</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="line"></div>

      <div class="container footer-grid">
        <div class="footer-col">
          <div class="fw-bold">{{ APP_NAME }}</div>
          <div class="footer-slogan"><p v-html="SLOGAN"></p></div>
        </div>

        <div class="footer-col">
          <div class="footer-title">Partners</div>
          <div class="partner-icons">
            <a href="https://www.unamur.be/en" target="_blank"
              ><img src="/src/assets/img/unamur.png" alt="Université de Namur"
            /></a>
            <a href="https://www.uclouvain.be/en" target="_blank">
              <img src="/src/assets/img/uclouvain.png" alt="Université Catholique de Louvain" />
            </a>
            <a href="https://www.usi.ch/en" target="_blank">
              <img src="/src/assets/img/usi.png" alt="Università della Svizzera italiana" />
            </a>
            <a href="https://www.federation-wallonie-bruxelles.be/" target="_blank"
              ><img src="/src/assets/img/fwb.jpg" alt="Fédération Wallonie-Bruxelles"
            /></a>
            <a href="https://sofinaboel.be/" target="_blank"
              ><img src="/src/assets/img/sofinaboel.png" alt="SofinaBoel"
            /></a>
          </div>
        </div>

        <div class="footer-col">
          <div class="footer-title">Resources</div>

          <div class="footer-links">
            <a href="https://doi.org/10.5281/zenodo.16414747" target="_blank" rel="noopener">
              <i class="bi bi-archive"></i> DOI
            </a>
            <a
              href="https://github.com/DatabaseEvolutionNudgeInMicroservices/denim"
              target="_blank"
              rel="noopener"
            >
              <i class="bi bi-github"></i> GitHub
            </a>
            <a href="https://hub.docker.com/u/denimraindrop" target="_blank" rel="noopener">
              <i class="bi bi-boxes"></i> Docker
            </a>
            <a
              href="https://github.com/DatabaseEvolutionNudgeInMicroservices/denim#references"
              target="_blank"
              rel="noopener"
            >
              <i class="bi bi-chat-right-quote"></i> Cite
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        &copy; {{ new Date().getFullYear() }} {{ APP_NAME }}. All rights reserved. Released under
        the
        <a
          href="https://github.com/DatabaseEvolutionNudgeInMicroservices/denim?tab=MIT-1-ov-file#readme"
          target="_blank"
          >MIT License</a
        >.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Hero */

.hero {
  width: 100%;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  min-height: 50vh;
}

.hero-left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px;
  background: #ffffff;
}

.hero-left .container {
  max-width: 500px;
}

.hero-right {
  display: flex;
  position: relative;
}

.hero-right::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.hero-grid {
  display: grid;
  width: 100%;
  min-height: 350px;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
}

.icon-home {
  width: 75px;
}

.tile {
  background-size: cover;
  background-position: center;
}

.img1 {
  grid-row: span 2;
  background-image: url('/src/assets/img/visualization-1.jpg');
}

.img2 {
  background-image: url('/src/assets/img/visualization-2.jpg');
}

.img3 {
  background-image: url('/src/assets/img/visualization-3.jpg');
}

.img4 {
  background-image: url('/src/assets/img/visualization-4.jpg');
}

.img5 {
  background-image: url('/src/assets/img/visualization-5.jpg');
}

@media (max-width: 700px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }

  .hero-left {
    padding: 25px 25px;
    text-align: center;
  }

  .hero-grid {
    min-height: 250px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .img1 {
    grid-column: span 2;
    grid-row: span 1;
  }
}

/* Getting Started */

.getting-started {
  padding: 50px 0;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

/* Tool Cards */

.tool-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #000;
  transition: all 0.15s ease-in-out;
}

.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 50pt;
}

/* Footer */

.footer {
  width: 100%;
  margin: 0;
  padding: 0;
  background: #ffffff;
  color: #000000;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 50px 0;
}

.footer-col {
  min-width: 0;
  padding: 0 25px;
  border-right: 1px solid #ddd;
  text-align: center;
}

.footer-col:last-child {
  border-right: none;
}

.footer-slogan {
  margin: 25px;
  color: #000000;
  font-size: 0.9rem;
}

.footer-title {
  margin-bottom: 10px;
  font-weight: 600;
  color: #000000;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a,
.footer a {
  color: #000000;
  font-size: 0.9rem;
  text-decoration: none;
}

.partner-icons {
  text-align: center;
}

.partner-icons img {
  width: 75px;
  padding: 0;
  margin: 25px;
}

.footer-bottom {
  padding: 15px 0;
  text-align: center;
  border-top: 1px solid #dee2e6;
  color: #000000;
  font-size: 0.85rem;
}
</style>
