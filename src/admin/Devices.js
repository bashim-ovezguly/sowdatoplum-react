import axios from "axios";
import React from "react";
import { MdDelete, MdRefresh } from "react-icons/md";
import { server } from "../static";
import { CircularProgress, Pagination } from "@mui/material";

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
                server + "/api/admin/devices/?page=" + this.state.current_page,
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
            .delete(server + "/api/admin/devices/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: false });
            });
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(
                server + "/api/admin/devices?page=" + pageNumber,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ deviceList: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="vistors grid">
                <h3>
                    Devices {this.state.total}
                    {this.state.isLoading && (
                        <CircularProgress></CircularProgress>
                    )}
                </h3>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="flex items-center"
                    >
                        <label>Täzelemek</label>
                        <MdRefresh className="icon"></MdRefresh>
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
                    <tr className="text-left ">
                        <th>ID</th>
                        <th>App version</th>
                        <th>Code</th>
                        <th>Registered at</th>
                        <th>Last seen</th>
                        <th>Customer</th>
                        <th>IP</th>
                        <th>Hereketler</th>
                    </tr>
                    {this.state.deviceList.map((item) => {
                        return (
                            <tr
                                className="hover:bg-slate-100"
                                onClick={() => {
                                    window.location.href =
                                        "/admin/devices/" + item.code;
                                }}
                            >
                                <td>{item.id}</td>
                                <td>{item.app_version}</td>
                                <td>{item.code}</td>
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
                                        className=""
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
