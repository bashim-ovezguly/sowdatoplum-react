import axios from "axios";
import React from "react";

import { server } from "../static";
import { toast, ToastContainer } from "react-toastify";
import ProgressIndicator from "./ProgressIndicator";

class AdminLoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Admin Login";
    }

    login() {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username.length === 0) {
            toast.error("Username hökman giriziň");
            return null;
        }

        if (password.length === 0) {
            toast.error("Açar sözi hökman giriziň");
            return null;
        }

        let fdata = new FormData();
        fdata.append("username", username);
        fdata.append("password", password);

        this.setState({ isLoading: true });

        axios
            .post(server + "/api/adm/user/login", fdata)
            .then((resp) => {
                this.setState({ userData: resp.data.user, isLoading: false });
                localStorage.setItem(
                    "admin_username",
                    document.getElementById("username").value
                );
                localStorage.setItem(
                    "admin_password",
                    document.getElementById("password").value
                );

                window.location.href = "/superuser/";
            })
            .catch((err) => {
                toast.error("Açar sözi ýa-da telefon belgiňiz nädogry");
                console.log(err);
            })
            .finally((resp) => {
                this.setState({ isLoading: false });
            });
    }

    detectEnterKey(event) {
        if (event.key === "Enter") this.login();
    }

    render() {
        return (
            <div className=" bg-slate-100 h-full content-start p-5 ">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                <div
                    className="bg-white w-full mx-auto grid max-w-[300px] 
                shadow-lg  border rounded-lg overflow-hidden p-5 text-slate-600"
                >
                    <label className="font-bold text-[20px]">Giriş</label>
                    <input
                        onKeyDown={(event) => {
                            this.detectEnterKey(event);
                        }}
                        className="p-2"
                        id="username"
                        placeholder="Ulanyjy adyňyz"
                    ></input>
                    <input
                        onKeyDown={(event) => {
                            this.detectEnterKey(event);
                        }}
                        id="password"
                        type="password"
                        placeholder="Açar sözüňiz"
                    ></input>
                    {!this.state.isLoading && (
                        <button
                            className="bg-sky-700  w-full text-white hover:bg-sky-600 duration-300 rounded-md p-2 my-2"
                            onClick={() => {
                                this.login();
                            }}
                        >
                            Girmek
                        </button>
                    )}
                    {this.state.isLoading && (
                        <ProgressIndicator
                            open={this.state.isLoading}
                        ></ProgressIndicator>
                    )}
                    <label>{this.state.error}</label>
                </div>
            </div>
        );
    }
}

export default AdminLoginPage;
