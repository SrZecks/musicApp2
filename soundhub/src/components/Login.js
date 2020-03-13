import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import Logo from '../img/black_logo.png';
import Passwordreset from './Passwordreset'
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            check: "false",
        }
    }

    componentDidMount() {
        M.AutoInit(); // Init materialize
        // gapi.auth2.authorize({
        //     client_id: '558477949158-a9g4lrb4s4jhan64vfcdhji8nhfr0u89.apps.googleusercontent.com',
        //     scope: 'email profile openid',
        //     response_type: 'id_token permission'
        // }, function (response) {
        //     if (response.error) {
        //         // An error happened!
        //         return;
        //     }
        //     // The user authorized the application for the scopes requested.
        //     var accessToken = response.access_token;
        //     var idToken = response.id_token;
        //     // You can also now use gapi.client to perform authenticated requests.
        // });
    }

    handleChange = (e) => {
        let { id, value } = e.target;
        if (id === "check") value = value === "false" ? "true" : "false"
        this.setState({ [id]: value })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        axios.get('/users/signIn', { params: this.state })
            .then(res => {
                console.log(res)
                alert("User logged in")
            })
            .catch(err => {
                console.log(err)
                if (String(err).indexOf("403") > -1) alert("User or password wrong");
                else if (String(err).indexOf("404") > -1) alert("User not found");

            });

    }

    googleAuth = (e) => {
        console.log(window.gapi)
    }

    render() {
        return (
            <div className='loginGrid'>
                {/** Form login area **/}
                <div className='loginForm'>
                    <img src={Logo} alt="logo"></img>

                    <form onSubmit={this.handleSubmit}>
                        <div className="input-field">
                            <input required id="email" type="text" className="validate" value={this.state.email} onChange={this.handleChange} />
                            <label htmlFor="email">Email or UserName</label>
                        </div>

                        <div className="input-field">
                            <input required id="password" type="password" className="validate" value={this.state.password} onChange={this.handleChange} />
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="optDiv">
                            <div>
                                <label>
                                    <input id="check" type="checkbox" value={this.state.check} onChange={this.handleChange} />
                                    <span>Save User</span>
                                </label>
                            </div>

                            <div style={{ fontSize: 12 }}>
                                {/**<Link to="/passwordReset">Forgot Password?</Link> */}
                                <a className="modal-trigger" href="#modal1">Forgot password?</a>
                            </div>
                        </div>

                        <div className="btnLogin">
                            <button className="waves-effect waves-light" type="submit" >
                                Sign In
                            </button>
                        </div>

                        <div className="or"><span>sign up <Link to="/signUp">here</Link>, or sign in with:</span></div>
                        <div className="icons">
                            <FontAwesomeIcon className="deep-orange-text text-accent-3 g-signin2" icon={['fab', 'google-plus']} onClick={this.googleAuth} />
                            <FontAwesomeIcon className="blue-text text-darken-3" icon={['fab', 'facebook']} />
                            <FontAwesomeIcon className="light-blue-text text-lighten-1" icon={['fab', 'twitter']} />
                        </div>
                    </form>
                </div>

                <Passwordreset id="modal1" />
            </div>
        )
    }
}
