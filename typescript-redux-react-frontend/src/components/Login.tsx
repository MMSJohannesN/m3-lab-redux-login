import React, { Component } from 'react'
import { IWindow } from '../framework/IWindow';
import { IAction, ActionType } from '../framework/IAction';
import { IUser, IState } from '../state/appState';
import { reducerFunctions } from '../reducer/appReducer';
import axios from 'axios';
import { userInfo } from 'os';
declare let window: IWindow;


export interface IUserAction extends IAction {
    user: IUser
}

export interface ILoginError extends IAction {
    errorMessage: string
}


reducerFunctions[ActionType.update_user] = function (newState: IState, action: IUserAction) {
    newState.BM.user = action.user;
    return newState;
}
reducerFunctions[ActionType.user_login_ok] = function (newState: IState, action: IUserAction) {
    newState.UI.waitingForResponse = false;
    newState.UI.loggedIn = true;
    return newState;
}

reducerFunctions[ActionType.user_login_fail] = function (newState: IState, action: IUserAction) {
    newState.UI.waitingForResponse = false;
    newState.UI.loggedIn = false;
    newState.UI.errorMessage = "Error";
    return newState;
}

reducerFunctions[ActionType.user_logout] = function (newState: IState, action: IUserAction) {
    newState.UI.waitingForResponse = false;
    newState.UI.loggedIn = false;
    newState.UI.errorMessage = "Error";
    return newState;
}

export default class Login extends Component {
    render() {
        if (window.CS.getUIState().loggedIn == true) {
            return (<div>
                You are logged in as {window.CS.getBMState().user.username}
                <form onSubmit={this.handleLogout}>
                    <input type="submit" value="Logout" />
                </form>
            </div>
            )
        } else {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input type="username" placeholder="Your username" onChange={this.handleUsernameLogin} value={window.CS.getBMState().user.username} />
                        <br />
                        <label htmlFor="password">Password:</label>
                        <input type="password" placeholder="********" onChange={this.handlePasswordLogin} value={window.CS.getBMState().user.password} />
                        <br />
                        <input type="submit" value="Login" />
                    </form>

                </div>
            )
        }
    }


    handleUsernameLogin(event: any) {
        let user = window.CS.getBMState().user;
        user.username = event.target.value;
        const action: IUserAction = {
            type: ActionType.update_user,
            user: user
        }
        window.CS.clientAction(action);
    }
    handlePasswordLogin(event: any) {
        let user = window.CS.getBMState().user;
        user.password = event.target.value;
        const action: IUserAction = {
            type: ActionType.update_user,
            user: user
        }
        window.CS.clientAction(action);
    }

    handleSubmit(event: any) {

        event.preventDefault();
        const uiAction: IAction = {
            type: ActionType.server_called
        }
        window.CS.clientAction(uiAction);
        let user = window.CS.getBMState().user;
        console.log(user.username);
        axios.post(window.CS.getDBServerURL() + "/login", window.CS.getBMState().user)
            .then(res => {

                console.log("res.data", res.data);
                console.log(res.data.password);


                if (res.data.errorMessage) {
                    console.log("errorMessage")
                    console.log(res.data.errorMessage);
                    const loginError: ILoginError = {
                        type: ActionType.user_login_fail,
                        errorMessage: res.data.errorMessage
                    }
                    window.CS.clientAction(loginError);
                    console.log(loginError);
                } else {
                    const uiAction: IAction = {
                        type: ActionType.user_login_ok
                    }
                    window.CS.clientAction(uiAction);
                    console.log(uiAction);
                }



            })
    }

    handleLogout(event: any) {

        event.preventDefault();
        const uiAction: IAction = {
            type: ActionType.server_called
        }
        window.CS.clientAction(uiAction);

        axios.post(window.CS.getDBServerURL() + "/login", window.CS.getBMState().user)
            .then(res => {
                const logoutAction: IAction = {
                    type: ActionType.user_logout
                };
                window.CS.clientAction(logoutAction);
                console.log(logoutAction)
            });
    }
}
