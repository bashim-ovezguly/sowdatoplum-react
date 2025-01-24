import axios from "axios";
import React from "react";
import { server } from "../static";
import Loader from "../client/components/Loader";

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            items: [],
            urlParams: [],
            filterOpen: false,
            newStoreOpen: false,

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Notifications";
        this.setData();
    }

    setData() {
        axios
            .get(
                server +
                    "/api/adm/notifications/?page=" +
                    this.state.current_page,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ items: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    deleteItem(id) {
        if (window.confirm("Bozmaga ynamynyz barmy?").result === false) {
            return null;
        }
        this.setState({ isLoading: true });
        axios
            .delete(server + "/api/adm/notifications/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
            });
    }

    save() {
        this.setState({ isLoading: true });
        const name = document.getElementById("name").value;
        const msg = document.getElementById("msg").value;
        const device_id = document.getElementById("device_id").value;
        const customer_id = document.getElementById("customer_id").value;

        let fdata = new FormData();
        fdata.append("name", name);
        fdata.append("msg", msg);
        fdata.append("customer", customer_id);
        fdata.append("device_id", device_id);
        fdata.append("status", "new");

        axios
            .post(server + "/api/adm/notifications/", fdata, this.state.auth)
            .then((resp) => {
                this.setData();
            })
            .catch((err) => {
                alert("fetch error");
            });
    }

    render() {
        return (
            <div className="notifs max-w-[600px] mx-auto">
                <Loader open={this.state.isLoading}></Loader>

                <div className="grid max-w-400px m-10px">
                    <h3>Taze habarnama</h3>
                    <input id="name" ref={"name"} placeholder="Name"></input>
                    <input id="msg" ref={"msg"} placeholder="Message"></input>
                    <input
                        id="customer_id"
                        ref={"customer_id"}
                        type="number"
                        placeholder="customer id"
                    ></input>
                    <input
                        id="device_id"
                        ref={"device_id"}
                        placeholder="device id"
                    ></input>
                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="w-max p-2 hover:bg-sky-700 text-[13px] bg-sky-600 my-2 text-white rounded-lg"
                    >
                        Ugratmak
                    </button>
                </div>

                {this.state.items.map((item) => {
                    return (
                        <div className="grid p-2 m-2 max-w-[400px] bg-slate-100 text-[13px] rounded-md">
                            <label>{item.id}</label>
                            <label className="bold">{item.name}</label>
                            <label className="text-13px">{item.msg}</label>
                            <label>Device: {item.device_id}</label>
                            <label>Customer: {item.customer}</label>
                            <label>{item.created_at}</label>
                            <label>{item.status}</label>
                            <label>Read at: {item.read_at}</label>
                            <button
                                className="w-max p-1 bg-red-600 rounded-md text-white"
                                onClick={() => {
                                    this.deleteItem(item.id);
                                }}
                            >
                                Bozmak
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Notifications;
