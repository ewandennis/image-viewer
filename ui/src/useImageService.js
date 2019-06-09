import { useState, useEffect } from 'react';
import protocol from './protocol';

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
export default function useImageService(client) {
  const [images, setImages] = useState(null);

  const uploadImage = ({ filename, image }) => {
    client.emit(protocol.UPLOAD_IMAGE, { filename, image });
  };

  useEffect(() => {
    const onImageList = imageList => {
      // TODO validate msg
      setImages(imageList);
    };

    const onImageAdded = image => {
      // TODO validate msg
      setImages([...images, image]);
    };

    client.on(protocol.IMAGE_LIST, onImageList);
    client.on(protocol.IMAGE_ADDED, onImageAdded);

    if (images === null) {
      client.emit(protocol.LIST_IMAGES);
    }

    return () => {
      client.removeEventListener(protocol.IMAGE_LIST, onImageList);
      client.removeEventListener(protocol.IMAGE_ADDED, onImageAdded);
    };
  }, [images, setImages, client]);

  return { images, uploadImage };
}
