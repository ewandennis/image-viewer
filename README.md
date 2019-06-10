## Shared Image Viewer

This small app presents a simple web UI for viewing and uploading images, with the following properties:

 - The image store is held by a web service
 - Browser-based clients connect to the service by web socket
 - Clients may upload new images which are then propagated to all other clients

## Prerequisites

 - A UNIX-style shell (WMMV on other platforms)
 - Node.js v10+ (v10.3.0 tested)
 - NPM v6 (v6.1.0 tested)
 - Optional: Docker (v18.09.2 used)

## Running Locally (Development)

1. Install deps and start the service:
    ```sh
    cd api
    npm install
    npm start
    ```

1. Install deps and start the UI dev server:
    ```sh
    cd ui
    npm install
    npm start
    ```

## Running With Docker (Production Build)

1. Clone the repo:
    ```sh
    git clone https://github.com/ewandennis/image-viewer.git
    cd image-viewer
    ```

1. Build the docker image:
    ```sh
    npm run build
    ```

1. Start the app:
    ```sh
    npm start
    ```

The app is now running on [http://localhost:3000/](http://localhost:3000/).

## Running Tests

Run `npm test` in `image-viewer`, `image-viewer/ui` or `image-viewer/api`.

### Issues / To Do
 - UI upload error reporting
 - User identification / authentication
 - User automation / functional testing
 - Share protocol string definitions between client and service
