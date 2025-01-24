import axios from "axios";
import React from "react";
import { server } from "../static";
import { BsKey } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

class Restore extends React.Component {
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
        let phone = document.getElementById("phone").value;

        if (phone.length === 0) {
            toast.error("Telefon belgi hökman girizmeli");
            return null;
        }

        var formData = new FormData();
        formData.append("phone", document.getElementById("phone").value);

        axios.post(server + "/send/otp", formData).then((resp) => {
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
                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex my-4 text-[18px] justify-center text-appColor">
                    <Link className=" mx-2 hover:text-slate-600" to={"/login"}>
                        Login
                    </Link>
                    <Link className=" mx-2 hover:text-slate-600" to={"/signup"}>
                        Registrasiýa
                    </Link>
                </div>
                <div
                    className=" grid justify-center text-slate-700 max-w-[400px] justify-self-center text-center text-[14px] shadow-lg
                mx-6
                border p-4 rounded-md "
                >
                    <BsKey className="mx-auto" size={50}></BsKey>
                    <label className="text-[18px] font-bold">
                        Açar sözüni dikeldiş
                    </label>
                    <label>
                        Açar sözüni dikeltmek üçin telefon belgiňizi giriziň.
                        Görkezilen belgä SMS kod ugradylar
                    </label>
                    <div className="grid grid-cols-[max-content_auto] border items-center rounded-md px-2">
                        <label>+993</label>
                        <input
                            id="phone"
                            className="border-none"
                            type="number"
                            placeholder="61123456"
                            max={71999999}
                            min={61999999}
                        ></input>
                    </div>
                    <button
                        className="bg-appColor text-white p-2 my-2 rounded-lg"
                        onClick={() => {
                            this.sendCode();
                        }}
                    >
                        Ugratmak
                    </button>
                </div>
            </div>
        );
    }
}

export default Restore;
