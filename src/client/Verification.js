import axios from "axios";
import React from "react";

import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { server } from "../static";

class Verification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };

        document.title = "Werifikasiýa";
    }

    sendCode() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get("phone");
        this.setState({ phone: phone });
        var formData = new FormData();
        formData.append("phone", phone);

        // axios.post(server + "/send/otp", formData).then((resp) => {});
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

        if (code === "") {
            toast.error("Tassyklaýyş kodyny giriziň");
        }

        axios
            .post(server + "/verif", formData)
            .then((resp) => {
                localStorage.setItem("phone", resp.data.phone);
                localStorage.setItem("email", resp.data.email);
                localStorage.setItem("user_id", resp.data.id);
                localStorage.setItem(
                    "user_access_token",
                    resp.data.access_token
                );
                localStorage.setItem(
                    "user_refresh_token",
                    resp.data.refresh_token
                );
                localStorage.setItem("user_name", resp.data.name);
                localStorage.setItem("user_id", resp.data.id);
                localStorage.setItem("logged_in", true);

                if (next_page === "restore") {
                    window.location.href = "/restore/password";
                } else {
                    window.location.href = "/profile/";
                }
            })
            .catch((err) => {
                if (err.response.data.error_code === "4") {
                    toast.error("Tassyklaýyş kody nädogry");
                }
            });
    }

    time_tick() {}

    render() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get("phone");

        return (
            <div className="grid justify-center">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="m-2 p-4 rounded-md border grid max-w-[300px] shadow-md">
                    <MdEmail
                        className="mx-auto text-slate-600 my-4"
                        size={50}
                    ></MdEmail>
                    <label className="text-center">
                        <span className="font-bold">+993 {phone}</span> belgä
                        ugradylan SMS kody giriziň
                    </label>

                    <input
                        className="text-center text-[20px]"
                        id="code"
                        maxLength={4}
                        placeholder="Kod"
                        min={1000}
                        type="number"
                        max={9999}
                    ></input>
                    <button
                        className="bg-sky-600 text-white rounded-md p-2 my-1"
                        onClick={() => {
                            this.confirm_click();
                        }}
                    >
                        Tassyklamak
                    </button>
                    {/* <button
                        className="text-sky-600 p-2 border hover:bg-slate-200 rounded-lg m-1"
                        onClick={() => {
                            this.resend();
                        }}
                    >
                        Kody gaýtadan ugratmak
                    </button> */}

                    <Link
                        className="text-appColor hover:text-slate-700 duration-200 mt-4 w-max"
                        to="/login"
                    >
                        Goý bolsun etmek
                    </Link>
                </div>
            </div>
        );
    }
}

export default Verification;
