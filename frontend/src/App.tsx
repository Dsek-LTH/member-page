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

import Home from './routes/Home';
import Header from './components/Header';
import News from './components/News';

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
                  <Home/>
                </Route>

                <Route exact path="/nyheter">
                  <News/>
                </Route>

              </Switch>
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </GraphQLProvider>
    </LoginProvider>
  );
}

export default App;
