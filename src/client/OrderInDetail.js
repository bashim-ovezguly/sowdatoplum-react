import axios from "axios";
import React from "react";
import { server } from "../static";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BsTrash } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";

class OrderInDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            products: [],
        };

        document.title = "Gelen sargyt";
        this.setData();
    }

    setData() {
        let orderID = window.location.pathname.split("/")[2];
        axios.get(server + "/mob/orders/" + orderID).then((resp) => {
            this.setState({
                isLoading: false,
                products: resp.data.data.products,
                order_id: resp.data.data.id,
                total: resp.data.data.total,
                address: resp.data.data.address,
                store: resp.data.data.store,
                note: resp.data.data.note,
                store_img: resp.data.data.store_img,
                delivery_price: resp.data.data.delivery_price,
                delivery_time: resp.data.data.delivery_time,
                status: resp.data.data.status,
            });
        });
    }

    increment(id, amount) {
        amount = amount + 1;
        let fdata = new FormData();
        fdata.append("amount", amount);
        axios
            .put(server + "/mob/orders/products/" + id, fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
            });
    }

    decrement(id, amount) {
        if (amount < 2) {
            return false;
        }
        amount = amount - 1;

        let fdata = new FormData();
        fdata.append("amount", amount);
        axios
            .put(server + "/mob/orders/products/" + id, fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
            });
    }

    deleteProduct(id) {
        let res = window.confirm("Bozmaga ynamyňyz barmy?");
        if (res === false) {
            return false;
        }

        let header = localStorage.getItem("user_access_token");

        axios
            .post(
                server + "/mob/orders/products/delete/" + id,
                {},
                { headers: header }
            )
            .then((resp) => {
                this.setData();
            });
    }

    deleteOrder(id) {
        let res = window.confirm("Sargydy bozmaga ynamyňyz barmy?");
        if (res === false) {
            return false;
        }

        let header = { token: localStorage.getItem("user_access_token") };

        axios
            .post(server + "/mob/orders/delete/" + id, {}, { headers: header })
            .then((resp) => {
                toast.success("Sargyt bozuldy");
                window.history.back();
            });
    }

    acceptOrder(id) {
        let formdata = new FormData();
        formdata.append("status", "accepted");
        let header = { token: localStorage.getItem("user_access_token") };

        axios
            .put(server + "/mob/orders/" + id, formdata, { headers: header })
            .then((resp) => {
                toast.success("Sargyt kabul edildi");
                this.setData();
            });
    }

    cancelOrder(id) {
        let fdata = new FormData();
        fdata.append("status", "cancel");
        let res = window.confirm("Sargydy gaýtarmaga ynamyňyz barmy?");
        if (res === false) {
            return false;
        }

        let header = { token: localStorage.getItem("user_access_token") };

        axios
            .put(server + "/mob/orders/" + id, fdata, { headers: header })
            .then((resp) => {
                toast.success("Sargyt gaýtaryldy");
            });
    }

    render() {
        return (
            <div className="p-2">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="grid border-b mb-2 ">
                    <label>Gelen sargyt {this.state.products.length} </label>
                </div>

                <div className="grid text-[12px] border-y py-1 my-1">
                    <div className="flex items-center border rounded-lg w-max p-1 px-2 bg-slate-100">
                        <img
                            className="w-[30px] h-[30px] rounded-full border object-cover "
                            alt=""
                            src={server + this.state.store_img}
                        ></img>
                        <label className="mx-2">{this.state.store}</label>
                    </div>
                    <label>Salgysy: {this.state.address}</label>
                    <label>Bellik: {this.state.note}</label>

                    <label>
                        Eltip bermeli wagty: {this.state.delivery_time}
                    </label>

                    <label>
                        Sargyt ýagdaýy:
                        {this.state.status === "pending" && (
                            <label className="font-bold text-orange-300 mx-2">
                                Garaşylýar
                            </label>
                        )}
                        {this.state.status === "accepted" && (
                            <label className="font-bold text-green-600 mx-2">
                                Kabul edilen
                            </label>
                        )}
                    </label>
                </div>

                <div className="flex items-center justify-end font-bold text-[16px]">
                    <label>Jemi: {this.state.total} TMT</label>
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid">
                    {this.state.products.map((item) => {
                        return (
                            <div
                                id={item.id}
                                className="grid grid-cols-[max-content_auto] bg-slate-100  overflow-hidden m-2 
                            rounded-lg border text-[12px] shadow-md"
                            >
                                <img
                                    alt=""
                                    className="w-[120px]  h-[120px] object-cover"
                                    src={server + item.img}
                                ></img>
                                <div className="grid p-2 sm:text-[11px] content-start h-max">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>

                                    <label>{item.price} TMT </label>

                                    {this.state.status === "pending" && (
                                        <div className="flex items-center">
                                            <BiMinus
                                                onClick={() => {
                                                    this.decrement(
                                                        item.id,
                                                        item.amount
                                                    );
                                                }}
                                                className="bg-yellow-600 text-white p-1 rounded-lg m-1 hover:bg-slate-400"
                                                size={25}
                                            ></BiMinus>
                                            <label className="mx-1 text-center">
                                                {item.amount} sany
                                            </label>
                                            <BiPlus
                                                onClick={() => {
                                                    this.increment(
                                                        item.id,
                                                        item.amount
                                                    );
                                                }}
                                                className="bg-yellow-600 text-white p-1 rounded-lg m-1 hover:bg-slate-400"
                                                size={25}
                                            ></BiPlus>

                                            <label className="mx-2"> </label>
                                        </div>
                                    )}

                                    {this.state.status === "pending" && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => {
                                                    this.deleteProduct(item.id);
                                                }}
                                                className="border rounded-lg m-1 flex items-center p-1 hover:bg-slate-200 w-max float-end"
                                            >
                                                <BsTrash></BsTrash>
                                                <label>Bozmak</label>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end items-center text-[14px]">
                    {this.state.status === "pending" && (
                        <button
                            onClick={() => {
                                this.cancelOrder(this.state.order_id);
                            }}
                            className="rounded-md p-1 bg-orange-300 text-white flex items-center hover:bg-slate-400 mx-1"
                        >
                            <BsTrash size={20}></BsTrash>

                            <label>Sargydy gaýtarmak</label>
                        </button>
                    )}

                    {this.state.status === "pending" && (
                        <button
                            onClick={() => {
                                this.acceptOrder(this.state.order_id);
                            }}
                            className="rounded-md p-1 bg-green-600 text-white flex items-center hover:bg-slate-400 mx-1"
                        >
                            {/* <BsTrash size={20}></BsTrash> */}
                            <label>Kabul etmek</label>
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default OrderInDetail;
