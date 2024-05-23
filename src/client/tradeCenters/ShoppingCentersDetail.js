import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./shoppingCenters.css";
import { Link } from "react-router-dom";
import { BiMap } from "react-icons/bi";

class ShoppingCenterDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            img: "",
            location: "",

            bazarlar: [],
            stores: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Söwda merkezler";
        this.setData();
    }

    setData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const customer = urlParams.get("customer");

        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/bazarlar/" + id).then((resp) => {
            this.setState({ id: resp.data.id });
            this.setState({ name: resp.data.name_tm });
            this.setState({ img: resp.data.img_m });
            this.setState({ stores: resp.data.stores });
            this.setState({ location: resp.data.location });
        });
    }

    render() {
        return (
            <div className="shopping_detail grid p-[10px]">
                <label className="sm:text-[20px] text-[40px] font-bold">
                    {this.state.name}
                </label>

                <div className="flex  items-center">
                    <BiMap></BiMap>
                    <label>{this.state.location}</label>
                </div>

                <h4 className="">Dükanlar {this.state.stores.length} sany</h4>

                <div className="items flex flex-wrap">
                    {this.state.stores.map((item) => {
                        return (
                            <Link
                                to={"/stores/" + item.id}
                                className="item grid m-[10px] "
                            >
                                <img
                                    alt=""
                                    className="rounded border"
                                    src={server + item.img}
                                ></img>
                                <label>{item.name}</label>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ShoppingCenterDetail;
