import axios from "axios";
import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { MdDelete, MdRefresh } from "react-icons/md";
import { server } from "../static";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@mui/material/Pagination";
import ProgressIndicator from "./ProgressIndicator";

class Visitors extends React.Component {
    visitorsUrl = "/api/adm/visitors/";
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
                server + "/api/adm/visitors/?page=" + this.state.current_page,
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
                server + "/api/adm/visitors/delete/" + id,
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
            <div className="vistors p-2">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex items-center">
                    <label className="text-lg font-bold">
                        Myhmanlar
                        <ProgressIndicator
                            open={this.state.isLoading}
                        ></ProgressIndicator>
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

                <table className="text-slate-600 w-full text-[12px] border my-2">
                    <tr className="bg-slate-200">
                        <th>ID</th>
                        <th>TIME</th>
                        <th>IP</th>
                        <th>device_id</th>
                        <th>App version</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th></th>
                    </tr>
                    {this.state.iplist.map((item) => {
                        return (
                            <tr className="hover:bg-slate-100">
                                <td className="px-2 border-b m-1">{item.id}</td>
                                <td className="px-2 border-b m-1">
                                    {item.created_at}
                                </td>
                                <td className="px-2 border-b m-1">{item.ip}</td>
                                <td className="px-2 border-b m-1">
                                    {item.device_id}
                                </td>
                                <td className="px-2 border-b m-1">
                                    {item.app_version}
                                </td>

                                <td className="px-2 border-b m-1">
                                    {item.browser}
                                </td>
                                <td className="px-2 border-b m-1">{item.os}</td>
                                <td className="px-2 border-b m-1">
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
