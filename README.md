# DENIM Web

[![pipeline status](https://gitlab.unamur.be/denim/web/badges/master/pipeline.svg)](https://gitlab.unamur.be/denim/web/-/commits/master)

## 📣 Description

This application enables to download, reverse engineer, visualize, model, and evolve a microservices architecture from a data perspective.

## ⭐ Features

Here is a summary of the features currently supported.

### Download

// TODO

### Reverse Engineering

// TODO

### Visualization

#### Description

The visualization feature allows to visualise a high-level view of the microservices architecture under the data perspective. It proposes several visualization describe hereafter.

- Treemap: This visualization represents a microservices architecture under the form of an interactive treemap. It highlights the repositories, directories, and files where an API or data access is identified. The visualization is further enriched with interactive features, enabling developers to explore various levels of detail within the microservices architecture and its associated data accesses. For instance, the interactive treemap displays additional information on hover. It also supports what-if analyses, helping developers assess the impact of changes such as data concept modifications or technology switches. It also offers insights into the distribution or concentration of technologies, operations, code fragments, or data concepts. In that sense, it highlights the heterogeneity of technologies, either at macro (i.e., codebase-level) and micro perspectives (i.e., file-level). Furthermore, the treemap assists in evaluating the size of codebase components and identifying whether certain portions are data-related or not. In terms of quality assessment, it contributes to localizing potentially isolated and/or highly nested code fragments, important to consider in the case of an eventual refactoring phase. Finally, it is enriched with extra interactive features like the jump to a data access code fragment directly in the GitHub repository, the zooming in the treemap, etc.

#### Implementation status

| Feature | Implementation status |
| ------- | --------------------- |
| Treemap | 🌕                    |

#### How to?

##### Treemap

**INPUT**

The user is supposed to upload on the [Treemap](http://localhost:4173/Treemap) page a static analyzer report (see [DENIM Reverse Engineering](https://gitlab.unamur.be/denim/reverse-engineering/-/blob/master/README.md)).

**OUTPUT**

The tools is able to generate this kind of visualization.

![Visualization of the Overleaf's November 4th, 2024 version](/src/assets/example.png)
[See in PDF](/src/assets/example.pdf)

Then, the user can interact with that visualization.

### Evolution

// TODO

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

- Build the application. WARNING! This step is important!

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
