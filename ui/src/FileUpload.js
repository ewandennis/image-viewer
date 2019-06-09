import React, { useCallback } from 'react';
import { DropzoneArea } from "material-ui-dropzone";
import { maxFileSizeBytes } from "./config";

export default function FileUpload({ onUploadFile }) {
  const handleChange = useCallback(
    fileList => {
      if (fileList && fileList.length > 0) {
        onUploadFile(fileList[0]);
      }
    },
    [onUploadFile]
  );

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
