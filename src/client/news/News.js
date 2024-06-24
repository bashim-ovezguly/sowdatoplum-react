import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiSearch } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

class News extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoadingCategory: false,
            current_page: "",
            last_page: "",
            categories: [],
            news: [],
            category: "",
            q: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Habarlar";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/products?page=" + pageNumber).then((resp) => {
            this.setState({ products: resp.data.data });
            this.setState({ isLoading: false });
        });
    }

    likeClick(id) {
        var fdata = new FormData();
        fdata.append("like", 1);
        axios.put(server + "/mob/news/" + id, fdata).then((res) => {
            this.setData();
        });
    }

    filter() {
        this.setState({ isLoading: true });
        this.setState({ q: document.getElementById("search").value });
        this.setData();
    }

    setData() {
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const customer = urlParams.get('customer')

        // const pathname = window.location.pathname
        // const id = pathname.split('/')[2]

        axios.get(server + "/mob/index/news").then((resp) => {
            this.setState({ categories: resp.data.categories });
        });

        const params = {
            page: this.state.current_page,
            category: this.state.category,
            q: this.state.q,
        };

        axios.get(server + "/mob/news", { params: params }).then((resp) => {
            this.setState({ news: resp.data.data });
            this.setState({ last_page: resp.data.total_page });
            this.setState({ count: resp.data.count });
            this.setState({ total_page: resp.data.total_page });
            this.setState({ page_size: resp.data.page_size });
            this.setState({ current_page: resp.data.current_page });
            this.setState({ isLoading: false });
            this.setState({ liked: resp.data.liked });
        });
    }

    setCategory(id) {
        const params = {
            page: this.state.current_page,
            category: this.state.category,
            q: this.state.q,
        };
        this.setState({ category: id, isLoadingCategory: true }, () => {
            axios.get(server + "/mob/news", { params: params }).then((resp) => {
                // this.setState({ news: resp.data.data });
            });
        });
    }

    render() {
        let pageNumbers = [];
        for (let i = 0; i < this.state.total_page; i++) {
            pageNumbers.push(i + 1);
        }

        return (
            <div className="grid p-2">
                <h3 className="text-[20px] text-sky-800 border-b">Habarlar</h3>

                <div className="flex items-center whitespace-nowrap px-3 overflow-x-auto">
                    <button
                        onClick={() => {
                            this.setState({ category: "" }, () => {
                                this.setData();
                            });
                        }}
                        className="mr-2 hover:text-sky-300 duration-200 px-2 text-slate-600"
                    >
                        Hemmesi
                    </button>
                    {this.state.categories.map((item) => {
                        return (
                            <button
                                onClick={() => {
                                    this.setCategory(item.id);
                                }}
                                className="mr-2 hover:text-sky-300  duration-200 px-2 py-1 text-slate-600"
                            >
                                {item.name_tm}
                            </button>
                        );
                    })}
                </div>

                {this.state.isLoading && (
                    <div className="flex justify-center m-10px">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-1">
                    {this.state.news.map((item) => {
                        return (
                            <div
                                className="grid  grid-rows-[max-content_auto] shadow-md hover:shadow-lg rounded-lg border duration-200
                                overflow-hidden m-2 text-[14px] "
                            >
                                <div className="relative text-slate-50">
                                    <Link to={"/news/" + item.id}>
                                        <img
                                            alt=""
                                            className="w-full sm:h-[200px] h-[250px] object-cover "
                                            src={server + item.img}
                                        ></img>

                                        <div
                                            className="absolute top-2 right-2 z-10 bg-slate-600/50 font-bold 
                                    rounded-md px-2 py-1"
                                        >
                                            {
                                                String(item.created_at).split(
                                                    " "
                                                )[0]
                                            }
                                        </div>
                                    </Link>
                                </div>
                                <div className="grid p-2 h-max">
                                    <label className="name text-[15px] font-bold text-slate-600">
                                        {item.title_tm}
                                    </label>

                                    <div className="flex items-center text-slate-500">
                                        <div className="flex items-center mr-4">
                                            <FaEye
                                                className="mr-2"
                                                size={20}
                                            ></FaEye>
                                            <label>{item.view}</label>
                                        </div>
                                        <button
                                            onClick={() => {
                                                this.likeClick(item.id);
                                            }}
                                            className="flex items-center mr-4 hover:bg-slate-200 rounded-lg px-2"
                                        >
                                            {item.liked === true ? (
                                                <AiFillLike
                                                    className="mr-2"
                                                    size={20}
                                                ></AiFillLike>
                                            ) : (
                                                <AiOutlineLike
                                                    className="mr-2"
                                                    size={20}
                                                ></AiOutlineLike>
                                            )}

                                            <label>{item.like_count}</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default News;
