import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";
import { BiMap } from "react-icons/bi";
import LocationSelector from "../../admin/LocationSelector";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            user: [],
            showSuccessMsg: false,

            email_error: "",
            phone_error: "",
            password_error: "",
            password_confirm_error: "",
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

    clear_all_errors() {
        this.setState({
            email_error: "",
            password_error: "",
            phone_error: "",
            password_confirm_error: "",
        });
    }

    ok_click() {
        var valid = true;
        this.clear_all_errors();
        var name = document.getElementById("name").value;
        var password = document.getElementById("password").value;
        var password_confirm =
            document.getElementById("password_confirm").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;

        if ((password.length == 0) & (password_confirm.length == 0)) {
            this.setState({ password_error: "Açar sözi hökman giriziň" });
            valid = false;
        }

        if (password != password_confirm) {
            this.setState({
                password_confirm_error: "Tassyklama gabat gelenok",
            });
            valid = false;
        }

        if (phone.length == 0) {
            this.setState({ phone_error: "Telefon belgini hokman girizmeli" });
            valid = false;
        }

        if (valid == false) {
            return null;
        }

        var formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("email", email);

        axios
            .post(server + "/mob/reg", formData)
            .then((resp) => {
                console.log(resp, resp.status);

                if (resp.status == 200) {
                    window.location.href = "/verification?phone=" + phone;
                }
            })
            .catch((err) => {
                console.log(
                    err.response.status,
                    err,
                    err.response.data["error_code"]
                );
                if (err.response.data["error_code"] === 5) {
                    this.setState({ email_error: "Nädogry email" });
                }

                if (err.response.data["error_code"] === 3) {
                    this.setState({ email_error: "E-mail eýýäm hasaba alnan" });
                }

                if (err.response.data["error_code"] === 2) {
                    this.setState({
                        phone_error: "Telefon belgi eýýäm hasaba alnan ",
                    });
                }
            });
    }

    render() {
        return (
            <div className="max-w-[400px] mx-auto my-5">
                <div className="fields grid shadow-md rounded-md p-[20px] border">
                    <h2 className="text-[20px] font-bold text-sky-600">
                        Registrasiýa
                    </h2>
                    <input className="" id="name" placeholder="Adyňyz"></input>
                    <label className="error text-orange-500">
                        {this.state.phone_error}
                    </label>{" "}
                    <div className="border rounded-md p-1 grid grid-cols-[max-content_auto] items-center">
                        <label className="mx-2">+993</label>
                        <input
                            className="border-none m-0 p-2"
                            type="number"
                            id="phone"
                            maxLength={8}
                            min={61000000}
                            max={71999999}
                            placeholder="Telefon belgiňiz (xx xxxxxx)"
                        ></input>
                    </div>
                    <label className="error">{this.state.email_error}</label>
                    <label className="error">{this.state.password_error}</label>
                    <input
                        id="password"
                        placeholder="Açar sözi"
                        type="password"
                    ></input>
                    <label className="error text-orange-600">
                        {this.state.password_confirm_error}
                    </label>
                    <input
                        id="password_confirm"
                        placeholder="Açar sözüni tassykla"
                        type="password"
                    ></input>
                    <input
                        id="email"
                        placeholder="Elektron poçtaňyz"
                        type="email"
                    ></input>
                    <button
                        className="text-white bg-sky-600  p-[5px] my-2 rounded-md"
                        onClick={() => {
                            this.ok_click();
                        }}
                    >
                        Agza bolmak
                    </button>
                    <Link
                        className="text-white bg-sky-600  p-[5px] text-center rounded-md my-2"
                        to="/login"
                    >
                        Yza gaýtmak
                    </Link>
                </div>
            </div>
        );
    }
}

export default Register;
