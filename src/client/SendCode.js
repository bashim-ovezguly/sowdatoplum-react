import axios from "axios";
import React from "react";
import { server } from "../static";
import { MdPassword, MdRestore } from "react-icons/md";
import { BsKey } from "react-icons/bs";
import { Link } from "react-router-dom";

class SendCode extends React.Component {
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

        document.title = "Açar sözi dikeltmek";
    }

    sendCode() {
        let phone = document.getElementById("phone_number").value;

        if (phone.length === 0) {
            alert("Telefon belgini hölman girizmeli");
            return null;
        }

        if (phone.length !== 8) {
            alert("Telefon belgi 8 belgiden ybarat bolmaly");
            return null;
        }

        var formData = new FormData();
        formData.append("phone", document.getElementById("phone_number").value);

        axios
            .post(server + "/mob/customers/send/code", formData)
            .then((resp) => {
                if (resp.status === 200) {
                    window.location.href =
                        "/verification?next=restore&phone=" + phone;
                } else {
                    this.setState({ error: "Ýalňyşlyk ýüze çykdy" });
                }
            });
    }

    render() {
        return (
            <div className="grid justify-center">
                <div className="flex my-4 text-[14px] justify-center">
                    <Link
                        className="text-sky-600 mx-2 hover:text-slate-600"
                        to={"/login"}
                    >
                        Login
                    </Link>
                    <Link
                        className="text-sky-600 mx-2 hover:text-slate-600"
                        to={"/signup"}
                    >
                        Registrasiýa
                    </Link>
                </div>
                <div
                    className=" grid justify-center shadow-md text-slate-700 max-w-[400px] justify-self-center border
                       text-center rounded-md text-[14px] m-4 p-4"
                >
                    <BsKey className="mx-auto" size={50}></BsKey>
                    <label className="text-[18px] font-bold">
                        Açar sözüni dikeldiş
                    </label>
                    <label>
                        Açar sözüni dikeltmek üçin telefon belgiňizi giriziň.
                        Görkezilen belgä SMS kody ugradylar
                    </label>

                    <div>
                        <label className="mx-2">+993</label>
                        <input
                            id="phone_number"
                            type="number"
                            placeholder="XX XXXXXX"
                        ></input>
                    </div>
                    <button
                        className="bg-sky-700 text-white p-2 rounded-lg hover:bg-slate-400 duration-150"
                        onClick={() => {
                            this.sendCode();
                        }}
                    >
                        Tassyklaýyş kody ugratmak
                    </button>
                </div>
            </div>
        );
    }
}

export default SendCode;
