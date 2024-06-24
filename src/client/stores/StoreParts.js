import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";

class StoreParts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            parts: [],
            page_size: 20,
            parts_page: "",
            parts_count: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    render() {
        return (
            <div className="grid">
                <Pagination
                    className="mx-auto"
                    onChange={(event, page) => {
                        this.setProductsPage(page);
                    }}
                    count={this.state.products_total_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="grid grid-cols-4 sm:grid-cols-2">
                    {this.state.parts.map((item) => {
                        var img = server + item.img;
                        if (item.img.length === 0) {
                            img = "/default.png";
                        }
                        return (
                            <Link
                                to={"/parts/" + item.id}
                                className="grid  m-2 border rounded-md overflow-hidden shadow-md"
                                key={item.id}
                            >
                                <img
                                    className="w-[100%] sm:h-[150px] h-[200px] object-cover"
                                    alt=""
                                    src={img}
                                ></img>
                                <div className="grid p-2">
                                    <label className="text-[12px] font-bold">
                                        {item.name_tm}
                                    </label>
                                    {item.price !== "0 TMT" && (
                                        <label className="price text-[14px] m-[5px] font-bold text-blue-700">
                                            {item.price}
                                        </label>
                                    )}

                                    <label className="price text-[12px]">
                                        {item.created_at}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios
            .get(
                server +
                    "/mob/parts?page_size=" +
                    String(this.state.page_size) +
                    "&store=" +
                    id
            )
            .then((resp) => {
                this.setState({ parts: resp.data.data });
                this.setState({ products_count: resp.data.count });
                this.setState({ products_total_page: resp.data.total_page });
            });
    }

    setProductsPage(pageNumber) {
        this.setState({ isLoading: true });

        axios
            .get(
                server +
                    "/mob/products?store=" +
                    this.state.id +
                    "&page=" +
                    pageNumber +
                    "&page_size=" +
                    this.state.page_size
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ isLoading: false });
            });
    }
}

export default StoreParts;
