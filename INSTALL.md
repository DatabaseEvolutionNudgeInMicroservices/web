# DENIM Web

## Installation

### Prerequisites

1. NodeJS:

- [Install NodeJS](https://nodejs.org/fr/download).

2. Docker:

- Linux : [Install Docker Engine](https://docs.docker.com/engine/install/) or [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/linux/).
- Windows : [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).
- MacOS : [Install Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/).

### Launching

You have the tree following options.

#### Launching from Docker Hub (preferred)

- TODO: link to Docker Hub
- TODO: environment variable description

#### Launching from source code

- Open the project in an IDE and install the dependencies. [VSCode](https://code.visualstudio.com/) is recommended. Recommended extensions are described in `/.vscode`.

  ```shell
  npm install
  ```

- Create an `.env` file with the following content and adapt the host address if necessary.

  ```shell
  # Windows
  VITE_DOWNLOAD_MICROSERVICE=http://localhost:8081
  VITE_REVERSE_ENGINEERING_MICROSERVICE=http://localhost:8082
  VITE_VISUALIZATION_MICROSERVICE=http://localhost:8083
  VITE_EVOLUTION_MICROSERVICE=http://localhost:8084
  ```

⚠️ All environment variables must be prefixed by `VITE`.

- Build the application.

  ```sh
  npm run build
  ```

- Launch the application.
  ```sh
  npm run start
  ```
  The app runs at [http://localhost:4173/](http://localhost:4173/).

#### Launching from source code with Docker

- Open the project in an IDE and install the dependencies.

  ```shell
  npm install
  ```

- Build the application.
  ```sh
  npm run build
  ```

The project contains a `Dockerfile` at its root in order to create an image of the application.

A `docker-compose.yml` file also exists at the root in order to launch easily a container for the application.

- Build the image and launch the container.

  ```bash
  docker-compose up // TODO: environment variable in the command line
  ```

⚠️ This command must be executed at the location of the `docker-compose.yml` file and have to be run as with the
right privileges (administrator).
