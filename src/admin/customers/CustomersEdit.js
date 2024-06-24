import axios from "axios";
import React from "react";
import { server } from "../../static";
import { CircularProgress } from "@mui/material";

class CustomersEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Satyjy";
        this.setData();
    }

    setData() {
        let customer_id = window.location.pathname.split("/")[3];

        axios
            .get(
                server + "/api/admin/customers/" + customer_id,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ customer: resp.data, isLoading: false });
                this.setState({ name: resp.data.name });
                this.setState({ phone: resp.data.phone });
                this.setState({ active: resp.data.active });
                this.setState({ email: resp.data.email });
                this.setState({ id: resp.data.id });
                this.setState({ created_at: resp.data.created_at });
                this.setState({ public: resp.data.public });
                this.setState({ verificated: resp.data.verificated });
                this.setState({ img: resp.data.img });
            });
    }

    save() {
        this.setState({ isLoading: true });
        var fdata = new FormData();
        fdata.append("name", document.getElementById("name").value);
        fdata.append("phone", document.getElementById("phone").value);
        fdata.append("email", document.getElementById("email").value);
        fdata.append("verif_sms_sent", true);

        if (document.getElementById("active").checked === true) {
            fdata.append("active", true);
        } else {
            fdata.append("active", false);
        }

        if (document.getElementById("verificated").checked === true) {
            fdata.append("verificated", "True");
        } else {
            fdata.append("verificated", "False");
        }

        axios
            .put(
                server + "/api/admin/customers/" + this.state.id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            })
            .catch((err) => {
                alert("error");
            });
    }

    delete(id) {
        var result = window.confirm("Bozmaga ynamyňyz barmy?");

        if (result == true) {
            axios
                .post(
                    server + "/api/admin/customers/delete/" + id,
                    {},
                    this.state.auth
                )
                .then((resp) => {
                    window.history.back();
                });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <CircularProgress></CircularProgress>
                </div>
            );
        }

        return (
            <div className="grid mx-auto max-w-[600px]">
                <div className="grid   ">
                    <h3 className="text-[25px]">{this.state.name} </h3>
                    <img
                        alt=""
                        className="max-h-[300px] object-cover border mx-auto"
                        src={this.state.img}
                    ></img>

                    <div>
                        {this.state.active === true ? (
                            <input
                                id="active"
                                defaultChecked
                                type="checkbox"
                            ></input>
                        ) : (
                            <input id="active" type="checkbox"></input>
                        )}
                        <label>Aktiw</label>
                    </div>

                    <div>
                        {this.state.verificated == "True" ? (
                            <input
                                id="verificated"
                                defaultChecked
                                type="checkbox"
                            ></input>
                        ) : (
                            <input id="verificated" type="checkbox"></input>
                        )}
                        <label>Verificated</label>
                    </div>

                    <input
                        id="name"
                        placeholder="Ady"
                        defaultValue={this.state.name}
                    ></input>
                    <input
                        id="phone"
                        placeholder="Telefon belgisi"
                        defaultValue={this.state.phone}
                    ></input>
                    <input
                        id="email"
                        placeholder="Email"
                        defaultValue={this.state.email}
                    ></input>

                    <div>
                        <button
                            className="bg-green-600 text-white rounded p-1 m-1"
                            onClick={() => {
                                this.save();
                            }}
                        >
                            Ýatda saklamak
                        </button>
                        <button
                            className="bg-red-600 text-white rounded p-1 m-1"
                            onClick={() => {
                                this.delete(this.state.id);
                            }}
                        >
                            Bozmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomersEdit;
