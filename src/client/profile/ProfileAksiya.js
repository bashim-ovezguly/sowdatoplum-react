import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiHeart, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BsEye } from "react-icons/bs";
import { MotionAnimate } from "react-motion-animate";

class ProfileLenta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            products: [],
        };

        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        let token = localStorage.getItem("user_access_token");
        axios
            .get(server + "/lenta?store=" + id, {
                headers: { token: token },
            })
            .then((resp) => {
                this.setState({ isLoading: false, products: resp.data.data });
            });
    }

    render() {
        return (
            <div className="">
                <div className="flex items-center">
                    <label className="font-bold m-2">
                        Aksiýalar {this.state.products.length}{" "}
                    </label>
                    <Link
                        to="/lenta/add"
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

                <div className="flex flex-wrap sm:justify-center">
                    {this.state.products.map((item) => {
                        return (
                            <MotionAnimate>
                                <Link
                                    to={"/lenta/edit/" + item.id}
                                    className="grid w-[150px] h-[200px] sm:w-full grid-rows-[60%_auto]  hover:bg-slate-100 shadow-md border p-2 hover:shadow-lg duration-200
                                     m-2 text-[14px] rounded-md"
                                >
                                    <img
                                        className="h-[100px] aspect-video object-cover rounded-md border"
                                        alt=""
                                        src={server + item.images[0].img}
                                    ></img>

                                    <div className="grid overflow-hidden w-full h-max">
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
                                        <label className="text-[12px] max-h-[100px] line-clamp-1">
                                            {item.text}
                                        </label>
                                        <label className="text-[12px] max-h-[100px] line-clamp-1">
                                            {item.created_at}
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
                            </MotionAnimate>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ProfileLenta;
