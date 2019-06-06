import React from 'react';
import useImageService from './useImageService';
import { webSocketEndpoint } from './config';

const Loading = () => <strong>Hold please...</strong>;

function App() {
  const { images, uploadImage } = useImageService(webSocketEndpoint);
  const onUploadClick = React.useCallback(() => uploadImage('bingo.jpg'), [uploadImage]);
  return images === null ? (
    <Loading />
  ) : (
    <>
      <ul>
        {images.map((img, idx) => (
          <li key={idx}>{img}</li>
        ))}
      </ul>
      <button onClick={onUploadClick}>Upload image</button>
    </>
  );
}

export default App;
