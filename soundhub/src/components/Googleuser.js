import React, { Component } from 'react'

export class Googleuser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    componentDidMount(){
        this.setState({user: this.props.history.location.state})
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <div>ID - {this.state.user.dV}</div>
                <div>Full Name - {this.state.user.Ad}</div>
                <div>First Name - {this.state.user.IW}</div>
                <div>Last Name - {this.state.user.IU}</div>
                <div>img - <img src={this.state.user.jL} alt="user img"></img></div>
                <div>email - {this.state.user.zu}</div>
            </div>
        )
    }
}

export default Googleuser;