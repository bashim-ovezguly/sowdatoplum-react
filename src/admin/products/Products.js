import axios from "axios";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { server } from "../../static";
import {
    MdCheck,
    MdDelete,
    MdPerson,
    MdRefresh,
    MdSearch,
} from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Products extends React.Component {
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
            newProductOpen: false,

            uploadedFileSize: 0,
            categories: [],

            products: [],

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
                    "/api/admin/products?page_size=50&page=" +
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

    // setFilter(){

    //     let params={
    //         'name':document.getElementById('filter_name').value,
    //         'status':document.getElementById('filter_check_state').value,
    //         'category': document.getElementById('filter_category').value,
    //     };

    //     window.location.href = '/admin/stores'

    //     this.setState({url_params : params, current_page:1}, ()=>{
    //         this.setData()
    //     })

    // }

    deleteProduct(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true) {
            axios.post(server + "/mob/products/delete/" + id).then((resp) => {
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

    newProductModal() {
        if (this.state.newProductOpen === false) {
            return null;
        }
        return (
            <div className="newProduct_modal">
                <h3>Täze haryt</h3>
                <div className="newProduct_fields">
                    <div>
                        <input id="active" type="checkbox"></input>{" "}
                        <label>Aktiw</label>
                    </div>

                    <label>Ady</label>
                    <input id="new_product_name" type="text"></input>

                    <label>Dükany</label>
                    <select id="store">
                        <option value=""></option>
                        {this.state.stores.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>

                    <input
                        onChange={() => {
                            this.onSelectImages();
                        }}
                        id="imgSelector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>
                    <label>Size: {this.state.uploadedFileSize} KB</label>
                </div>
                <div>
                    <button
                        onClick={() => {
                            this.saveNewProduct();
                        }}
                    >
                        Goşmak
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ newProductOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
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
            .post(server + "/api/admin/products", formdata, {
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
        let params = {
            name_tm: document.getElementById("filter_name").value,
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
            .put(server + "/api/admin/products/" + id + "/", fdata, {
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
            .get(server + "/api/admin/products?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ products: resp.data.data });
            });
    }

    render() {
        return (
            <div className="products">
                <ToastContainer />
                {this.newProductModal()}

                <h3 className="text-2xl">
                    Harytlar {this.state.total}
                    <div className="downloader">
                        {this.state.isLoading && (
                            <CircularProgress></CircularProgress>
                        )}
                    </div>
                </h3>

                <div className="flex flex-wrap">
                    <button
                        onClick={() => {
                            this.setState({ newProductOpen: true });
                        }}
                        className="add"
                    >
                        <BiPlus
                            size={25}
                            className="text-slate-400 hover:bg-slate-200 rounded-md"
                        ></BiPlus>
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="add"
                    >
                        <MdRefresh
                            size={25}
                            className="text-slate-400 hover:bg-slate-200 rounded-md"
                        ></MdRefresh>
                    </button>

                    <input
                        onChange={() => {
                            this.setFilter();
                        }}
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

                <div className="products flex flex-wrap justify-center">
                    {this.state.products.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="item  grid grid-rows-[max-content_auto] border text-slate-600
                                w-[200px] sm:w-[150px] m-2 overflow-hidden shadow-md rounded-md hover:shadow-lg duration-200"
                            >
                                <Link to={"/admin/products/" + item.id}>
                                    {item.img === "" ? (
                                        <img
                                            alt=""
                                            className="w-full h-[200px] sm:h-[100px] object-cover"
                                            src="/default.png'"
                                        ></img>
                                    ) : (
                                        <img
                                            alt=""
                                            className="w-full h-52 object-cover"
                                            src={server + item.img}
                                        ></img>
                                    )}
                                </Link>

                                <div className="text grid p-2 h-max">
                                    <label className="name font-bold">
                                        {item.name_tm}
                                    </label>
                                    <label className="price font-bold text-sky-600">
                                        {item.price} TMT
                                    </label>

                                    {item.status === "accepted" ? (
                                        <label className="text-green-600">
                                            Barlanan
                                        </label>
                                    ) : (
                                        ""
                                    )}
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
                                        <AiOutlineShop></AiOutlineShop>
                                        <label className="store text-[12px]">
                                            {item.store_name}
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <MdPerson></MdPerson>
                                        <label className="customer text-[12px]">
                                            {item.customer}
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <button
                                            onClick={() => {
                                                this.deleteProduct(item.id);
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

export default Products;
