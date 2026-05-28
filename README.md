# DENIM Web

[![pipeline status](https://gitlab.unamur.be/denim/web/badges/master/pipeline.svg)](https://gitlab.unamur.be/denim/web/-/commits/master)

## 📣 Description

This application enables to download, reverse engineer, visualize, and analyze the evolution of a microservices architecture from a data perspective.

## ⭐ Features

Here is a summary of the features currently supported.

### Downloading

#### Description

The downloading feature allows to download the entire codebase of a microservices architecture from GitLab or GitHub, even if it is spread across multiple repositories.

#### Implementation status

| Feature         | Implementation status |
|-----------------| --------------------- |
| Download GitHub | 🌕                    |
| Download GitLab | 🌕                    |

#### How to?

##### Downloading

See [Reverse Engineering Dynamic](https://github.com/DatabaseEvolutionNudgeInMicroservices/downloading).

**INPUT**

The user is supposed to enter, on the [Downloading](http://localhost:4173/Downloading) page, the list of repositories to download, while respecting the following format: `https://(github|gitlab).com/<user>/<repository>/tree/<hash>`.

**OUTPUT**

The result of the downloading is a ZIP file containing the entire codebase. The ZIP file can be analyzed by the [Reverse Engineering](#reverse-engineering) features.

### Reverse Engineering

#### Description

The reverse engineering feature allows to analyze, statically or dynamically, the entire codebase of a microservices architecture from a data perspective.

#### Implementation status

| Feature          | Implementation status |
|------------------| --------------------- |
| Static Analysis  | 🌕                    |
| Dynamic Analysis | 🌕                    |

#### How to?

##### Static Reverse Engineering

See [Reverse Engineering Static](https://github.com/DatabaseEvolutionNudgeInMicroservices/reverse-engineering).

**INPUT**

The user is supposed to upload, on the [Static Reverse Engineering](http://localhost:4173/ReverseEngineering) page, the ZIP file containing the [downloaded codebase](#downloading-1).

**OUTPUT**

The result of the static reverse engineering is a JSON file containing the static analysis report. This static analysis report can be visualized by the [Visualizing](#visualizing) features.

##### Dynamic Reverse Engineering

See [Reverse Engineering Dynamic](https://github.com/DatabaseEvolutionNudgeInMicroservices/reverse-engineering-dynamic).

### Visualizing

#### Description

The visualizing feature allows to visualize a high-level view of the microservices architecture under the data perspective. It proposes several visualization describe hereafter.

- **Treemap**: This visualization represents a microservices architecture under the form of a treemap. It highlights the repositories, directories, and files where an API or data access is identified. The visualization is further enriched with interactive features, enabling developers to explore various levels of detail within the microservices architecture and its associated data accesses. For instance, the interactive treemap displays additional information on hover. It also supports what-if analyses, helping developers assess the impact of changes such as data concept modifications or technology switches. It also offers insights into the distribution or concentration of technologies, operations, code fragments, or data concepts. In that sense, it highlights the heterogeneity of technologies, either at macro (i.e., codebase-level) and micro perspectives (i.e., file-level). Furthermore, the treemap assists in evaluating the size of codebase components and identifying whether certain portions are data-related or not. In terms of quality assessment, it contributes to localizing potentially isolated and/or highly nested code fragments, important to consider in the case of an eventual refactoring phase. Finally, it is enriched with extra interactive features like the jump to a data access code fragment directly in the GitHub repository, the zooming in the treemap, etc.
- **Timeline**: This visualization represents a microservices architecture usage under the form of a timeline. It represents the temporal call sequence and code fragment usage over time. The visualization is further enriched with interactive features, enabling developers to inspect various temporal phenomena in the microservices architecture and its associated data accesses. For instance, it allows to replay the call sequence, pause, fast-forward, zoom-in, zoom-out.  Finally, it is enriched with extra interactive features like the jump to a data access code fragment directly in the GitHub repository.
- **Animated Heat Treemap**: This visualization represents a microservices architecture usage under the form of an animated heat treemap. It extends the treemap with lines and heat colorization according to the temporal call sequence and code fragments usage over time. The visualization is further enriched with interactive features, enabling developers to inspect various temporal phenomena in the microservices architecture and its associated data accesses. For example, it allows to replay the call sequence, pause, and fast-forward.

#### Implementation status

| Feature                 | Implementation status |
|-------------------------| --------------------- |
| Treemap                 | 🌕                    |
| Timeline                | 🌕                    |
| Animated Heat Treemap   | 🌕                    |

#### How to?

See [Visualizing](https://github.com/DatabaseEvolutionNudgeInMicroservices/visualizing).

##### Treemap

**INPUT**

The user is supposed to upload on the [Treemap](http://localhost:4173/Treemap) page a [static analysis report](#static-reverse-engineering).

**OUTPUT**

![Treemap of the Overleaf's August 5th, 2021 AM version](/evaluation/treemap/Treemap%20Overleaf%20August%205th%202021%20AM.svg)

![Filtered Treemap of the Overleaf's May 8th, 2026 version](/evaluation/treemap/Filtered%20Treemap%20Analysis%20Report%20Overleaf%20May%208th%202026.svg)

##### Timeline

**INPUT**

The user is supposed to upload on the [Animated Heat Treemap](http://localhost:4173/AnimatedHeatTreemap) page a [dynamic analysis report](#dynamic-reverse-engineering).

**OUTPUT**

![Animated Heat Treemap of the Overleaf's March 18th, 2025 version](/evaluation/animated-heat-treemap/Animated%20Heat%20Treemap%20Overleaf%20March%2018th%202025.svg)

##### Timeline

**INPUT**

The user is supposed to upload on the [Timeline](http://localhost:4173/Timeline) page a [dynamic analysis report](#dynamic-reverse-engineering).

**OUTPUT**

![Timeline of the Overleaf's March 18th, 2025 version](/evaluation/timeline/Timeline%20Overleaf%20March%2018th%202025.svg)

### Evolving

#### Description

The evolving feature allows to analyze the versions of a microservices architecture under the data perspective. It proposes several visualizations and metrics describe hereafter.

- **Comparison Treemap**: This visualization expands on the treemap by offering a mirrored view of the versions or interval of versions, and especially highlighting the intra-version and inter-version code fragment similarity coupling perspective.
- **Difference Treemap**: This visualization expands on the comparison treemap by offering a mirrored view of the versions or interval of versions, and especially highlighting the inter-version evolutionary difference coupling perspective of code fragments, files, directories and repositories.
- **Evolutionary Treemap**: This visualization expands on the treemap by offering a unified view of the versions history, and especially highlighting the extra-version evolutionary coupling perspective.

#### Implementation status

| Feature              | Implementation status |
|----------------------| --------------------- |
| Comparison Treemap   | 🌕                    |
| Difference Treemap   | 🌕                    |
| Evolutionary Treemap | 🌕                    |

#### How to?

See [Evolving](https://github.com/DatabaseEvolutionNudgeInMicroservices/evolving).

##### Comparison Treemap

**INPUT**

The user is supposed to upload on the [Comparison Treemap](http://localhost:4173/ComparisonTreemap) page [static analysis reports](#static-reverse-engineering).

**OUTPUT**

![Comparison Treemap of the Overleaf's August 5th 2021 AM and May 8th 2026 versions](/evaluation/comparison-treemap/0-13%20Comparison%20Treemap%20Overleaf%20August%205th%202021%20AM%20vs%20May%208th%202026.svg)

##### Difference Treemap

**INPUT**

The user is supposed to upload on the [Difference Treemap](http://localhost:4173/DifferenceTreemap) page a [static analysis reports](#static-reverse-engineering).

**OUTPUT**

![Difference Treemap of the Overleaf's August 5th 2021 PM and May 8th 2026 versions](/evaluation/difference-treemap/1-13%20Difference%20Treemap%20Overleaf%20August%205th%202021%20PM%20vs%20May%208th%202026.svg)

##### Evolutionary Treemap

**INPUT**

The user is supposed to upload on the [Evolutionary Treemap](http://localhost:4173/EvolutionaryTreemap) page a [static analysis reports](#static-reverse-engineering).

**OUTPUT**

![Evolutionary Treemap of the Overleaf's history](/evaluation/evolutionary-treemap/Evolutionary%20Treemap%20Overleaf%20May%208th%202026%20-%20services-history-v1-app-js.svg)

## 👩‍💻 Development details

### Setup

See [INSTALL file](INSTALL.md).

### Test the app (manually)

- Build the application.
  ```sh
  npm run build
  ```
- Launch the application.
  ```sh
  npm run start
  ```
  The app runs at [http://localhost:4173/](http://localhost:4173/).

### Test the app (unit testing)

Unit test suites are set up thanks to the [Vitest](https://www.npmjs.com/package/vitest) framework.

The tests are specified in the `/tests/unit` directory and are named following the `*test.js` pattern.

#### Launching the tests

- Launch unit tests.

  ```bash
  npm run test_unit
  ```

- Launch unit tests in development mode (continuously watching for new tests).

  ```bash
  npm run test_unit_dev
  ```

### Test the app (UI unit testing)

UI unit test suites are set up thanks to the [Cypress](https://www.npmjs.com/package/cypress) framework.

The tests are specified in the `/tests/components` directory and are named following the `*cy.js` pattern.

The configuration of Cypress is stated in the `/cypress.config.js` file. Some support files are stated in the `/cypress` directory.

#### Launching the tests

- Build the application. ⚠️ WARNING! This step is very important to take into account the changes! ⚠️

  ```sh
  npm run build
  ```

- Launch unit tests.

  ```bash
  npm run test_unit_ui
  ```

- Launch UI unit tests in development mode (opening the Cypress tests console).

  ```bash
  npm run test_unit_ui_dev
  ```

### Test the app (UI integration testing)

UI integration test suites are set up thanks to the [Cypress](https://www.npmjs.com/package/cypress) and [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) frameworks.

The tests are specified in the `/tests/e2e` directory and are named following the `*cy.js` pattern.

The configuration of Cypress is stated in the `/cypress.config.json` file.

#### Preparing the environment

- Build the application. WARNING! This step is important!
  ```sh
  npm run build
  ```

#### Launching the tests

- Launch integration tests.

  ```sh
  npm run test_integration_ui
  ```

- Launch UI integration tests in development mode (opening the Cypress tests console).

  ```bash
  npm run test_integration_ui_dev
  ```

### Debug

- Launching the debug mode to get access to developers tools. This mode is preferred when developing as it automatically rebuild and reload the app at any modification. It avoids to rebuild the app at any time.

  ```sh
  npm run start_dev
  ```

  The debugged app runs at [http://localhost:5173/](http://localhost:5173/) and developers tools run at [http://localhost:5173/**devtools**/](http://localhost:5173/__devtools__/).

### Linting

- Lint the application.

  ```sh
  npm run lint
  ```

### Formatting

- Formatting the application.

  ```sh
  npm run format
  ```

### CI/CD

A CI/CD process is set up thanks to GitLab CI/CD.
Learn more about GitLab CI/CD via [this page](https://docs.gitlab.com/ee/ci/).

This one is described in the `.gitlab-ci.yml`.
Warning! Right privileges must be granted to Docker on the session on which the CI is executed.

## 🪛 Technical details

### Technologies

- JavaScript
- Docker

### Libraries

#### Project configuration

- [vue](https://vuejs.org/) is a front-end JavaScript framework.
- [vue-router](https://www.npmjs.com/package/vue-router) is used for the routing.
- [vite](https://www.npmjs.com/package/vite) is used for bundling.
- [axios](https://www.npmjs.com/package/axios) is used for HTTP calls.

#### Tests

- [Vitest](https://www.npmjs.com/package/vitest) is used for unit testing.
- [cypress](https://www.npmjs.com/package/cypress) is used for UI unit and integration testing.
- [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) is used for UI integration testing.

#### Format

- [eslint](https://eslint.org/) is used for linting the code.
- [prettier](https://prettier.io/) is used for formatting the code.

### Tools

- [npm](https://www.npmjs.com/) is the package manager used.
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) is the CI/CD continuous tool used.
- [Docker Desktop](https://docs.docker.com/desktop/windows/install/) is the containerization technology used.
- [VSCode](https://code.visualstudio.com/) is the IDE recommended.

## 🤝 Contributing

If you want to contribute to the project, please consider the following instructions:

- Any contribution must be tested (unit, integration, and UI tests).
- All the tests and the CI/CD pipeline must pass before definitively integrating the contribution.
- Any contribution must be documented, especially by updating the `README.md` and the `INSTALL.md` file.
- Any contribution must be approved via the pull request mechanism.
- More generally, any contribution must follow the conventions and keep the shape of previous contributions.
 