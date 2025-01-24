import axios from "axios";
import React from "react";
import { server } from "../static";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { CircularProgress } from "@mui/material";
import { MotionAnimate } from "react-motion-animate";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            products: [],
            user: [],
            showSuccessMsg: false,

            location_id: "",
            location_name: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Registrasiýa";
    }

    ok_click() {
        var name = document.getElementById("name").value;
        var password = document.getElementById("password").value;
        var password_confirm =
            document.getElementById("password_confirm").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;

        if (name === "") {
            toast.error("Adyňyzy hökman giriziň");
            return false;
        }

        if (email.length === 0) {
            toast.error("Elektron poçta hökman girizmeli");
            return false;
        }

        if ((password.length === 0) & (password_confirm.length === 0)) {
            toast.error("Açar sözi hökman giriziň");
            return false;
        }
        if (phone.length === 0) {
            toast.error("Telefon belgini hökman girizmeli");
            return false;
        }

        if (password !== password_confirm) {
            toast.error("Açar sözi gaýtadan ýazylanda ýalňyşlyk ýüze çykdy");
            return false;
        }

        var formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("email", email);
        this.setState({ isLoading: true });

        axios
            .post(server + "/reg", formData)
            .then((resp) => {
                localStorage.setItem("user_id", resp.data.store.id);
                localStorage.setItem("user_phone", resp.data.store.phone);
                window.location.href = "/verification?phone=" + phone;
            })
            .catch((err) => {
                this.setState({ isLoading: false });

                if (err.response.data["error_code"] === 5) {
                    toast.error("Nädogry email");
                }

                if (err.response.data["error_code"] === 3) {
                    this.setState({ email_error: "" });
                    toast.error("E-mail eýýäm hasaba alnan");
                }

                if (err.response.data["error_code"] === 2) {
                    toast.error("Telefon belgi eýýäm hasaba alnan");
                }
            });
    }

    render() {
        return (
            <MotionAnimate>
                <div className="max-w-[400px] mx-auto px-6  py-5 ">
                    <ToastContainer
                        autoClose={10000}
                        closeOnClick={true}
                    ></ToastContainer>
                    <div className="fields grid m-2 p-4 rounded-lg border bg-white text-[14px] shadow-lg">
                        <h1 className="text-[20px] font-bold text-appColor mb-2">
                            Registrasiýa
                        </h1>
                        <input
                            id="name"
                            placeholder="Adyňyz"
                            className="p-2"
                        ></input>
                        <input
                            id="email"
                            placeholder="Elektron poçtaňyz"
                            type="email"
                            className="p-2"
                        ></input>

                        <label className="text-[12px]">Telefon belgiňiz</label>
                        <div className="border rounded-md grid grid-cols-[max-content_auto] items-center p-1 mb-2">
                            <label className="mx-1 ">+993</label>
                            <input
                                className="border-none m-0"
                                type="number"
                                id="phone"
                                maxLength={8}
                                min={61000000}
                                max={71999999}
                                placeholder="xx xxxxxx"
                            ></input>
                        </div>

                        <input
                            id="password"
                            placeholder="Açar sözi"
                            type="password"
                            className="p-2"
                        ></input>
                        <label className="error text-orange-600">
                            {this.state.password_confirm_error}
                        </label>
                        <input
                            id="password_confirm"
                            placeholder="Açar sözüni gaýtadan ýazyň"
                            type="password"
                            className="p-2"
                        ></input>
                        {this.state.isLoading == true && (
                            <CircularProgress className="mx-auto"></CircularProgress>
                        )}
                        {this.state.isLoading == false && (
                            <div className="grid">
                                <button
                                    className="text-white bg-appColor p-2 my-2 rounded-md"
                                    onClick={() => {
                                        this.ok_click();
                                    }}
                                >
                                    Agza bolmak
                                </button>
                                <Link
                                    className="w-max mt-4 flex items-center hover:text-slate-600 text-appColor"
                                    to="/login"
                                >
                                    <BsArrowLeft></BsArrowLeft>
                                    <label className="mx-2">Yza gaýtmak</label>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default Register;
