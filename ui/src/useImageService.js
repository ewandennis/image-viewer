import React from 'react';
import socketIoClient from 'socket.io-client';
import { webSocketEndpoint } from './config';

// TODO move this out of top-level scope
// TODO close connection cleanly on app unmount?
const client = socketIoClient(webSocketEndpoint);

/*
 * Provide access to an shared image list.
 * 
 * API service maintains the source of truth.
 * This client uses a websocket to keep a local copy in sync.
 * 
 * @typedef {Object<string, any>} ImageService
 * @property {string} images The current image list
 * @property {function} uploadImage A way to upload new images
 * @param {string} endpoint API service websocket endpoint
 * @returns {ImageService}
 */
export default function useImageService(endpoint) {
  const [images, setImages] = React.useState(null);

  const uploadImage = (filename, image) => {
    client.emit('uploadImage', { filename, image });
  };

  React.useEffect(() => {
    const onImageList = imageList => {
      // TODO validate msg
      console.log(imageList);
      setImages(imageList);
    };

    const onImageAdded = image => {
      // TODO validate msg
      setImages([...images, image]);
    };

    client.on('imageList', onImageList);
    client.on('imageAdded', onImageAdded);

    if (images === null) {
      client.emit('listImages');
    }

    return () => {
      client.removeEventListener('imageList', onImageList);
      client.removeEventListener('imageAdded', onImageAdded);
    };
  }, [images]);

  return { images, uploadImage };
}