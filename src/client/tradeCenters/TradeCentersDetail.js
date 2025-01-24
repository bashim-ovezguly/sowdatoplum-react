import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";
import { BiLayer, BiMap } from "react-icons/bi";

class TradeCenterDetail extends React.Component {
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
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/trade_centers/" + id).then((resp) => {
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
                <img
                    className="rounded-md aspect-video w-[400px] border object-cover"
                    alt=""
                    src={server + this.state.img}
                ></img>
                <label className="sm:text-[20px] text-[30px] font-bold">
                    {this.state.name}
                </label>

                <div className="flex  items-center flex-wrap">
                    <BiMap></BiMap>
                    <label>{this.state.location}</label>
                    <label className="px-2 flex items-center">
                        <BiLayer></BiLayer>
                        Dükanlar {this.state.stores.length} sany
                    </label>
                </div>

                <div className="flex flex-wrap">
                    {this.state.stores.map((item) => {
                        return (
                            <Link
                                to={"/stores/" + item.id}
                                className="item grid m-4 h-max "
                            >
                                <img
                                    alt=""
                                    className="rounded-md aspect-square h-[200px] sm:h-[150px] object-cover border"
                                    src={server + item.logo}
                                ></img>
                                <label className="my-1">{item.name}</label>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TradeCenterDetail;
