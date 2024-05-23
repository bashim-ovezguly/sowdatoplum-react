import axios from "axios";
import React from "react";

import { server } from "../static";
import "./loginPageStyles.css";

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
        this.setState({ isLoading: true });

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username.length === 0) {
            this.setState({ error: "Username hökman giriziň" });
            return null;
        }

        if (password.length === 0) {
            this.setState({ error: "Açar sözi hökman giriziň" });
            return null;
        }

        let fdata = new FormData();
        fdata.append("username", username);
        fdata.append("password", password);

        axios
            .post(server + "/api/admin/user/login", fdata)
            .then((resp) => {
                this.setState({ userData: resp.data.user, isLoading: false });

                if (resp.status === 200) {
                    localStorage.setItem(
                        "admin_username",
                        document.getElementById("username").value
                    );
                    localStorage.setItem(
                        "admin_password",
                        document.getElementById("password").value
                    );
                    localStorage.setItem(
                        "admin_is_staff",
                        resp.data.user.is_staff
                    );
                    localStorage.setItem(
                        "admin_is_superuser",
                        resp.data.user.is_superuser
                    );
                    localStorage.setItem(
                        "admin_first_name",
                        resp.data.user.first_name
                    );
                    localStorage.setItem(
                        "admin_last_name",
                        resp.data.user.last_name
                    );
                    localStorage.setItem("admin_id", resp.data.user.id);
                    localStorage.setItem("admin_moderator_logged_in", true);

                    window.location.href = "/admin/";
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Açar sözi ýa-da telefon belgiňiz nädogry",
                });

                console.log(err);
            });
    }

    render() {
        return (
            <div className=" grid bg-slate-100 h-full content-start p-5">
                <div
                    className="bg-white w-full mx-auto grid max-w-[300px] 
                shadow-lg  border rounded-lg overflow-hidden p-5 text-slate-600"
                >
                    <label className="font-bold text-[20px]">Giriş</label>
                    <input
                        className="p-2"
                        id="username"
                        placeholder="Ulanyjy adyňyz"
                    ></input>
                    <input
                        id="password"
                        type="password"
                        placeholder="Açar sözüňiz"
                    ></input>
                    <button
                        className="bg-sky-700  w-full text-white p-1 hover:bg-sky-600 duration-300"
                        onClick={() => {
                            this.login();
                        }}
                    >
                        Girmek
                    </button>
                    <label>{this.state.error}</label>
                </div>
            </div>
        );
    }
}

export default AdminLoginPage;
