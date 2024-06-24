import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiHeart, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BsEye } from "react-icons/bs";

class ProfileLenta extends React.Component {
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

        document.title = "Profile | Lenta";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/mob/lenta?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, products: resp.data.data });
        });
    }

    render() {
        return (
            <div className="">
                <div className="flex items-center">
                    <label>Lenta {this.state.products.length} </label>
                    <Link to="/lenta/add">
                        {" "}
                        <BiPlus
                            className="p-2 border m-1 my-2 rounded-md"
                            size={25}
                        ></BiPlus>
                    </Link>
                </div>

                {this.state.isLoading && (
                    <div className="grid grid-cols-3 sm:grid-cols-2">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="items grid grid-cols-3 sm:grid-cols-1">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/lenta/edit/" + item.id}
                                className="grid grid-rows-[max-content_auto] overflow-hidden m-2 rounded-md shadow-md border"
                            >
                                {item.img !== "" && (
                                    <img
                                        className="w-[100%] h-[150px] object-cover"
                                        alt=""
                                        src={server + item.images[0].img}
                                    ></img>
                                )}
                                {item.img === "" && (
                                    <img alt="" src={"/default.png"}></img>
                                )}

                                <div className="grid h-max p-[5px] text-[14px] sm:text-[11px]">
                                    <div className="flex">
                                        <div className="flex items-center">
                                            <BiHeart></BiHeart>
                                            <label className="ml-1">
                                                {item.like_count}
                                            </label>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <BsEye></BsEye>
                                            <label className="ml-1">
                                                {item.view}
                                            </label>
                                        </div>
                                    </div>
                                    <label className="text-[12px] text-slate-600 max-h-[100px]">
                                        {item.text}
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

export default ProfileLenta;
