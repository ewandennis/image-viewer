import React, { useState, useCallback } from "react";
import { DropzoneArea } from "material-ui-dropzone";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

import useImageService from "./useImageService";
import { webSocketEndpoint, maxFileSizeBytes } from "./config";
import readFile from './readFile';

const Loading = () => (
  <div>
    <CircularProgress />
  </div>
);

function FileUpload({ onUploadFile }) {
  const handleChange = React.useCallback(fileList => {
    if (fileList && fileList.length > 0) {
      onUploadFile(fileList[0]);
    }
  }, [onUploadFile]);

  return (
    <DropzoneArea
      acceptedFiles={["image/*"]}
      filesLimit={1}
      maxFileSize={maxFileSizeBytes}
      showAlerts={false}
      showPreviews={false}
      showPreviewsInDropzone={false}
      onChange={handleChange}
    />
  );
}

export default function ImageGrid() {
  const { images, uploadImage } = useImageService(webSocketEndpoint);
  const [uploading, setUploading] = useState(false);
  const handleUpload = useCallback((file) => {
    setUploading(true);
    readFile(file)
    .then(({ name, content }) => {
      uploadImage(name, btoa(content));
      setUploading(false);
    })
    .catch((err) => {
      // TODO error UI
      console.error(err);
      setUploading(false);
    });
  }, [setUploading, uploadImage]);

  return images === null ? (
    <Loading />
  ) : (
    <>
      <Container maxWidth="xs">{uploading ? <Loading /> : <FileUpload onUploadFile={handleUpload} />}</Container>
      <Container maxWidth="xs">
        <GridList cols={4}>
          {images.map((img, idx) => (
            <GridListTile key={idx}>
              <img src={`data:image/png;base64,${img.image}`} alt={img.filename} />
            </GridListTile>
          ))}
        </GridList>
      </Container>
    </>
  );
}
