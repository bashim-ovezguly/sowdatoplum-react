import axios from "axios";
import React from "react";
import {
    BiCheck,
    BiLeftArrow,
    BiLock,
    BiMap,
    BiPlus,
    BiRightArrow,
} from "react-icons/bi";
import { server } from "../../static";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import Loader from "../../client/components/Loader";
import { MdPerson, MdRefresh, MdSearch } from "react-icons/md";

class Customers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            statuses: [],
            current_page: 1,
            last_page: "",
            total: "",
            customers: [],
            filterOpen: false,
            newCustomerOpen: false,
            url_params: [],
            pageSize: 20,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Ulanyjylar";
        this.init();
    }

    init() {
        this.setState({ isLoading: true });
        axios
            .get(server + "/api/admin/customers/", {
                auth: this.state.auth,
                params: { page_size: this.state.pageSize.toString() },
            })
            .then((resp) => {
                this.setState({ locations: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ customers: resp.data.data });
            });
    }

    setFilter() {
        let params = {
            name: document.getElementById("filter_name").value,
        };

        this.setState({ url_params: params, current_page: 1 }, () => {
            this.init();
        });
    }

    edit() {
        var fdata = new FormData();
        fdata.append("name_tm", document.getElementById("edit_name").value);
        fdata.append("parent", document.getElementById("parent").value);
        fdata.append("status", document.getElementById("status").value);
        fdata.append("sort_order", document.getElementById("sort_order").value);
        fdata.append("active", document.getElementById("active").value);
        var id = document.getElementById("id").value;

        axios
            .put(
                server + "/api/admin/locations/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.init();
                this.close_edit_modal();
            });
    }

    delete(id) {
        var result = window.confirm("Bozmaga ynamyňyz barmy?");

        if (result === true) {
            axios
                .post(server + "/api/admin/customers/delete/" + id)
                .then((resp) => {
                    this.init();
                });
        }
    }

    newCustomerModal() {
        if (this.state.newCustomerOpen === false) {
            return null;
        }
        return (
            <div className="new-customer-modal modal">
                <h3>Täze satyjy</h3>
                <input id="name" placeholder="Satyjy ady"></input>
                <input
                    id="phone"
                    placeholder="Telefon belgisi"
                    type="number"
                    min={0}
                ></input>
                <input id="password" placeholder="Açar sözi"></input>
                <div>
                    <button
                        onClick={() => {
                            this.saveNewCustomer();
                        }}
                    >
                        Ýatda saklamak
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ newCustomerOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(server + "/api/admin/customers?page=" + pageNumber, {
                auth: this.state.auth,
                params: { page_size: this.state.pageSize },
            })
            .then((resp) => {
                this.setState({ customers: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="customers ">
                <Loader open={this.state.isLoading}></Loader>

                <div className="grid items-center">
                    <h3>Ulanyjylar {this.state.total} </h3>

                    <MdRefresh
                        onClick={() => {
                            this.init();
                        }}
                        className="add"
                        size={25}
                    ></MdRefresh>

                    <div className="flex items-center w-max">
                        <input
                            className="border"
                            id="filter_name"
                            placeholder="Ady ýa-da telefon belgisi..."
                        ></input>
                        <MdSearch
                            className="hover:bg-slate-200 duration-200 m-2 rounded-lg"
                            onClick={() => {
                                this.setFilter();
                            }}
                            size={30}
                        ></MdSearch>
                    </div>
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

                <div className="flex flex-wrap justify-center overflow-hidden">
                    {this.state.customers.map((item, index) => {
                        return (
                            <Link
                                to={"/admin/customers/" + item.id}
                                className="grid m-1 overflow-hidden hover:bg-slate-100 p-2 rounded-lg duration-200 max-w-[180px] text-[12px]"
                            >
                                <img
                                    className="w-[150px] max-w-none h-[150px] object-cover rounded-3xl border bg-slate-200"
                                    alt=""
                                    src={item.img_m}
                                ></img>

                                <div className="grid p-2">
                                    <label>{item.id}</label>
                                    <label> {item.name} </label>
                                    <label>{item.phone}</label>

                                    {item.verificated === "True" ? (
                                        <label className="text-green-500 font-bold">
                                            Verificated
                                        </label>
                                    ) : (
                                        <label className="text-red-500 font-bold">
                                            Not verificated
                                        </label>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Customers;
