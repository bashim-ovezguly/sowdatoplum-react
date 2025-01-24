import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";

class ProfileOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            orders: [],

            token: localStorage.getItem("user_access_token"),
        };

        document.title = "Sargytlar";
        this.setData();
    }

    async setData() {
        const headers = {
            token: this.state.token,
        };
        var response = await axios
            .get(server + "/mob/orders", {
                headers: headers,
            })
            .then((resp) => {
                this.setState({
                    isLoading: false,
                    orders: resp.data.data,
                    count: resp.data.count,
                });
            })
            .catch((err) => {
                console.log(err);

                // if (err.response.status === 403) {
                //     this.refreshToken();
                //     toast.error("Auth error");
                //     window.location.href = "/login";
                // }
            });
    }

    refreshToken() {
        var formdata = new FormData();
        formdata.append(
            "refresh_token",
            localStorage.getItem("user_refresh_token")
        );
        axios
            .post(server + "/mob/token/refresh", formdata)
            .then((resp) => {
                this.setState({ user_data: resp.data, isLoading: false });

                localStorage.setItem("user_id", resp.data.data["id"]);
                localStorage.setItem("user_name", resp.data.data["name"]);
                localStorage.setItem("user_phone", resp.data.data["phone"]);
                localStorage.setItem("user_email", resp.data.data["email"]);
                localStorage.setItem(
                    "user_access_token",
                    resp.data.data["access_token"]
                );
                localStorage.setItem(
                    "user_refresh_token",
                    resp.data.data["refresh_token"]
                );
            })
            .catch((err) => {});
    }

    render() {
        return (
            <div className="">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="actions">
                    <div className="flex items-center">
                        <label className="font-bold m-2">
                            Sargytlar {this.state.count}{" "}
                        </label>
                    </div>
                </div>

                <div className="flex flex-wrap sm:justify-center mx-auto">
                    {this.state.orders.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                to={"/orders/" + item.id}
                                className="grid grid-rows-[max-content_auto_max-content] m-2 items-center overflow-hidden 
                                border w-[150px] hover:bg-slate-100 text-slate-600  shadow-md p-2 rounded-md hover:shadow-lg duration-200"
                            >
                                <MdShoppingCart
                                    className=""
                                    size={45}
                                ></MdShoppingCart>

                                <div className="grid h-max p-2 sm:text-[11px] text-[12px]">
                                    <label className="">
                                        {item.created_at}
                                    </label>
                                    <label>
                                        Haryt sany: {item.product_count}
                                    </label>
                                    <label>Jemi summa: {item.total} TMT</label>
                                    <div className="flex items-center">
                                        <label className="text-[12px]">
                                            {item.location}
                                        </label>
                                    </div>
                                    {item.status === "pending" && (
                                        <label className="text-orange-600">
                                            Garaşylýar
                                        </label>
                                    )}

                                    {item.status === "accepted" && (
                                        <label className="text-green-600">
                                            Kabul edilen
                                        </label>
                                    )}
                                    {item.status === "canceled" && (
                                        <label className="text-red-600">
                                            Gaýtarlan
                                        </label>
                                    )}
                                </div>
                                <div className="flex items-center text-[12px] mx-2">
                                    {item.accepter.id ===
                                    Number(localStorage.getItem("user_id")) ? (
                                        <div className="flex items-center">
                                            {" "}
                                            <BsArrowDown
                                                size={18}
                                            ></BsArrowDown>
                                            <label>Gelen sargyt</label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <BsArrowUp size={18}></BsArrowUp>
                                            <label>Giden sargyt</label>
                                        </div>
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

export default ProfileOrders;
