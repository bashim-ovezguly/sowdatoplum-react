import React from "react";
import { BiPlus } from "react-icons/bi";
import { MdCheck, MdDelete, MdSort } from "react-icons/md";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { server } from "../../static";
import axios from "axios";
import AdminProductAdd from "./AdminProductAdd";
import ProgressIndicator from "../ProgressIndicator";

class AdminStoreProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locations: [],
            all_locations: [],
            isLoading: false,
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
            products: [],
            page_size: 50,

            add_product_open: false,

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };
        this.setData();
    }

    setProductsPage(pageNumber) {
        axios
            .get(
                server +
                    "/api/adm/products?store=" +
                    this.state.id +
                    "&page=" +
                    pageNumber,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ products_last_page: resp.data.last_page });
            });
    }

    setData() {
        const pathname = window.location.pathname;
        var id = pathname.split("/")[3];

        axios
            .get(server + "/api/adm/products?store=" + id, {
                auth: this.state.headers.auth,
            })
            .then((resp) => {
                this.setState({ products: resp.data.data, store_id: id });
            });
    }

    deleteProduct(id) {
        let result = window.confirm("Bozmaga ynamyňyz barmy");
        if (result === true) {
            axios
                .post(
                    server + "/mob/products/delete/" + id,
                    {},
                    { auth: this.state.auth }
                )
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
        }
    }

    render() {
        return (
            <div className="stores">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <AdminProductAdd
                    store_id={this.state.store_id}
                    parent={this}
                    open={this.state.add_product_open}
                ></AdminProductAdd>
                <div className="grid ">
                    <div className="flex items-center text-[11px] my-2">
                        <button
                            className="flex items-center  border rounded-full px-2 bg-sky-600 text-white m-1 "
                            onClick={() => {
                                this.setState({ add_product_open: true });
                            }}
                        >
                            <BiPlus className=" mr-1 " size={25}></BiPlus>
                            <label>Haryt goşmak</label>
                        </button>
                    </div>

                    <Pagination
                        className="pagination"
                        onChange={(event, page) => {
                            this.setProductsPage(page);
                        }}
                        count={this.state.products_last_page}
                        variant="outlined"
                        shape="rounded"
                    />

                    <div className=" bg-white overflow-y-auto text-[12px] flex flex-wrap">
                        {this.state.products.map((item) => {
                            return (
                                <div className="shadow-md w-[150px] grid border m-2 rounded-lg  overflow-hidden relative">
                                    <Link to={"/superuser/products/" + item.id}>
                                        <img
                                            className="w-full h-[120px] object-cover border overflow-hidden"
                                            alt=""
                                            defaultValue={"/default.png"}
                                            src={server + item.img}
                                        ></img>
                                    </Link>
                                    <div className="grid px-1">
                                        <label className="font-bold">
                                            {item.name}
                                        </label>
                                        <label className="absolute top-1 left-1 bg-sky-600 px-1 text-white rounded-md">
                                            {item.price} TMT
                                        </label>
                                        <label className="text-[10px]">
                                            {item.category.name}
                                        </label>
                                        {item.status === "accepted" && (
                                            <label className="bg-green-600 text-white rounded-full px-2 w-max text-[10px]">
                                                Kabul edilen
                                            </label>
                                        )}

                                        {item.status === "pending" && (
                                            <label className="bg-orange-600 text-white rounded-full px-2 w-max text-[10px]">
                                                Garaşylýar
                                            </label>
                                        )}
                                        <div className="grid grid-cols-2 items-center text-slate-700 text-center">
                                            <button
                                                className="rounded-md hover:bg-slate-200 m-1 flex justify-center text-center border"
                                                onClick={() => {
                                                    this.deleteProduct(item.id);
                                                }}
                                            >
                                                <MdDelete size={18}></MdDelete>
                                            </button>
                                            <button className="rounded-md hover:bg-slate-200 m-1 flex justify-center border">
                                                <MdCheck size={18}></MdCheck>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminStoreProducts;
