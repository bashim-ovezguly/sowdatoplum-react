import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./products.css";
import { BiSearch } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class Products extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",

            products: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Harytlar";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/products?page=" + pageNumber).then((resp) => {
            this.setState({ products: resp.data.data });
            this.setState({ isLoading: false });
        });
    }

    next_page() {
        if (this.state.last_page >= this.state.current_page + 1) {
            var next_page_number = this.state.current_page + 1;
            this.setState({ current_page: next_page_number }, () => {
                this.setData();
            });
        }
    }

    prev_page() {
        if (this.state.current_page - 1 !== 0) {
            this.setState({ current_page: this.state.current_page - 1 }, () => {
                this.setData();
            });
        }
    }

    filter() {
        this.setState({ isLoading: true });
        let name = document.getElementById("search").value;
        axios.get(server + "/mob/products?name=" + name).then((resp) => {
            this.setState({ products: resp.data.data });
            this.setState({ last_page: resp.data.total_page });
            this.setState({ count: resp.data.count });
            this.setState({ total_page: resp.data.total_page });
            this.setState({ page_size: resp.data.page_size });
            this.setState({ current_page: resp.data.current_page });
            this.setState({ isLoading: false });
        });
    }

    setData() {
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const customer = urlParams.get('customer')

        // const pathname = window.location.pathname
        // const id = pathname.split('/')[2]

        axios
            .get(server + "/mob/products?page=" + this.state.current_page)
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ last_page: resp.data.total_page });
                this.setState({ count: resp.data.count });
                this.setState({ total_page: resp.data.total_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ current_page: resp.data.current_page });
                this.setState({ isLoading: false });
            });
    }

    render() {
        var default_img_url = "/default.png";

        let pageNumbers = [];
        for (let i = 0; i < this.state.total_page; i++) {
            pageNumbers.push(i + 1);
        }

        return (
            <div className="products grid">
                <div className="flex items-center justify-between mx-2">
                    <h3 className="text-[20px] text-sky-800">
                        Harytlar {this.state.count}
                    </h3>

                    <div className="flex items-center text-slate-700">
                        <BiSearch
                            className="hover:bg-slate-200 p-[5px] duration-200 rounded-md w-[35px] h-[35px] "
                            onClick={() => {
                                this.filter();
                            }}
                        ></BiSearch>
                        <input
                            id="search"
                            type="search"
                            placeholder="Ady boýunça gözleg..."
                        ></input>
                    </div>
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.total_page}
                    variant="outlined"
                    shape="rounded"
                />

                {this.state.isLoading && (
                    <div className="flex justify-center m-10px">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="flex flex-wrap justify-center">
                    {this.state.products.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        const date = item.created_at.split(" ")[0];
                        const time = item.created_at.split(" ")[1];

                        return (
                            <div
                                className="grid grid-rows-[max-content_auto] w-[200px] sm:w-[150px]  
                                overflow-hidden m-[10px] rounded shadow-md border text-[14px]
                                hover:shadow-slate-500/50 duration-200"
                            >
                                <Link to={"/products/" + item.id}>
                                    <img
                                        alt=""
                                        className="w-full sm:h-[150px] h-[200px] object-cover"
                                        src={img_url}
                                    ></img>
                                </Link>
                                <div className="grid p-[5px] h-max">
                                    <label className="name text-[14px] font-bold text-slate-600">
                                        {item.name}
                                    </label>
                                    <label className="text-[12px] text-slate-600">
                                        {item.store_name}
                                    </label>
                                    <label className="price text-blue-700 font-bold p-[2px] text-[14px]">
                                        {item.price}
                                    </label>
                                    <label className="text-slate-700 p-[2px] text-[14px]">
                                        {date}
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Products;
