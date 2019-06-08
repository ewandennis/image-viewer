import React from "react";
import useImageService from "./useImageService";
import { webSocketEndpoint } from "./config";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

const Loading = () => <strong>Hold please...</strong>;

// color range PNG
const testImage =
  "iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAADl0lEQVR4nO3ZMYrDQBREwR7j+19Zip0JHLxAVWy0IHDyaJh/tmu7zu/ftvPon/Otb33757efAanvTv0T4N1ECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiN0HtAVfIctU0QAAAABJRU5ErkJggg==";

export default function ImageGrid() {
  const { images, uploadImage } = useImageService(webSocketEndpoint);
  const onUploadClick = React.useCallback(() => uploadImage("testaroo.png", testImage), [uploadImage]);
  return images === null ? (
    <Loading />
  ) : (
    <>
      <Container maxWidth="xs">
        <Button variant="contained" color="primary" onClick={onUploadClick}>
          Upload image
        </Button>
      </Container>
      <Container maxWidth="xs">
        <GridList cols={4}>
          {images.map((img, idx) => (
            <GridListTile key={idx}>
              <img src={`data:image/png;base64,${testImage}`} />
            </GridListTile>
          ))}
        </GridList>
      </Container>
    </>
  );
}
