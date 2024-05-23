import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

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

                <div className="items flex flex-wrap">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/lenta/edit/" + item.id}
                                className="grid grid-rows-[max-content_auto]  w-[140px] overflow-hidden m-[10px] rounded-md shadow-md border"
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
                                    <label className="font-bold text-slate-600 max-h-[40px]">
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
