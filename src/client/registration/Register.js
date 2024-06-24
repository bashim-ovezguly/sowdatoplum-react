import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";
import { BiMap } from "react-icons/bi";
import LocationSelector from "../../admin/LocationSelector";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
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
        var valid = true;

        var name = document.getElementById("name").value;
        var password = document.getElementById("password").value;
        var password_confirm =
            document.getElementById("password_confirm").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;

        if (name === "") {
            toast.error("Dükan adyny giriziň");
            return false;
        }

        if ((password.length === 0) & (password_confirm.length === 0)) {
            toast.error("Açar sözi hökman giriziň");
            return false;
        }

        if (password !== password_confirm) {
            toast.error("Tassyklama gabat gelenok");
            return false;
        }

        if (phone.length === 0) {
            toast.error("Telefon belgini hokman girizmeli");
            return false;
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
                    err.response.data.error_code
                );
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
            <div className="max-w-[400px] mx-auto my-5">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="fields grid shadow-md rounded-lg p-4 border m-4">
                    <h2 className="text-[20px] font-bold text-sky-600">
                        Registrasiýa
                    </h2>
                    <input
                        className=""
                        id="name"
                        placeholder="Dükanyň ady"
                    ></input>
                    <label className="text-[12px] mt-1">Satýan harydy</label>
                    <select>
                        <option selected value={""}></option>
                        <option value={"car"}>Awtoulag</option>
                        <option value={"flat"}>Gozgalmaýan emläk</option>
                        <option value={"car"}>Awtoşaý</option>
                        <option value={"other"}>Beýleki harytlar</option>
                    </select>

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
                        className="text-white bg-sky-600  p-2 my-2 rounded-md"
                        onClick={() => {
                            this.ok_click();
                        }}
                    >
                        Agza bolmak
                    </button>
                    <Link
                        className="p-2 text-center rounded-md my-2 border hover:bg-slate-200 flex items-center justify-center"
                        to="/login"
                    >
                        <BsArrowLeft className="mx-2"></BsArrowLeft>
                        <label>Yza gaýtmak</label>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Register;
