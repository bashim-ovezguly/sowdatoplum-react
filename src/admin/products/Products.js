import axios from "axios";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { server } from "../../static";
import { MdCheck, MdDelete, MdRefresh, MdSearch } from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressIndicator from "../ProgressIndicator";

class AdminProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],

            statuses: [],
            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            urlParams: [],
            locationSelectorOpen: false,
            loadingLocation: false,

            filterOpen: false,
            newProductOpen: true,

            uploadedFileSize: 0,
            categories: [],

            products: [],
            stores: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Harytlar";
        this.setData();
    }

    setData() {
        axios.get(server + "/mob/index/stores/all").then((resp) => {
            this.setState({ stores: resp.data });
        });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
        });

        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({ categories: resp.data["categories"] });
            this.setState({ units: resp.data["units"] });
            this.setState({ countries: resp.data["countries"] });
            this.setState({ brands: resp.data["brands"] });
            this.setState({ units: resp.data["units"] });
        });

        axios
            .get(
                server +
                    "/api/adm/products?page_size=50&page=" +
                    this.state.current_page,
                { params: this.state.url_params, auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ products: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    deleteProduct(item) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true) {
            axios
                .post(server + "/mob/products/delete/" + item.id)
                .then((resp) => {
                    var array = this.state.products;
                    var index = array.indexOf(item);
                    array.splice(index, 1);
                    this.setState({ products: array });
                    this.setData();
                });
        }
    }

    onSelectImages() {
        var files = document.getElementById("imgSelector").files;
        var t = [];
        let totalSize = 0;

        for (let i = 0; i < files.length; i++) {
            totalSize = totalSize + files[i].size;
        }

        this.setState({ uploadedFileSize: Math.floor(totalSize / 1024) });
    }

    saveNewProduct() {
        this.setState({ isLoading: true });
        this.setState({ newProductOpen: false });
        var formdata = new FormData();

        if (document.getElementById("active").checked) {
            formdata.append("active", true);
        } else {
            formdata.append("active", false);
        }

        let images = document.getElementById("imgSelector").files;
        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        if (document.getElementById("store").value != "") {
            formdata.append("store", document.getElementById("store").value);
        }

        if (document.getElementById("new_product_name").value != "") {
            formdata.append(
                "name_tm",
                document.getElementById("new_product_name").value
            );
        }

        axios
            .post(server + "/api/adm/products/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.state.setData();
                toast.success("Haryt goşuldy");
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    setFilter() {
        this.setState({ isLoading: true });
        let params = {
            name: document.getElementById("filter_name").value,
            status: document.getElementById("filter_status").value,
        };
        this.setState({ url_params: params, current_page: 1 }, () => {
            this.setData();
        });
    }

    onSearchButtonClick() {
        this.setFilter();
    }

    changeStatus(id, statusValue) {
        var fdata = new FormData();
        this.setState({ isLoading: true });

        fdata.append("status", statusValue);
        this.setState({ isLoading: true });
        axios
            .put(server + "/api/adm/products/" + id + "/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                this.setData();
                if (statusValue === "accepted") {
                    toast.success("Haryt kabul edildi");
                }
            });
    }

    setPage(pageNumber) {
        axios
            .get(server + "/api/adm/products?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ products: resp.data.data });
            });
    }

    render() {
        return (
            <div className="products p-2 text-[12px]">
                <ToastContainer autoClose={5000} closeOnClick={true} />
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <div className="flex items-center flex-wrap">
                    <h3 className="text-[18px] font-bold">
                        Harytlar ({this.state.total} sany)
                    </h3>
                    <button
                        onClick={() => {
                            this.setState({ newProductOpen: true });
                        }}
                        className="p-1 text-slate-400 hover:bg-slate-200 border ml-1 rounded-md"
                    >
                        <BiPlus size={20} className=""></BiPlus>
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="p-1 text-slate-400 hover:bg-slate-200 border ml-1 rounded-md"
                    >
                        <MdRefresh size={20} className=""></MdRefresh>
                    </button>
                    <select className="mx-1" id="filter_status">
                        <option value={"all"}>Hemmesi</option>
                        <option value={"pending"}> Garaşylýanlar</option>
                        <option value={"accepted"}>Kabul edilenler</option>
                        <option value={"canceled"}>Gaýtarlanlar</option>
                    </select>

                    <select className="mx-1" id="filter_category">
                        <option value={""}>Hemmesi</option>
                        {this.state.categories.map((item) => {
                            return (
                                <option value={item.id}>{item.name_tm}</option>
                            );
                        })}
                    </select>
                    <input
                        onChange={() => {
                            this.setFilter();
                        }}
                        id="filter_name"
                        type="search"
                        placeholder="Ady boýunça gözleg"
                    ></input>
                    <button
                        onClick={() => {
                            this.setFilter();
                        }}
                    >
                        <MdSearch
                            className="text-slate-400 hover:bg-slate-200 rounded-md"
                            size={25}
                        ></MdSearch>
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

                <div className="flex flex-wrap justify-center">
                    {this.state.products.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="item text-[12px] grid grid-rows-[max-content_auto] border 
                                text-slate-600 p-2
                                w-[120px] m-2 overflow-hidden rounded-md shadow-md"
                            >
                                <Link to={"/superuser/products/" + item.id}>
                                    {item.img === "" ? (
                                        <img
                                            alt=""
                                            className="w-full h-[120px] sm:h-[100px] object-contain border"
                                            src="/default.png'"
                                        ></img>
                                    ) : (
                                        <img
                                            alt=""
                                            className="w-full h-[120px] object-cover"
                                            src={server + item.img}
                                        ></img>
                                    )}
                                </Link>

                                <div className="text grid p-1 h-max">
                                    <label className="name line-clamp-1">
                                        {item.name}
                                    </label>

                                    <label className="price rounded-md text-sky-600">
                                        {item.price} TMT
                                    </label>

                                    {item.status === "pending" ? (
                                        <label className="text-orange-600">
                                            Garaşylýar
                                        </label>
                                    ) : (
                                        ""
                                    )}
                                    {item.status === "canceled" ? (
                                        <label className="text-red-600">
                                            Gaýtarlan
                                        </label>
                                    ) : (
                                        ""
                                    )}

                                    <div className="flex items-center">
                                        <AiOutlineShop
                                            size={18}
                                        ></AiOutlineShop>
                                        <label className="store text-[12px] line-clamp-1">
                                            {item.store.name}
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2">
                                        <button
                                            onClick={() => {
                                                this.deleteProduct(item);
                                            }}
                                        >
                                            <MdDelete
                                                className="p-1 text-slate-600 w-full rounded-md border hover:bg-slate-200"
                                                size={25}
                                            ></MdDelete>
                                        </button>
                                        <button>
                                            <MdCheck
                                                className="p-1 text-slate-600 w-full rounded-md border hover:bg-slate-200"
                                                size={25}
                                                onClick={() => {
                                                    this.changeStatus(
                                                        item.id,
                                                        "accepted"
                                                    );
                                                }}
                                            ></MdCheck>
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

export default AdminProducts;
