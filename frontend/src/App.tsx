import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import {AppBar, Toolbar, Typography, } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './App.css';

import GraphQL from './components/GraphQL';
import Body from './components/Body';
import Login from './components/Login';

import { KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);


const App = () => {
  const classes = useStyles();
  return (
    <KeycloakProvider keycloak={keycloak}>
      <GraphQL>
        <BrowserRouter>
          <div className="App">
            <AppBar position="static" className={classes.root}>
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  D-sektionens Medlemssida
                </Typography>
                <Login/>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route exact path="/">
              </Route>
            </Switch>
            <Body/>
          </div>
        </BrowserRouter>
      </GraphQL>
    </KeycloakProvider>
  );
}

export default App;
