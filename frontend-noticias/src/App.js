import { Container, Typography } from '@material-ui/core';
import React from 'react';
import FrmNoticias from './components/noticias/FrmNoticias';
import BuscarNoticias from './components/noticias/buscar-noticias/BuscarNoticias';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" align="center">
            Desafio
            </Typography>
          <Router>
            <Switch>
              <Route exact  path="/">
                <BuscarNoticias />
              </Route>
              <Route exact  path="/noticia">
                <BuscarNoticias />
              </Route>
              <Route exact path="/noticia/form">
                <FrmNoticias />
              </Route>
              <Route exact path="/noticia/form/:id_noticia">
                <FrmNoticias />
              </Route>
            </Switch>
          </Router>
        </Container>
      </header>
    </div>
  );
}

export default App;
