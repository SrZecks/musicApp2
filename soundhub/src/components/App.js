import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import M from 'materialize-css';
import Swal from 'sweetalert2'
import 'materialize-css/dist/css/materialize.min.css';
import '../css/App.css';
import '../css/animate.css'
import '../scss/app.scss'

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
