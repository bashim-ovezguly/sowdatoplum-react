import axios from "axios";
import React from "react";
import { BiCalendar } from "react-icons/bi";
import {
    MdCancel,
    MdCheck,
    MdDelete,
    MdDone,
    MdPerson,
    MdRefresh,
} from "react-icons/md";
import { server } from "../../static";
import Pagination from "@mui/material/Pagination";
import ProgressIndicator from "../ProgressIndicator";

class LentaAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            page_size: "",
            current_page: 1,
            last_page: 1,
            total: 0,
            datalist: [],
            url_params: [],
            filterOpen: false,

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Lenta";
        this.setData();
    }

    setPage(pageNumber) {
        axios
            .get(server + "/api/adm/lenta?page=" + pageNumber, this.state.auth)
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
            });
    }

    setData() {
        axios
            .get(server + "/api/adm/lenta?page=" + this.state.current_page, {
                params: this.state.url_params,
                auth: this.state.auth.auth,
            })
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ isLoading: false });
            });
    }

    setFilter() {
        let params = {
            name_tm: document.getElementById("filter_name").value,
            status: document.getElementById("filter_status").value,
            category: document.getElementById("filter_category").value,
        };

        this.setState({ url_params: params, current_page: 1 }, () => {
            this.setData();
        });
    }

    onSearchButtonClick() {
        this.setFilter();
    }

    cancelItem(item) {
        let formdata = new FormData();
        formdata.append("active", "False");
        formdata.append("customer", item.customer.id);
        axios
            .put(
                server + "/api/adm/lenta/" + item.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    acceptItem(item) {
        let formdata = new FormData();
        formdata.append("active", "True");
        formdata.append("customer", item.id);
        axios
            .put(
                server + "/api/adm/lenta/" + item.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    deleteItem(item) {
        let result = window.confirm("Bozmaga ynamyňyz barmy");
        if (result == true) {
            axios
                .delete(server + "/api/adm/lenta/" + item.id, this.state.auth)
                .then((resp) => {
                    this.setData();
                });
        }
    }

    render() {
        return (
            <div className="lenta p-2">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <div className="flex items-center">
                    <label className="text-base font-bold">
                        Lenta ({this.state.total} sany)
                    </label>

                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <MdRefresh
                            size={20}
                            className="hover:bg-slate-200 rounded-md"
                        ></MdRefresh>
                    </button>
                </div>

                <Pagination
                    className="mx-auto m-3"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-center">
                    {this.state.datalist.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="rounded-md h-max shadow-lg w-[300px] text-[12px] m-2 grid p-2 border relative"
                            >
                                <div className="flex items-center">
                                    <MdPerson></MdPerson>
                                    <label className="flex items-center font-bold mx-2">
                                        {item.store.name}
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center ">
                                        <BiCalendar></BiCalendar>{" "}
                                        {item.created_at}
                                    </label>
                                    {item.active === "True" && (
                                        <MdCheck
                                            size={18}
                                            className="bg-green-600 ml-2 rounded-full text-white absolute top-1 right-1 w-max"
                                        ></MdCheck>
                                    )}
                                    {item.active === "False" && (
                                        <MdCancel
                                            size={18}
                                            className="bg-red-600 ml-2 rounded-full text-white absolute top-1 right-1 w-max"
                                        ></MdCancel>
                                    )}
                                </div>

                                <img
                                    alt=""
                                    className="w-full h-[200px] object-cover overflow-hidden border my-1 rounded-md"
                                    src={server + item.images[0].img}
                                ></img>

                                <div>
                                    <p className="text-[12px]">{item.text}</p>
                                    <div className="flex  items-center my-1">
                                        <button
                                            className="flex items-center bg-slate-200 mr-1 border rounded-full px-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.acceptItem(item);
                                            }}
                                        >
                                            <MdDone></MdDone>
                                            <label>Kabul etmek</label>
                                        </button>
                                        <button
                                            className="flex items-center bg-slate-200 mr-1 border rounded-full px-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.cancelItem(item);
                                            }}
                                        >
                                            <MdCancel></MdCancel>{" "}
                                            <label>Gaýtarmak</label>
                                        </button>
                                        <button
                                            className="flex items-center bg-slate-200 mr-1 border rounded-full px-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.deleteItem(item);
                                            }}
                                        >
                                            <MdDelete></MdDelete>{" "}
                                            <label>Bozmak</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default LentaAdmin;
