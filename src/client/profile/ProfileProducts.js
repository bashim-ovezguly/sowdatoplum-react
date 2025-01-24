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
        };

        document.title = "Profile";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/products?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, products: resp.data.data });
        });
    }

    render() {
        return (
            <div className="profile_products">
                <div className="flex items-center">
                    <label className="font-bold text-appColor m-2">
                        Harytlar {this.state.products.length}
                    </label>
                    <Link
                        to="/products/add"
                        className="flex items-center rounded-md px-2 border bg-slate-200 mx-2"
                    >
                        <BiPlus size={25}></BiPlus>
                    </Link>
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}
                <div className="flex flex-wrap not-sm:justify-center">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/products/edit/" + item.id}
                                className="grid w-[150px] grid-rows-[max-content_auto] overflow-hidden shadow-md border p-2 rounded-md hover:shadow-lg duration-200
                                m-2 text-[12px]"
                            >
                                <img
                                    alt=""
                                    className="w-full aspect-square rounded-md border object-cover"
                                    src={server + item.img}
                                ></img>

                                <div className="grid py-1 items-start h-max sm:text-[11px]">
                                    <label className="font-bold ">
                                        {item.name}
                                    </label>
                                    <label className="price font-bold text-sky-500">
                                        {item.price} TMT
                                    </label>
                                    {item.status === "pending" && (
                                        <label className="text-orange-600">
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
