import axios from "axios";
import React from "react";
import { server } from "../../static";

class RestorePassword extends React.Component {
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

    restore_password() {
        let phone = localStorage.getItem("phone");
        let new_password = document.getElementById("new_password").value;
        let password_confirm =
            document.getElementById("password_confirm").value;

        if (new_password.length === 0) {
            alert("Açar sözüni hölman girizmeli");
            return null;
        }

        if (new_password !== password_confirm) {
            alert("Açar tassyklamasy gabat gelenok!");
            return null;
        }

        var formData = new FormData();
        formData.append("new_password", new_password);
        formData.append("phone", phone);

        let header = {
            headers: {
                token: localStorage.getItem("access_token"),
            },
        };

        axios
            .post(server + "/mob/restore/password", formData, header)
            .then((resp) => {
                if (resp.status === 200) {
                    window.location.href =
                        "/customer/" + localStorage.getItem("id");
                } else {
                    this.setState({ error: "Ýalňyşlyk ýüze çykdy" });
                }
            });
    }

    render() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        return (
            <div className="restore_password p-[10px] shadow-md">
                <h3>Täze açar sözi giriziň</h3>

                <input
                    id="new_password"
                    type="password"
                    placeholder="Täze açar sözi"
                ></input>
                <input
                    id="password_confirm"
                    type="password"
                    placeholder="Täze açar sözi tassyklaň"
                ></input>
                <button
                    onClick={() => {
                        this.restore_password();
                    }}
                >
                    OK
                </button>
            </div>
        );
    }
}

export default RestorePassword;
