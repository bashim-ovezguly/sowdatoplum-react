import axios from "axios";
import React from "react";
import { MdDelete, MdRefresh } from "react-icons/md";
import { server } from "../static";
import { CircularProgress, Pagination } from "@mui/material";
import { FaChrome } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";

class Devices extends React.Component {
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
            deviceList: [],
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

        document.title = "Devices";
        this.setData();
    }

    setData() {
        axios
            .get(
                server + "/api/adm/devices/?page=" + this.state.current_page,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ deviceList: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    deleteItem(id) {
        let result = window.confirm("Bozmaga ynamynyz barmy?");
        if (result == false) {
            return null;
        }

        this.setState({ isLoading: true });
        axios
            .delete(server + "/api/adm/devices/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: false });
            });
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(
                server + "/api/adm/devices?page=" + pageNumber,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ deviceList: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            //DEVICES
            <div className="grid p-2">
                <div className="flex items-center mb-2">
                    <label className="text-lg font-bold">
                        Devices {this.state.total}
                        {this.state.isLoading && (
                            <div className="absolute bg-white text-white shadow-md rounded-md m-2 p-2 ">
                                <CircularProgress></CircularProgress>
                            </div>
                        )}
                    </label>
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="flex items-center bg-slate-200 rounded-md mx-1 p-1"
                    >
                        <MdRefresh size={20}></MdRefresh>
                    </button>
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <table className="text-[12px] border m-2 p-2">
                    <tr className="text-left bg-slate-200">
                        <th className="p-1">ID</th>
                        <th className="p-1">Platform</th>
                        <th className="p-1">App version</th>
                        <th className="p-1">Device ID</th>
                        <th className="p-1">Registered at</th>
                        <th className="p-1">Last seen</th>
                        <th className="p-1">Store</th>
                        <th className="p-1">IP</th>
                        <th className="p-1">Hereketler</th>
                    </tr>
                    {this.state.deviceList.map((item) => {
                        return (
                            <tr className="hover:bg-slate-100">
                                <td>{item.id}</td>
                                <td>
                                    <div className="flex items-center">
                                        {item.platform == "web" && (
                                            <FaChrome
                                                size={18}
                                                className=" mx-1"
                                            ></FaChrome>
                                        )}
                                        {item.platform == "android" && (
                                            <DiAndroid
                                                size={18}
                                                className="text-green-600 mx-1"
                                            ></DiAndroid>
                                        )}
                                        {item.platform}
                                    </div>
                                </td>
                                <td>{item.app_version}</td>
                                <td>{item.device_id}</td>
                                <td>{item.created_at}</td>
                                <td>{item.last_seen}</td>
                                <td>
                                    {" "}
                                    {item.customer != undefined &&
                                        item.customer.name +
                                            " " +
                                            item.customer.phone}
                                </td>
                                <td>{item.ip}</td>
                                <td>
                                    <MdDelete
                                        className=" hover:text-slate-500"
                                        size={22}
                                        onClick={() => {
                                            this.deleteItem(item.id);
                                        }}
                                    ></MdDelete>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export default Devices;
