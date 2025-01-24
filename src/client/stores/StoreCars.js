import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";

class StoreCars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            items: [],
            id: "",
        };

        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/cars?store=" + id).then((resp) => {
            this.setState({ items: resp.data.data });
        });
    }

    setProductsPage(pageNumber) {
        this.setState({ isLoading: true });

        axios
            .get(
                server +
                    "/cars?store=" +
                    this.state.id +
                    "&page=" +
                    pageNumber +
                    "&page_size=100"
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="grid my-2">
                <div className="flex flex-wrap">
                    {this.state.items.map((item) => {
                        return (
                            <Link
                                to={"/cars/" + item.id}
                                className="grid overflow-hidden w-[200px] sm:w-[150px] sm:mx-auto shadow-md rounded-lg m-2
                                                 border h-max text-[12px] border-slate-300"
                                key={item.id}
                            >
                                <img
                                    alt=""
                                    className="aspect-square w-full object-cover"
                                    src={server + item.img}
                                ></img>

                                <div className="grid p-2 text-[15px] sm:text-[13px]">
                                    <label className="font-bold ">
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="font-bold rounded-full top-1 left-1 text-sky-600 ">
                                        {item.price} TMT
                                    </label>

                                    <div className="text-slategrey flex items-center">
                                        {item.created_at}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default StoreCars;
