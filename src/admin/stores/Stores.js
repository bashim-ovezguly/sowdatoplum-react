import axios from "axios";
import React from "react";
import { BiMap, BiPlus } from "react-icons/bi";
import { MdPerson, MdRefresh, MdSearch } from "react-icons/md";
import { server } from "../../static";
import Pagination from "@mui/material/Pagination";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class Stores extends React.Component {
    storesUrl = "/api/admin/stores/";
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
            url_params: [],
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

        document.title = "Stores";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(
                server +
                    this.storesUrl +
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
            <div className="newStore absolute bg-white rounded-md p-2 mx-auto">
                <h3>Täze Store</h3>
                <div className="fields">
                    <label>Ady</label>
                    <input id="newStoreName"></input>
                </div>

                <button
                    onClick={() => {
                        this.saveNewStore();
                    }}
                >
                    Goşmak
                </button>
                <button
                    onClick={() => {
                        this.setState({ newStoreOpen: false });
                    }}
                >
                    Ýapmak
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

        axios
            .post(server + "/mob/stores", formdata)
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    setData() {
        axios.get(server + "/mob/index/store").then((resp) => {
            this.setState({
                categories: resp.data.categories,
                centers: resp.data.trade_centers,
            });
        });

        axios
            .get(server + this.storesUrl + "?page=" + this.state.current_page, {
                params: this.state.url_params,
                auth: this.state.headers.auth,
            })
            .then((resp) => {
                this.setState({ stores: resp.data.data });
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

    render() {
        return (
            <div className="stores">
                <h3>Dükanlar {this.state.total} </h3>

                <div className="flex flex-wrap items-center text-[12px]">
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <MdRefresh
                            size={25}
                            className="m-1 hover:bg-slate-200 rounded-md"
                        ></MdRefresh>
                    </button>

                    <BiPlus
                        size={25}
                        className="m-1 hover:bg-slate-200 rounded-md"
                        onClick={() => {
                            this.setState({ newStoreOpen: true });
                        }}
                    ></BiPlus>

                    <input
                        id="filter_name"
                        type="search"
                        placeholder="Ady boýunça gözleg"
                    ></input>

                    <select id="filter_status">
                        <option value={"all"}>Hemmesi</option>
                        <option value={"pending"}> Garaşylýanlar</option>
                        <option value={"accepted"}>Kabul edilenler</option>
                        <option value={"canceled"}>Gaýtarlanlar</option>
                    </select>

                    <select id="filter_category">
                        <option value={""}>Hemmesi</option>
                        {this.state.categories.map((item) => {
                            return (
                                <option value={item.id}>{item.name_tm}</option>
                            );
                        })}
                    </select>

                    <MdSearch
                        className="w-7 h-7"
                        onClick={() => {
                            this.setFilter();
                        }}
                    ></MdSearch>
                </div>

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

                {this.state.isLoading && <CircularProgress></CircularProgress>}
                <div className="flex flex-wrap justify-center">
                    {this.state.stores.map((item, index) => {
                        return (
                            <Link
                                to={"/admin/stores/" + item.id}
                                key={item.id}
                                className="grid grid-cols-[max-content_auto] hover:bg-slate-200 h-max p-2 rounded-lg overflow-hidden w-[300px] content-center"
                            >
                                <img
                                    className="h-[100px] w-[100px] object-cover rounded-full border"
                                    alt=""
                                    src={server + item.img}
                                ></img>
                                <div className="text grid h-max p-2 text-[12px] my-auto">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>
                                    {/* <label className="flex items-center">
                                        {" "}
                                        <BiMap></BiMap> {item.location.name}
                                    </label> */}
                                    {}

                                    {/* <div className="flex items-center">
                                        <MdPerson></MdPerson>
                                        <label>
                                            {item.customer.name}{" "}
                                            {item.customer_phone}
                                        </label>
                                    </div> */}
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
