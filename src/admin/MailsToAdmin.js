import axios from "axios";
import React from "react";
import { MdRefresh, MdTimer } from "react-icons/md";
import { server } from "../static";
import { CircularProgress, Pagination } from "@mui/material";
import { BiCalendar, BiSupport, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

class MailsToAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            urlParams: [],
            filterOpen: false,
            newStoreOpen: false,
            mails: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Mail to Admin";
        this.setData();
    }

    setData() {
        axios
            .get(server + "/api/adm/mails/?page=" + this.state.current_page, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ mails: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(server + "/api/adm/mails?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ mails: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    delete(id) {
        if (window.confirm("Delete?") === false) {
            return null;
        }

        axios
            .post(
                server + "/api/adm/mails/delete/" + id,
                {},
                {
                    auth: this.state.auth,
                }
            )
            .then((resp) => {
                toast.success("Bozuldy");
                this.setData();
            });
    }

    render() {
        return (
            <div className="mails">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex items-center">
                    <label>
                        Mails {this.state.total}
                        {this.state.isLoading && (
                            <CircularProgress></CircularProgress>
                        )}
                    </label>
                    <button
                        className="text-[12px] rounded-md p-1 m-1 bg-slate-200"
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <MdRefresh size={25}></MdRefresh>
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
                <div className="grid max-w-[600px] mx-auto">
                    {this.state.mails.map((item) => {
                        const date = String(item.created_at).split("T")[0];
                        const time = String(item.created_at)
                            .split("T")[1]
                            .substring(0, 5);
                        return (
                            <div
                                className="rounded-lg my-2 p-2 bg-slate-100 grid shadow-md border text-[12px]
                                grid-cols-[auto_max-content] hover:shadow-lg duration-150 hover:bg-sky-50"
                            >
                                <div>
                                    <label>{item.msg}</label>
                                    <div className="flex items-center">
                                        <BiCalendar></BiCalendar>
                                        <label>{date}</label>
                                        <MdTimer></MdTimer>
                                        <label>{time}</label>
                                    </div>
                                    <div className="flex flex-wrap">
                                        <Link
                                            className="flex items-center mx-2 bg-sky-600 text-white p-1 rounded-md"
                                            to={
                                                "/superuser/devices/" +
                                                item.device_id
                                            }
                                        >
                                            Chat
                                        </Link>
                                        <button
                                            onClick={() => {
                                                this.delete(item.id);
                                            }}
                                            className="flex items-center mx-2 bg-sky-600 text-white p-1 rounded-md"
                                        >
                                            Bozmak
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {item.sender === "admin" ? (
                                        <BiSupport size={25}></BiSupport>
                                    ) : (
                                        <BiUser size={25}></BiUser>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default MailsToAdmin;
