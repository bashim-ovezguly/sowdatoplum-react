import axios from "axios";
import React from "react";
import { MdDelete, MdRefresh } from "react-icons/md";
import { server } from "../static";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@mui/material/Pagination";

class Log extends React.Component {
    visitorsUrl = "/api/adm/logs/";
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

        document.title = "Log";
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
            .get(server + "/api/adm/logs/?page=" + this.state.current_page, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ last_page: Number(resp.data.last_page) });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ iplist: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        var interval = setInterval(() => {
            this.setData();
        }, 10000);
        this.setState({ interval: interval });
    }

    deleteItem(id) {
        const result = window.confirm("Bozmaga ynamynyz barmy?");
        if (result === false) {
            return null;
        }
        axios
            .post(
                server + "/api/adm/logs/delete/" + id,
                {},
                {
                    auth: this.state.auth,
                }
            )
            .then((resp) => {
                this.setData();
                toast.success("Log bozuldy");
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
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
                        Logs
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
                    className="pagination my-2"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={Number(this.state.last_page)}
                    variant="outlined"
                    shape="rounded"
                />

                <table className="text-slate-600 w-full text-[12px]">
                    <tr className="bg-slate-200 ">
                        <th>ID</th>
                        <th>IP</th>
                        <th>CUSTOMER</th>
                        <th>TIME</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                    {this.state.iplist.map((item) => {
                        return (
                            <tr className="hover:bg-slate-100">
                                <td>{item.id}</td>
                                <td>{item.ip}</td>
                                <td>{item.customer}</td>
                                <td>{item.created_at}</td>
                                <td>{item.description}</td>
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

export default Log;
