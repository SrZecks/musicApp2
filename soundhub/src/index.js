import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './css/index.css';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup.js';
import Passwordreset from './components/Passwordreset';
import Googleuser from './components/Googleuser';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact={true} component={App}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/signUp" component={Signup}></Route>
            <Route path="/Googleuser" component={Googleuser}></Route>
            <Route path="/passwordReset" component={Passwordreset}></Route>
        </Switch>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
