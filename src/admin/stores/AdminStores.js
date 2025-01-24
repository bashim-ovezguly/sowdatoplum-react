import axios from "axios";
import React from "react";
import { MdClose, MdRefresh, MdSearch } from "react-icons/md";
import { adminStoresUrl, server } from "../../static";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BiPlus } from "react-icons/bi";
import ProgressIndicator from "../ProgressIndicator";

class Stores extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            current_page: 1,
            last_page: 1,
            total: 0,
            stores: [],
            url_params: {},
            filterOpen: false,
            newStoreOpen: false,
            categories: [],
            sizes: [],
            trade_centers: [],
            page_size: 50,

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Accounts";
        this.setData();
    }

    setPage(pageNumber) {
        console.log(pageNumber);

        this.setState({ current_page: pageNumber });
        this.setState({ isLoading: true });
        axios
            .get(
                adminStoresUrl +
                    "?page_size=" +
                    this.state.page_size +
                    "&page=" +
                    pageNumber,
                this.state.headers
            )
            .then((resp) => {
                this.setState({ stores: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    refreshToken() {
        axios
            .get(server + "/api/admin/customers?page=", this.state.auth)
            .then((resp) => {
                this.setState({ stores: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    newStoreModal() {
        if (this.state.newStoreOpen === false) {
            return null;
        }

        return (
            <div
                style={{ zIndex: 100 }}
                className="newStore absolute bg-white rounded-lg m-2 left-0 right-0 max-w-[400px] p-2 mx-auto grid border shadow-md "
            >
                <MdClose
                    className="rounded-full bg-slate-200"
                    onClick={() => {
                        this.setState({ newStoreOpen: false });
                    }}
                    size={25}
                ></MdClose>
                <h3>Täze Store</h3>
                <input placeholder="Ady" id="newStoreName"></input>

                <button
                    className=" bg-green-600 rounded-md p-2 my-2 text-white"
                    onClick={() => {
                        this.saveNewStore();
                    }}
                >
                    Goşmak
                </button>
            </div>
        );
    }

    saveNewStore() {
        var formdata = new FormData();

        this.setState({ isLoading: true });
        this.setState({ newStoreOpen: false });

        formdata.append(
            "name_tm",
            document.getElementById("newStoreName").value
        );
        formdata.append("name", document.getElementById("newStoreName").value);

        axios
            .post(adminStoresUrl, formdata, { auth: this.state.headers.auth })
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    setData() {
        let params = {
            page: this.state.current_page,
            page_size: this.state.page_size,
        };

        axios.get(server + "/index/store").then((resp) => {
            this.setState({
                categories: resp.data.categories,
                centers: resp.data.trade_centers,
            });
        });

        axios
            .get(adminStoresUrl, {
                params: params,
                auth: this.state.headers.auth,
            })
            .then((resp) => {
                this.setState({
                    stores: resp.data.data,
                    last_page: resp.data.last_page,
                    page_size: resp.data.page_size,
                    total: resp.data.total,
                    isLoading: false,
                });
            })
            .catch((err) => {
                console.log(err);

                if (err.response.status === 403) {
                    window.location.href = "/superuser/login";
                }
            });
    }

    setFilter() {
        this.setState({ isLoading: true });
        let params = {
            name: document.getElementById("filter_name").value,
            // status: document.getElementById("filter_status").value,
            // category: document.getElementById("filter_category").value,
            page_size: this.state.page_size,
        };

        axios
            .get(adminStoresUrl, {
                params: params,
                auth: this.state.headers.auth,
            })
            .then((resp) => {
                this.setState({
                    stores: resp.data.data,
                    last_page: resp.data.last_page,
                    page_size: resp.data.page_size,
                    total: resp.data.total,
                    isLoading: false,
                });
            });
    }

    render() {
        return (
            <div className="stores grid">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <div className="flex items-center">
                    <h3 className="font-bold text-lg">
                        Dükanlar {this.state.total}{" "}
                    </h3>
                    <button
                        className="m-1 hover:bg-slate-200 border rounded-md duration-200 p-1"
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <MdRefresh size={20}></MdRefresh>
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ newStoreOpen: true });
                        }}
                        className="m-1 hover:bg-slate-200 border rounded-md duration-200 p-1"
                    >
                        <BiPlus size={20}></BiPlus>
                    </button>

                    <div className="flex flex-wrap items-center text-[12px]">
                        <input
                            id="filter_name"
                            type="search"
                            placeholder="Ady boýunça gözleg"
                            className="p-1 m-0"
                        ></input>

                        <button className="m-1 hover:bg-slate-200 border rounded-md duration-200 p-1">
                            <MdSearch
                                size={20}
                                onClick={() => {
                                    this.setFilter();
                                }}
                            ></MdSearch>
                        </button>
                    </div>
                </div>

                {/* <div
                    id="filter_category"
                    className="p-1 flex items-center whitespace-nowrap overflow-x-auto"
                >
                    <button className="rounded-md bg-slate-200 mx-1 px-2 hover:bg-slate-300 p-1 m-1">
                        Hemmesi
                    </button>
                    {this.state.categories.map((item) => {
                        return (
                            <button className="rounded-md bg-slate-200 mx-1 px-2 hover:bg-slate-300 p-1 m-1 text-slate-600">
                                {item.name_tm}
                            </button>
                        );
                    })}
                </div> */}

                {this.newStoreModal()}

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-center">
                    {this.state.stores.map((item, index) => {
                        return (
                            <Link
                                to={String(item.id)}
                                key={item.id}
                                className="grid w-[80px] h-max text-[10px] hover:shadow-2xl border shadow-md
                                rounded-md overflow-hidden m-2 duration-200"
                            >
                                {item.logo !== "" && (
                                    <img
                                        className=" w-full h-[80px] object-cover"
                                        alt=""
                                        src={server + item.logo}
                                    ></img>
                                )}
                                {item.logo === "" && (
                                    <img
                                        className=" w-full h-[80px] object-cover"
                                        alt=""
                                        src={"/default.png"}
                                    ></img>
                                )}
                                <div className="text grid h-max p-1 my-auto">
                                    <label className="line-clamp-1">
                                        {item.name}
                                    </label>
                                    {item.status === "pending" && (
                                        <label className="line-clamp-1 text-orange-600">
                                            Private
                                        </label>
                                    )}
                                    {item.status === "accepted" && (
                                        <label className="line-clamp-1 text-green-600">
                                            Public
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

export default Stores;
