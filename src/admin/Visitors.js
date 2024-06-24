import axios from "axios";
import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { MdDelete, MdRefresh } from "react-icons/md";
import { server } from "../static";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@mui/material/Pagination";

class Visitors extends React.Component {
    visitorsUrl = "/api/admin/visitors/";
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
            iplist: [],
            urlParams: [],
            filterOpen: false,
            newStoreOpen: false,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Visitors";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        this.setState({ current_page: pageNumber });
        axios
            .get(
                server +
                    this.visitorsUrl +
                    "?page_size=" +
                    this.state.page_size +
                    "&page=" +
                    pageNumber,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ iplist: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    setData() {
        axios
            .get(
                server + "/api/admin/visitors/?page=" + this.state.current_page,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ last_page: Number(resp.data.last_page) });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ iplist: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    deleteItem(id) {
        const result = window.confirm("Bozmaga ynamynyz barmy?");
        if (result === false) {
            return null;
        }
        axios
            .post(
                server + "/api/admin/visitors/delete/" + id,
                {},
                {
                    auth: this.state.auth,
                }
            )
            .then((resp) => {
                this.setData();
            });
    }

    render() {
        return (
            <div className="vistors">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex items-center">
                    <label>
                        Myhmanlar
                        {this.state.isLoading && (
                            <span className="loader">
                                {" "}
                                - Maglumat ýüklenýär... Garaşyň
                            </span>
                        )}
                    </label>
                    <MdRefresh
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        size={30}
                        className="hover:bg-slate-300 rounded-md p-1"
                    ></MdRefresh>
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={Number(this.state.last_page)}
                    variant="outlined"
                    shape="rounded"
                />

                <table className="text-slate-600 w-full text-[12px]">
                    <tr className="bg-slate-200">
                        <th>IP</th>
                        <th>device_id</th>
                        <th>App version</th>
                        <th>TIME</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th></th>
                    </tr>
                    {this.state.iplist.map((item) => {
                        return (
                            <tr className="hover:bg-slate-100">
                                <td>{item.ip}</td>
                                <td>{item.device_id}</td>
                                <td>{item.app_version}</td>
                                <td>{item.created_at}</td>
                                <td>{item.browser}</td>
                                <td>{item.os}</td>
                                <td>
                                    <MdDelete
                                        className="hover:text-slate-500"
                                        size={25}
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

export default Visitors;
