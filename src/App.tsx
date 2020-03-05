import React from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import logo from './logo.svg';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className="Header">
            D-sektionens Medlemssida
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
