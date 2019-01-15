import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Students } from './components/Students';
import { EditStudent } from './components/EditStudent';

window.ApiUrl="http://localhost:3001";

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Students} />
        <Route exact path='/Edit/:id' component={EditStudent} />
        <Route exact path='/Edit/' component={EditStudent} />
        <Route exact path='/Add/' component={EditStudent} />
      </Layout>
    );
  }
}
