import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./profile_stores.css";
import { BiMap, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

class ProfileStores extends React.Component {
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

        document.title = "Profile";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios.get(server + "/mob/stores?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, stores: resp.data.data });
        });
    }

    render() {
        return (
            <div className="profile_stores">
                <div className="actions">
                    <div className="flex items-center">
                        <label>Dükanlar </label>
                        <Link to="/stores/add">
                            {" "}
                            <BiPlus
                                className="p-[5px] border m-[2px] my-[5px] rounded-md"
                                size={25}
                            ></BiPlus>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    {this.state.stores.map((item) => {
                        return (
                            <Link
                                to={"/stores/edit/" + item.id}
                                className="grid grid-rows-[max-content_auto] w-[140px] overflow-hidden m-[10px] rounded shadow-md border"
                            >
                                {item.img !== "" && (
                                    <img
                                        className="w-[100%] h-[150px] object-cover"
                                        alt=""
                                        src={server + item.img}
                                    ></img>
                                )}
                                {item.img === "" && (
                                    <img alt="" src={"/default.png"}></img>
                                )}

                                <div className="grid h-max p-[5px] text-[14px] sm:text-[11px]">
                                    <label className="font-bold text-slate-600">
                                        {item.name}
                                    </label>
                                    <div className="flex items-center">
                                        <BiMap></BiMap>
                                        <label className="text-[12px]">
                                            {item.location}
                                        </label>
                                    </div>
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

export default ProfileStores;
