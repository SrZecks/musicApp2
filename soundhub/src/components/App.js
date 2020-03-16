import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import M from 'materialize-css';
import axios from 'axios';
import 'materialize-css/dist/css/materialize.min.css';
import '../css/App.css';

library.add(fab, fas);

export default class App extends Component {

  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }

  render() {
    return (
      <div>
        ui ui é o udy
      </div>
    )
  }
}
