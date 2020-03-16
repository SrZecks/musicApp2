import React, { Component } from 'react';
import { Link, Route, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import Logo from '../img/black_logo.png';
import Passwordreset from './Passwordreset'
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import gapi from './Gapi'
import Googleuser from './Googleuser';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gapiReady: false,
            email: "",
            password: "",
            check: "false",
            googleAuth: {},
            googleUser: {}
        }
    }

    componentDidMount() {
        M.AutoInit(); // Init materialize

    }

    componentWillMount() {
        gapi.loadGapi()
            .then(async (res) => {
                this.setState({ gapiReady: res })
                var auth2 = await gapi.init()
                this.setState({ googleAuth: auth2 })
                this.setState({ googleUser: auth2.currentUser.get().getBasicProfile() });

            }).catch(err => {
                console.log(err)
            })
    }

    handleChange = (e) => {
        let { id, value } = e.target;
        if (id === "check") value = value === "false" ? "true" : "false"
        this.setState({ [id]: value })
    }

    handleSubmit = (e) => {
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
        let auth = this.state.googleAuth;
        console.log(auth.isSignedIn.get())
        if (auth.isSignedIn.get()) {
            this.props.history.push({
                pathname: '/Googleuser',
                state: this.state.googleUser
            })
            /* 
            email - zu
            first name - IW
            last name = IU.split(" ")[this.length]
            tumb = jL
            password = dV
            */
        } else {
            auth.signIn()
                .then(res => {
                    this.setState({ googleUser: res.getBasicProfile() });
                    this.props.history.push({
                        pathname: '/Googleuser',
                        state: this.state.googleUser
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    facebookAuth = (e) => {
        // dV: "116404569008010499454"
        // Ad: "YURI SANTANA CORDEIRO"
        // IW: "YURI"
        // IU: "SANTANA CORDEIRO"
        // jL: "https://lh3.googleusercontent.com/a-/AOh14GgvjO4w7X9isL8C82KRkMEOAnR1uka7NUjdNuYg=s96-c"
        // zu: "yuricordeiro@uni9.edu.br"
        this.props.history.push({
            pathname: '/Googleuser',
            state: {
                dV: "116404569008010499454",
                Ad: "YURI SANTANA CORDEIRO",
                IW: "YURI",
                IU: "SANTANA CORDEIRO",
                jL: "https://lh3.googleusercontent.com/a-/AOh14GgvjO4w7X9isL8C82KRkMEOAnR1uka7NUjdNuYg=s96-c",
                zu: "yuricordeiro@uni9.edu.br",
            }
        })
    }

    render() {
        if (this.state.gapiReady) {
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
                                <FontAwesomeIcon id="googleSignUp" className="deep-orange-text text-accent-3 g-signin2" icon={['fab', 'google-plus']} onClick={this.googleAuth} />
                                <FontAwesomeIcon className="blue-text text-darken-3" icon={['fab', 'facebook']} onClick={this.facebookAuth} />
                                <FontAwesomeIcon className="light-blue-text text-lighten-1" icon={['fab', 'twitter']} />
                            </div>
                        </form>
                    </div>

                    <Passwordreset id="modal1" />
                </div>
            )
        } else {
            return null
        }

    }
}
