import axios from "axios";
import React from "react";
import { server } from "../../static";
import { CircularProgress } from "@mui/material";
import { BsTrash } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            orderDirection: "",

            deliveryPriceModalOpen: true,
            products: [],

            header: {
                token: localStorage.getItem("user_access_token"),
            },
        };

        document.title = "Sargyt";
        this.setData();
    }

    setData() {
        let orderID = window.location.pathname.split("/")[2];
        axios.get(server + "/orders/" + orderID).then((resp) => {
            this.setState({
                isLoading: false,
                products: resp.data.data.products,
                order_id: resp.data.data.id,
                id: resp.data.data.id,
                total: resp.data.data.total,
                address: resp.data.data.address,
                store: resp.data.data.store,
                note: resp.data.data.note,
                store_img: resp.data.data.store_img,
                delivery_price: resp.data.data.delivery_price,
                delivery_time: resp.data.data.delivery_time,
                status: resp.data.data.status,
                accepter_name: resp.data.data.accepter.name,
                accepter_id: resp.data.data.accepter.id,
                sender_id: resp.data.data.sender.id,
                sender_name: resp.data.data.sender.name,
                accepter: resp.data.data.accepter,
            });

            if (
                resp.data.data.sender.id ===
                Number(localStorage.getItem("user_id"))
            ) {
                this.setState({ orderDirection: "out" });
            } else {
                this.setState({ orderDirection: "in" });
            }
        });
    }

    increment(id, amount) {
        amount = amount + 1;
        let fdata = new FormData();
        fdata.append("amount", amount);
        axios
            .put(server + "/orders/products/" + id, fdata, {
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
            .put(server + "/orders/products/" + id, fdata, {
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
                server + "/orders/products/delete/" + id,
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

    acceptOrder() {
        let fdata = new FormData();
        fdata.append("status", "accepted");

        axios
            .put(server + "/mob/orders/" + this.state.id, fdata, {
                headers: this.state.header,
            })
            .then((resp) => {
                toast.success("Sargyt kabul edildi");
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
                    <label>
                        {this.state.orderDirection === "out"
                            ? "Giden"
                            : "Gelen"}{" "}
                        sargyt ID
                        {this.state.products.length}{" "}
                    </label>
                </div>

                <div className="grid text-[14px] border-y py-1 my-1">
                    <label>
                        Sargyt ediji:{" "}
                        <span className="font-bold">
                            {this.state.sender_name}
                        </span>{" "}
                    </label>
                    <label>
                        Kabul ediji:{" "}
                        <span className="font-bold">
                            {this.state.accepter_name}
                        </span>{" "}
                    </label>
                    <label>
                        Salgysy:{" "}
                        <span className="font-bold">{this.state.address}</span>{" "}
                    </label>
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

                <div className="flex items-center  bg-slate-100 rounded-md p-2 font-bold text-[16px]">
                    <label>Jemi: {this.state.total} TMT</label>
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="flex flex-wrap sm:justify-center border-b">
                    {this.state.products.map((item) => {
                        return (
                            <div
                                className="grid grid-rows-[max-content_auto]  overflow-hidden m-2 
                                 shadow-md border p-2 rounded-md hover:shadow-lg duration-200
                                w-[150px] text-[12px]"
                            >
                                <img
                                    alt=""
                                    className="w-full  h-[120px] object-cover border rounded-lg"
                                    src={server + item.img}
                                ></img>
                                <div className="grid p-1 sm:text-[11px] content-start">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>
                                    <label className="text-sky-600 font-bold">
                                        {item.price} TMT{" "}
                                    </label>
                                    <label className="font-bold">
                                        {item.amount} sany
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {this.state.orderDirection === "in" &&
                    this.state.status === "pending" && (
                        <div className="text-[14px]">
                            <label>Eltip bermek bahasy</label>
                            <input
                                defaultValue={0}
                                min={0}
                                className="p-2 rounded-md mx-2"
                                type="number"
                            ></input>
                            <label>TMT</label>
                        </div>
                    )}

                <div className="flex justify-end items-center text-[14px]">
                    <button
                        onClick={() => {
                            this.deleteOrder(this.state.order_id);
                        }}
                        className="rounded-md mx-1 p-2 duration-200 bg-red-600 text-white 
                        flex items-center hover:shadow-md m-2"
                    >
                        <BsTrash size={20}></BsTrash>
                        <label>Sargydy bozmak</label>
                    </button>
                    {this.state.orderDirection === "in" &&
                        this.state.status === "pending" && (
                            <button
                                onClick={() => {
                                    this.acceptOrder();
                                }}
                                className="rounded-md mx-1 p-2 duration-200 text-green-600  flex items-center hover:text-slate-600 "
                            >
                                <BsTrash size={20}></BsTrash>
                                <label>Kabul etmek</label>
                            </button>
                        )}
                </div>
            </div>
        );
    }
}

export default OrderDetail;
