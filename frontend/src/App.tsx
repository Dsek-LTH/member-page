import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';

import GraphQLProvider from './providers/GraphQLProvider';
import LoginProvider from './providers/LoginProvider';
import ThemeProvider from './providers/ThemeProvider';

import Body from './components/Body';
import Header from './components/Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100%',
    }
  })
)

const App = () => {
  const classes = useStyles();
  return (
    <LoginProvider>
      <GraphQLProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Box className={classes.base}>
              <Header/>
              <Switch>
                <Route exact path="/">
                </Route>
              </Switch>
              <Body/>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </GraphQLProvider>
    </LoginProvider>
  );
}

export default App;
