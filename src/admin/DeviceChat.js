import axios from "axios";
import React from "react";
import { BiSend, BiTrash } from "react-icons/bi";
import { server } from "../static";
import { CircularProgress } from "@mui/material";

class DeviceChat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],

            page_size: "",
            current_page: 1,
            last_page: "",
            msgList: [],
            urlParams: [],
            filterOpen: false,
            newStoreOpen: false,
            device_id: "",
            customer_photo: "",

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Device Chat";
        this.setData();
    }

    componentDidMount() {}

    setData() {
        const device_id = window.location.pathname.split("/")[3];

        axios
            .get(
                server + "/api/adm/mails?device_id=" + device_id,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ msgList: resp.data.data });
                this.setState({ isLoading: false });
                this.setState({ device_id: device_id });
            });
    }

    deleteItem(id) {
        if (window.confirm("Bozmaga ynamynyz barmy?").result === false) {
            return null;
        }
        axios
            .delete(server + "/api/adm/mails/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
            });
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(server + "/api/adm/mails?page=" + pageNumber, this.state.auth)
            .then((resp) => {
                this.setState({ stores: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    sendMessage() {
        if (document.getElementById("adminText").value === "") {
            return null;
        }

        let formdata = new FormData();

        formdata.append("msg", document.getElementById("adminText").value);
        formdata.append("device_id", this.state.device_id);

        formdata.append("sender", "admin");

        axios
            .post(server + "/api/adm/mails/", formdata, this.state.auth)
            .then((resp) => {
                this.setState({ stores: resp.data.data });
                this.setState({ isLoading: false });
                this.setData();
                document.getElementById("adminText").value = null;
            });
    }

    render() {
        return (
            <div className="wrapper max-w-[600px] mx-auto ">
                <h3>Device Chat </h3>
                <div className="flex items-center my-2">
                    <button className="text-[13px] rounded-md flex items-center">
                        <BiTrash size={25}></BiTrash>
                        <label>Chat arassalamak</label>
                    </button>
                </div>
                {this.state.isLoading && (
                    <div className="progress">
                        {" "}
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="min-h-[600px] grid grid-rows-[max-content_auto_max-content] px-2 bg-slate-50 rounded-lg">
                    <div className="deviceID bg-slate-200 rounded-lg p-2">
                        <label className="text-[12px]">
                            {this.state.device_id}
                        </label>
                    </div>
                    <div className="flex h-max overflow-auto flex-col-reverse text-[12px]">
                        {this.state.msgList.map((item) => {
                            const date = String(item.created_at).split("T")[0];
                            const time = String(item.created_at)
                                .split("T")[1]
                                .substring(0, 5);

                            if (item.sender !== "customer") {
                                return (
                                    <div className="flex justify-end">
                                        <div className="bg-slate-500 rounded-md p-2 m-1 text-white grid h-max max-w-[50%]">
                                            <label>{item.msg}</label>
                                            <label className="text-[12px]">
                                                {date} {time}
                                            </label>
                                        </div>
                                    </div>
                                );
                            } else {
                            }
                            return (
                                <div className="w-max bg-green-500 rounded-md p-2 m-1 text-white grid max-w-[50%]">
                                    <label>{item.msg}</label>
                                    <label className="text-[12px]">
                                        {date} {time}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-[auto_max-content] items-center text-slate-500 ">
                        <input id="adminText"></input>{" "}
                        <button
                            onClick={() => {
                                this.sendMessage();
                            }}
                            className="hover:bg-slate-100 duration-200"
                        >
                            <BiSend size={30} className="m-2 "></BiSend>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeviceChat;
