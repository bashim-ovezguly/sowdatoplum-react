import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiSearch } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import ProgressIndicator from "../../admin/ProgressIndicator";
import { MotionAnimate } from "react-motion-animate";

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
            <MotionAnimate>
                <div className="products grid">
                    <div className="flex items-center justify-between mx-2">
                        <h3 className="text-[15px] text-appColor font-bold">
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
                                className="p-1"
                                type="search"
                                placeholder="Ady boýunça gözleg..."
                            ></input>
                        </div>
                    </div>

                    <Pagination
                        className="mx-auto my-4"
                        onChange={(event, page) => {
                            this.setPage(page);
                        }}
                        count={this.state.total_page}
                        variant="outlined"
                        shape="rounded"
                    />

                    {this.state.isLoading && (
                        <ProgressIndicator
                            open={this.state.open}
                        ></ProgressIndicator>
                    )}

                    <div className="flex flex-wrap justify-center p-1">
                        {this.state.products.map((item) => {
                            var img_url = server + item.img;
                            if (item.img === "") {
                                img_url = default_img_url;
                            }

                            const date = item.created_at.split(" ")[0];

                            return (
                                <MotionAnimate>
                                    <div
                                        className="grid w-[200px] sm:w-[160px]  h-max text-[11px] grid-rows-[max-content_auto] shadow-md border 
                                    relative overflow-hidden m-2 p-2 bg-white hover:shadow-2xl  duration-200 rounded-md"
                                    >
                                        <Link to={"/products/" + item.id}>
                                            <img
                                                alt=""
                                                className="w-full sm:h-[180px] h-[180px] object-cover  rounded-lg"
                                                src={img_url}
                                            ></img>
                                        </Link>
                                        <div className="grid">
                                            <label className="name font-bold text-slate-600 line-clamp-1">
                                                {item.name}
                                            </label>
                                            <label className="font-bold w-max rounded-md text-sky-600">
                                                {item.price} TMT
                                            </label>
                                            <label
                                                className="rounded-full line-clamp-1 top-[135px] sm:top-[95px] left-1
                                                        drop-shadow-2xl text-slate-600 w-max"
                                            >
                                                {item.store_name}
                                            </label>
                                            <label className="text-slate-700">
                                                {date}
                                            </label>
                                        </div>
                                    </div>
                                </MotionAnimate>
                            );
                        })}
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default Products;
