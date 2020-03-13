import React, { Component } from 'react'
import M from 'materialize-css';
import axios from 'axios'
export class Passwordreset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pswdEmail: "",
        }
    }

    componentDidMount() {
        M.AutoInit(); // Init materialize
    }

    handleChange = (e) => {
        let { id, value } = e.target;
        this.setState({ [id]: value })
    }

    handleValidation = (e) => {
        let email = document.getElementById('pswdEmail');

        if (email.value.length <= 0) {
            email.classList.remove("valid");
            email.classList.add("invalid");
            email.setCustomValidity("Please enter your email");
        }
        else if (String(email.value).indexOf("@") <= 0) {
            email.classList.remove("valid");
            email.classList.add("invalid");
            email.setCustomValidity("Please enter a valid email");
        }
        else {
            email.classList.add("valid");
            email.classList.remove("invalid");
            email.setCustomValidity("");
        }
    }

    sendEmail = (e) => {
        e.preventDefault()
        let email = document.getElementById('pswdEmail');
        email.classList.remove("valid");
        var modal = M.Modal.getInstance(document.getElementById("modal1"));
        modal.close();
        axios.post('/users/pswdEmail', { email: email.value })
            .then(res => { alert(`Email sent`); this.setState({ pswdEmail: "" }); })
            .catch(err => { console.log(err) });
    }

    render() {
        return (
            <div id="modal1" className="modal">
                <form onSubmit={this.sendEmail}>
                    <div className="modal-content">
                        <h4>Password Reset</h4>
                        <div className="input-field" style={{ margin: "25px 0 -20px 0" }}>
                            <input required id="pswdEmail" type="email" className="" value={this.state.pswdEmail} onBlur={this.handleValidation} onChange={this.handleChange} />
                            <label htmlFor="pswdEmail">Enter your email</label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button href="#!" className="waves-effect waves-green btn-flat" type="submit" >Send</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Passwordreset;