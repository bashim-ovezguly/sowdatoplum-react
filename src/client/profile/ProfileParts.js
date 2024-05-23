import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./profile_stores.css";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

class ProfileParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            cars: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Meniň awtoşaýlarym";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/mob/parts?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, cars: resp.data.data });
        });
    }

    render() {
        return (
            <div className="profile_parts">
                <div className="flex items-center">
                    <label>Awtoşaýlar {this.state.cars.length} </label>
                    <Link to="/parts/add">
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

                <div className="items flex">
                    {this.state.cars.map((item) => {
                        return (
                            <Link
                                className="grid w-[140px] overflow-hidden m-[10px] rounded shadow-md border text-[14px]"
                                to={"/parts/edit/" + item.id}
                            >
                                <img
                                    alt=""
                                    className="w-[100%] h-[150px]  object-cover"
                                    src={server + item.img}
                                ></img>
                                <div className="grid p-[5px] sm:text-[11px]">
                                    <label className="font-bold">
                                        {item.name_tm}
                                    </label>
                                    <label className="text-sky-600 font-bold">
                                        {item.price}
                                    </label>
                                    <label className="text-[12px]">
                                        {item.location}
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

export default ProfileParts;
