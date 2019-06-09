import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ImageGrid from './ImageGrid';

const useStyles = makeStyles(theme => ({
  toolbarIcon: {
    marginRight: theme.spacing(2)
  },
  main: {
    paddingTop: theme.spacing(6)
  }
}));

function App() {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.toolbarIcon} />
          <Typography variant="h4">Image Viewer</Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <ImageGrid />
      </main>
    </>
  );
}

export default App;
