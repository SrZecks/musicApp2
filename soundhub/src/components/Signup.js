import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import M from 'materialize-css';
import Userdefault from '../img/user-default.png';

export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            confPassword: "",
            file: "",
            fileTumb: Userdefault,
            helperMsg: {
                emailSuccess: "",
                emailError: "",
                pswSuccess: "",
                pswError: ""
            }
        }
    }

    componentDidMount() {
        M.AutoInit(); // Init materialize
        var textNeedCount = document.querySelectorAll('#password, #confPassword');
        M.CharacterCounter.init(textNeedCount);
    }

    handleChange = (e) => {
        let { id, value } = e.target;
        this.setState({ [id]: value })
    }

    handleFile = (e) => {
        let { files } = e.target;
        console.log(files)
        if (files.length > 0) {
            this.setState({ file: files });
            this.setState({ fileTumb: URL.createObjectURL(files[0]) });
        }
        else {
            this.setState({ fileTumb: Userdefault });
        }

    }

    handleSubmit = async (e) => {
        e.preventDefault()
        var myform = e.target
        var formData = new FormData();

        for (let i = 0; i < myform.length; i++) {
            let { id, value } = myform[i];

            if (id === "file") formData.append('tumb', this.state.file[0]);
            else formData.append(id, value)

        }

        let config = {
            method: 'POST',
            url: '/users/signUp',
            data: formData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }

        let response = await axios(config);
        console.log(response)
    }

    checkUser = async (e) => {
        let userName = this.state.userName;
        let inputUser = document.getElementById('userName');
        let config = {
            method: 'GET',
            url: '/users/check',
            params: { userName: userName }
        }

        let res = await axios(config);
        console.log(res)

        if (res.data !== "OK") {
            inputUser.setCustomValidity("User Already in Use");
            inputUser.classList.remove("valid")
            inputUser.classList.add("invalid")
        } else {
            inputUser.setCustomValidity("");
            inputUser.classList.add("valid")
            inputUser.classList.remove("invalid")
        }
    }
    checkEmail = async (e) => {
        let email = this.state.email;
        let inputEmail = document.getElementById('email');

        if (email.indexOf("@") > -1) {
            //checkEmail
            let config = {
                method: 'GET',
                url: '/users/check',
                params: { email: email }
            }

            let res = await axios(config);
            console.log(res)

            if (res.data !== "OK") {
                inputEmail.setCustomValidity("Email Already in Use");
                inputEmail.classList.remove("valid")
                inputEmail.classList.add("invalid")
                this.setState({ helperMsg: { emailError: "Email Already in Use", success: "" } })
            } else {
                inputEmail.setCustomValidity("");
                inputEmail.classList.add("valid")
                inputEmail.classList.remove("invalid")
                this.setState({ helperMsg: { emailError: "", success: "✔" } })
            }
        } else {
            inputEmail.setCustomValidity("Invalid field.");
            this.setState({ helperMsg: { emailError: "Invalid Email", success: "" } })
        }
    }

    checkPassword = (e) => {
        let { password, confPassword } = this.state;

        let divPassword = document.getElementById("password");
        let divconfPassword = document.getElementById("confPassword");

        if (password !== "" && confPassword !== "") {
            if (password !== confPassword) {
                divPassword.setCustomValidity("Passwords doesn't match");
                divconfPassword.setCustomValidity("Passwords doesn't match");

                divPassword.classList.add("invalid");
                divconfPassword.classList.add("invalid");

                divPassword.classList.remove("valid");
                divconfPassword.classList.remove("valid");

                this.setState({ helperMsg: { pswError: "Passwords doesn't match", pswSuccess: "" } })
            } else {
                divPassword.setCustomValidity("");
                divconfPassword.setCustomValidity("");

                divPassword.classList.add("valid");
                divconfPassword.classList.add("valid");

                divPassword.classList.remove("invalid");
                divconfPassword.classList.remove("invalid");

                this.setState({ helperMsg: { pswError: "", pswSuccess: "✔" } })
            }
        }
    }

    render() {
        return (
            <div className='loginGrid'>
                <div className='loginForm'>
                    <h4>Create your SoundHub account</h4>
                    <form id="myform" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                        <div className="grid3">
                            <div className="file-field input-field">
                                <div className="prevImg">
                                    <img src={this.state.fileTumb} alt=""></img>
                                    <input required id="file" accept="image/jpeg, image/png" type="file" onChange={this.handleFile} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input id="filename" className="file-path validate" type="text" />
                                </div>
                            </div>

                            <div className="input-field">
                                <input required id="userName" type="text" className="" value={this.state.userName} onBlur={this.checkUser} onChange={this.handleChange} />
                                <label htmlFor="userName">User name</label>
                            </div>
                        </div>


                        <div className="grid2">
                            <div className="input-field">
                                <input required id="firstName" type="text" className="validate" value={this.state.firstName} onChange={this.handleChange} />
                                <label htmlFor="firstName">First name</label>
                            </div>

                            <div className="input-field">
                                <input required id="lastName" type="text" className="validate" value={this.state.lastName} onChange={this.handleChange} />
                                <label htmlFor="lastName">Last name</label>
                            </div>
                        </div>

                        <div className="input-field">
                            <input required id="email" type="email" className="" value={this.state.email} onBlur={this.checkEmail} onChange={this.handleChange} />
                            <label htmlFor="email">Email</label>
                            <span className="helper-text" data-error={this.state.helperMsg.emailError} data-success={this.state.helperMsg.emailSuccess}></span>
                        </div>

                        <div className="grid2" style={{ marginTop: -10 }}>
                            <div className="input-field">
                                <input required maxLength="12" data-length="12" id="password" type="password" className="input_text" value={this.state.password} onBlur={this.checkPassword} onChange={this.handleChange} />
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="input-field">
                                <input required maxLength="12" data-length="12" id="confPassword" type="password" className="input_text" value={this.state.confPassword} onBlur={this.checkPassword} onChange={this.handleChange} />
                                <label htmlFor="confPassword">Confirm password</label>
                            </div>
                        </div>

                        <div className="signUppBtn">
                            <button className="waves-effect waves-light" type="submit">
                                <span>SignUp</span>
                                <FontAwesomeIcon icon={['fas', 'sign-in-alt']} />
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default Signup;