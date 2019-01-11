/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { Help } from './components/Help';
import { About } from './components/About';

class App extends Component<{}, {}> {

  public render(): JSX.Element {
    return (
      <Router>
        <React.Fragment>
          <Header></Header>
          <Route exact path='/' component={Main} />
          <Route path='/help' component={Help} />
          <Route path='/about' component={About} />
        </React.Fragment >
      </Router>
    );
  }
}

export default App;
