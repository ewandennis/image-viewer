import React, { useState, useCallback } from "react";

import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Loading from "./Loading";
import FileUpload from "./FileUpload";
import useImageService from "./useImageService";
import socketIoClient from 'socket.io-client';
import { webSocketEndpoint } from "./config";
import readFile from "./readFile";

const extractFileExtension = (filename) => filename.split('.').pop();

export default function ImageGrid() {
  const [ client, _ ] = useState(socketIoClient(webSocketEndpoint)); // eslint-disable-line no-unused-vars
  const { images, uploadImage } = useImageService(client);
  const [uploading, setUploading] = useState(false);
  const handleUpload = useCallback(
    file => {
      setUploading(true);
      return readFile(file)
        .then(({ name, content }) => {
          uploadImage({ filename: name , image: btoa(content) });
          setUploading(false);
        })
        .catch(err => {
          // TODO error UI
          console.error(err);
          setUploading(false);
        });
    },
    [setUploading, uploadImage]
  );

  if (images === null) {
    return <Loading />;
  }

  return (
    <Grid container justify="center" spacing={5}>
      <Grid item xs={8}>
        {uploading ? <Loading /> : <FileUpload onUploadFile={handleUpload} />}
      </Grid>
      <Grid item xs={12}>
        <GridList cols={4} spacing={10}>
          {images.map(img => (
            <GridListTile key={img.filename}>
              <img src={`data:image/${extractFileExtension(img.filename)};base64,${img.image}`} alt={img.filename} />
            </GridListTile>
          ))}
        </GridList>
      </Grid>
    </Grid>
  );
}
