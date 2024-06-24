import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

class ProfileCars extends React.Component {
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

        document.title = "Profile";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");

        axios.get(server + "/mob/cars?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, cars: resp.data.data });
        });
    }

    render() {
        return (
            <div className="">
                <div className="flex items-center">
                    <label>Awtoulaglar </label>
                    <Link to="/cars/add">
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
                    {this.state.cars.map((item) => {
                        return (
                            <Link
                                to={"/cars/edit/" + item.id}
                                className="grid overflow-hidden m-[10px] rounded-md bg-slate-100 border text-[14px]"
                            >
                                {item.img !== "" && (
                                    <img
                                        alt=""
                                        className="w-[100%] h-[150px]  object-cover"
                                        src={server + item.img}
                                    ></img>
                                )}
                                {item.img === "" && (
                                    <img
                                        alt=""
                                        className="w-[100%] h-[150px]  object-cover"
                                        src={"/default.png"}
                                    ></img>
                                )}
                                <div className="grid p-[5px] sm:text-[11px]">
                                    <label className="font-bold">
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="text-sky-600 font-bold">
                                        {item.price}
                                    </label>
                                    <div className="flex items-center">
                                        <BiMap></BiMap>
                                        <label className="text-[12px]">
                                            {item.location}
                                        </label>
                                    </div>
                                    {item.status === "pending" && (
                                        <label className="text-orange-500">
                                            Garaşylýar
                                        </label>
                                    )}
                                    {item.status === "canceled" && (
                                        <label className="text-red-600 ">
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

export default ProfileCars;
