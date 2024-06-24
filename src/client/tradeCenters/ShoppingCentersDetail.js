import axios from "axios";
import React from "react";
import { server } from "../../static";
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

                <div className="grid grid-cols-4 sm:grid-cols-2">
                    {this.state.stores.map((item) => {
                        return (
                            <Link
                                to={"/stores/" + item.id}
                                className="item grid m-[10px] "
                            >
                                <img
                                    alt=""
                                    className="rounded-md w-full h-[200px] sm:h-[150px] object-cover"
                                    src={server + item.img}
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

export default ShoppingCenterDetail;
