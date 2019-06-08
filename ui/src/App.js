import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ImageGrid from './ImageGrid';


function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon />
          <Typography variant="h4">Image Viewer</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <ImageGrid />
      </main>
    </>
  );
}

export default App;
