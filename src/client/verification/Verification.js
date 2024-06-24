import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdSms } from "react-icons/md";
import { FaSms } from "react-icons/fa";
import { Link } from "react-router-dom";

class Verification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            user: [],
            phone: "",
            error: "",
            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Werifikasiýa";
    }

    resend() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get("phone");
        this.setState({ phone: phone });
        var formData = new FormData();
        formData.append("phone", phone);

        axios
            .post(server + "/mob/customers/send/code", formData)
            .then((resp) => {});
    }

    confirm_click() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get("phone");
        const next_page = urlParams.get("next");

        var code = document.getElementById("code").value;
        var formData = new FormData();
        formData.append("code", code);
        formData.append("phone", phone);

        if (code == "") {
            this.setState({ error: "Tassyklaýyş kodyny giriziň" });
        }

        axios
            .post(server + "/mob/verif", formData)
            .then((resp) => {
                if (resp.status == 200) {
                    localStorage.setItem("phone", resp.data.phone);
                    localStorage.setItem("email", resp.data.email);
                    localStorage.setItem(
                        "access_token",
                        resp.data.access_token
                    );
                    localStorage.setItem(
                        "refresh_token",
                        resp.data.refresh_token
                    );
                    localStorage.setItem("name", resp.data.name);
                    localStorage.setItem("id", resp.data.id);
                    localStorage.setItem("logged_in", true);

                    if (next_page == "restore") {
                        window.location.href = "/restore/password/";
                    } else {
                        window.location.href =
                            "/customer/" + localStorage.getItem("id");
                    }
                } else {
                    this.setState({ error: "Ýalňyşlyk ýüze çykdy" });
                }
            })
            .catch((err) => {
                if (err.response.data.error_code === 2) {
                    this.setState({ error: "tassyklaýyş kody nädogry" });
                }
            });
    }

    time_tick() {}

    render() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get("email");

        let error_message = null;

        const phone = urlParams.get("phone");

        return (
            <div className="grid justify-center">
                <div className="shadow-md rounded-lg m-4 p-4 border grid justify-center max-w-[300px]">
                    <FaSms
                        className="mx-auto text-slate-600 my-4"
                        size={50}
                    ></FaSms>
                    <label className="text-center">
                        +993 {phone} belgä ugradylan SMS kody giriziň
                    </label>
                    <label className="email">{email}</label>
                    <input
                        className="text-center"
                        id="code"
                        maxLength={4}
                        placeholder="Kod"
                        min={1000}
                        max={9999}
                    ></input>
                    <button
                        className="bg-sky-600 text-white rounded-lg p-2"
                        onClick={() => {
                            this.confirm_click();
                        }}
                    >
                        Tassyklamak
                    </button>
                    <button
                        className="text-sky-600 p-2 border hover:bg-slate-200 rounded-lg"
                        onClick={() => {
                            this.resend();
                        }}
                    >
                        Kody gaýtadan ugratmak
                    </button>
                    <label className="msg">{this.state.error}</label>

                    <Link
                        className="text-sky-600 p-2 border hover:bg-slate-200 rounded-lg text-center"
                        to="/login"
                    >
                        Goý bolsun etmek
                    </Link>
                </div>

                <h3>{error_message}</h3>
            </div>
        );
    }
}

export default Verification;
