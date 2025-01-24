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
                    <label className="font-bold m-2">
                        Awtoulaglar {this.state.cars.length}
                    </label>
                    <Link
                        to="/cars/add"
                        className="flex items-center rounded-md px-2 border bg-slate-200 mx-2"
                    >
                        {" "}
                        <BiPlus className="" size={25}></BiPlus>
                    </Link>
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="flex flex-wrap">
                    {this.state.cars.map((item) => {
                        return (
                            <Link
                                to={"/cars/edit/" + item.id}
                                className="grid w-[150px] overflow-hidden m-2 text-[12px] shadow-md border p-2 rounded-md hover:shadow-lg duration-200 "
                            >
                                <img
                                    alt=""
                                    className="w-full aspect-square object-cover border rounded-md"
                                    src={server + item.img}
                                ></img>

                                <div className="grid p-[5px] sm:text-[11px]">
                                    <label className="font-bold">
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="text-sky-600 font-bold">
                                        {item.price} TMT
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
