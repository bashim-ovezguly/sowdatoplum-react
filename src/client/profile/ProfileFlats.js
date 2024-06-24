import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

class ProfileFlats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            stores: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Gozgalmaýan emläkler";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/mob/flats?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, stores: resp.data.data });
        });
    }

    render() {
        return (
            <div className="profile_flats">
                <div className="flex items-center">
                    <label>
                        Gozgalmaýan emläkler {this.state.stores.length}{" "}
                    </label>
                    <Link to="/flats/add">
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
                    {this.state.stores.map((item) => {
                        return (
                            <Link
                                to={"/flats/edit/" + item.id}
                                className="grid grid-rows-[max-content_auto] overflow-hidden m-2 rounded-md bg-slate-100 border text-[12px]"
                            >
                                <img
                                    alt=""
                                    className="w-[100%] h-[150px] object-cover"
                                    src={server + item.img}
                                ></img>

                                <div className="grid text h-max p-2">
                                    <label className="name font-bold">
                                        {item.name}
                                    </label>
                                    <label className="price text-sky-600 font-bold">
                                        {item.price}
                                    </label>
                                    <label className="flex items-center">
                                        {" "}
                                        <BiMap></BiMap> {item.location}
                                    </label>
                                    {item.status === "pending" && (
                                        <label className="text-orange-600">
                                            Garaşylýar
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

export default ProfileFlats;
