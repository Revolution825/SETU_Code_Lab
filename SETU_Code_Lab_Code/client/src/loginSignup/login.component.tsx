import React, { Component } from "react";

export default class Login extends Component {
    render() {
        return(
            <form >
                <h3>
                    SETU Code Lab
                </h3>
                <div>
                    <input type="email" placeholder="Email" required />
                </div>
                <div>
                    <input type="password" placeholder="Password" required />
                </div>
                <div>
                    <button type="submit">
                        Log in
                    </button>
                </div>
                <p>
                    <a href="#">Sign up</a> if you don't have an account already
                </p>
            </form>
        );
    }
}