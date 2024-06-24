import axios from "axios";
import React from "react";
import { server } from "../../static";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            products: [],
            error: "",
            user_data: "",
            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Giriş";
    }

    setData() {
        axios.get(server + "/products", this.state.auth).then((resp) => {
            this.setState({ products: resp.data, isLoading: false });
        });
    }

    clear_errors() {
        this.setState({ error: "" });
    }

    enter_click(event) {
        if (event.key === "Enter") {
            this.login_click();
        }
    }

    login_click() {
        this.clear_errors();
        this.setState({ isLoading: true });

        var phone = document.getElementById("phone").value;
        var password = document.getElementById("password").value;

        if (phone.length === 0) {
            this.setState({ error: "Telefon belgiňizi hökman giriziň" });
            this.setState({ isLoading: false });
            return null;
        }

        if (password.length === 0) {
            this.setState({ isLoading: false });
            this.setState({ error: "Açar sözi hökman giriziň" });
            return null;
        }

        var formdata = new FormData();
        formdata.append("phone", phone);
        formdata.append("password", password);

        axios
            .post(server + "/mob/token/obtain", formdata)
            .then((resp) => {
                this.setState({ user_data: resp.data, isLoading: false });

                localStorage.setItem("user_id", resp.data.data["id"]);
                localStorage.setItem("user_name", resp.data.data["name"]);
                localStorage.setItem("user_phone", resp.data.data["phone"]);
                localStorage.setItem("user_email", resp.data.data["email"]);
                localStorage.setItem(
                    "user_access_token",
                    resp.data.data["access_token"]
                );
                localStorage.setItem(
                    "user_refresh_token",
                    resp.data.data["refresh_token"]
                );

                if (resp.status === 200) {
                    localStorage.setItem("logged_in", true);
                    window.location.href = "/my_profile/";
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Açar sözi ýa-da telefon belgiňiz nädogry",
                });
                this.setState({ isLoading: false });
                console.log(err);
            });
    }

    render() {
        return (
            <div
                onKeyUp={(event) => {
                    this.enter_click(event);
                }}
                className="grid "
            >
                <div className="grid border shadow-md p-4 rounded-lg max-w-[400px] mx-auto min-w-[300px] mt-[30px]">
                    <h2 className="p-[5px] font-bold text-[25px] text-sky-600">
                        Giriş
                    </h2>

                    <label className="text-[12px] pt-[5px]">
                        Telefon belgiňiz
                    </label>
                    <div className="grid grid-cols-[max-content_auto] items-center">
                        <label className="mx-1">+993</label>
                        <input
                            className="p-2"
                            onKeyUp={(event) => {
                                this.enter_click(event);
                            }}
                            id="phone"
                            type={"number"}
                            placeholder="XX XXXXXX"
                        ></input>
                    </div>

                    <label className="text-[12px] pt-[5px]">Açar sözüňiz</label>
                    <input
                        className="p-[10px]"
                        onKeyUp={(event) => {
                            this.enter_click(event);
                        }}
                        id="password"
                        type="password"
                        placeholder="Açar sözüňiz"
                    ></input>
                    <label className="error">{this.state.error}</label>

                    {!this.state.isLoading && (
                        <button
                            className="p-2 my-2 bg-sky-600 hover:bg-sky-700 rounded-md
                    hover:shadow-lg duration-300 text-white"
                            onClick={() => {
                                this.login_click();
                            }}
                        >
                            Girmek
                        </button>
                    )}

                    {this.state.isLoading && (
                        <div className="progress">
                            <CircularProgress></CircularProgress>
                        </div>
                    )}

                    <Link
                        className="py-2 text-sky-600 hover:text-slate-600"
                        to="/signup"
                    >
                        Agza bolmak
                    </Link>
                    <Link
                        className="py-[5px] text-sky-600 hover:text-slate-600"
                        to="/send_code"
                    >
                        Açar sözüni dikeltmek
                    </Link>
                </div>
            </div>
        );
    }
}

export default LoginPage;
