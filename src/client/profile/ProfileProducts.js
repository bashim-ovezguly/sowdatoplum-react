import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

class ProfileProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            products: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Profile";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/mob/products?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, products: resp.data.data });
        });
    }

    render() {
        return (
            <div className="profile_products">
                <div className="flex items-center">
                    <label>Harytlar {this.state.products.length} </label>
                    <Link to="/products/add">
                        {" "}
                        <BiPlus
                            className="p-[5px] border m-[2px] my-[5px] rounded-md"
                            size={25}
                        ></BiPlus>
                    </Link>
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-2">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/products/edit/" + item.id}
                                className="grid grid-rows-[max-content_auto] overflow-hidden m-2 bg-slate-100
                                        rounded-md border text-[12px]"
                            >
                                {item.img === "" && (
                                    <img
                                        alt=""
                                        className="w-[100%] h-[150px] object-cover"
                                        src="/default.png"
                                    ></img>
                                )}
                                {item.img !== "" && (
                                    <img
                                        alt=""
                                        className="w-[100%] h-[150px] object-cover"
                                        src={server + item.img}
                                    ></img>
                                )}

                                <div className="grid text-[14px] p-[5px] items-start h-max sm:text-[11px]">
                                    <label className="font-bold ">
                                        {item.name}
                                    </label>
                                    <label className="price font-bold text-sky-500">
                                        {item.price}
                                    </label>
                                    {item.status === "pending" && (
                                        <label className="status pending">
                                            Garaşylýar
                                        </label>
                                    )}
                                    {item.status === "canceled" && (
                                        <label className="status canceled ">
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

export default ProfileProducts;
