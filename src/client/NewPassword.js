import axios from "axios";
import React from "react";
import { server } from "../static";
import { toast, ToastContainer } from "react-toastify";

class NewPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            user: [],
            phone: "",
            error: "",
        };

        document.title = "Açar sözi dikeltmek";
    }

    send() {
        let new_password = document.getElementById("new_password").value;
        let password_confirm =
            document.getElementById("password_confirm").value;

        if (new_password.length === 0) {
            toast.error("Açar sözüni hölman girizmeli");
            return null;
        }

        if (new_password !== password_confirm) {
            toast.error("Açar tassyklamasy gabat gelenok!");
            return null;
        }

        var formData = new FormData();
        formData.append("new_password", new_password);
        formData.append("phone", localStorage.getItem("phone"));

        let header = {
            headers: {
                token: localStorage.getItem("access_token"),
            },
        };

        axios
            .post(server + "/restore/password", formData, header)
            .then((resp) => {
                if (resp.status === 200) {
                    window.location.href = "/profile";
                } else {
                    this.setState({ error: "Ýalňyşlyk ýüze çykdy" });
                }
            });
    }

    render() {
        return (
            <div className="p-4">
                <div className="restore_password p-6 grid max-w-[400px] mx-auto shadow-md rounded-md m-2 border">
                    <ToastContainer
                        autoClose={5000}
                        closeOnClick={true}
                    ></ToastContainer>
                    <h3 className="font-bold text-[20px]">
                        Täze açar sözi giriziň
                    </h3>

                    <input
                        id="new_password"
                        type="password"
                        placeholder="Täze açar sözi"
                    ></input>
                    <input
                        id="password_confirm"
                        type="password"
                        placeholder="Täze açar sözi gaýtadan giriziň"
                    ></input>
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 duration-100 rounded-md text-white my-2"
                        onClick={() => {
                            this.send();
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }
}

export default NewPassword;
