import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";

class ProfileOrdersOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            ordersIn: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Giden sargytlar";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios
            .get(server + "/mob/customers/" + id + "/orders/out")
            .then((resp) => {
                this.setState({
                    isLoading: false,
                    ordersIn: resp.data.data,
                    count: resp.data.count,
                });
            });
    }

    render() {
        return (
            <div className="">
                <div className="actions">
                    <div className="flex items-center">
                        <label>Giden sargytlar {this.state.count} </label>
                        {/* <Link to="/stores/add">
                            {" "}
                            <BiPlus
                                className="p-[5px] border m-[2px] my-[5px] rounded-md"
                                size={25}
                            ></BiPlus>
                        </Link> */}
                    </div>
                </div>
                <div className="grid">
                    {this.state.ordersIn.map((item) => {
                        return (
                            <Link
                                to={"/orders_out/" + item.id}
                                className="flex items-center overflow-hidden m-1 rounded-lg border bg-slate-100"
                            >
                                {/* <MdOutlineShoppingCart
                                    className="mx-2"
                                    size={45}
                                ></MdOutlineShoppingCart> */}
                                <img
                                    alt=""
                                    className="rounded-full w-[70px] h-[70px] m-1 object-cover border"
                                    src={server + item.store_img}
                                ></img>
                                <div className="grid h-max p-2 sm:text-[11px] text-[12px]">
                                    <label className="">
                                        {item.created_at}
                                    </label>
                                    <label>
                                        Haryt sany: {item.product_count}
                                    </label>
                                    <div className="flex items-center">
                                        <label className="text-[12px]">
                                            {item.location}
                                        </label>
                                    </div>
                                    {item.status === "pending" && (
                                        <label className="text-orange-600">
                                            Garaşylýar
                                        </label>
                                    )}

                                    {item.status === "accepted" && (
                                        <label className="text-green-600">
                                            Kabul edilen
                                        </label>
                                    )}
                                    {item.status === "canceled" && (
                                        <label className="text-red-600">
                                            Gaýtarlan
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

export default ProfileOrdersOut;
