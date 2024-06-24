import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { MdPlayCircle } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

class StoreVideos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            workStart: "",
            workEnd: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            viewed: 0,
            customer_id: "",
            customer_name: "",
            videos: [],
            page_size: 20,
            products_page: "",
            products_count: "",

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
                {/* <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setProductsPage(page);
                    }}
                    count={this.state.products_total_page}
                    variant="outlined"
                    shape="rounded"
                /> */}

                <div className="grid grid-cols-4 sm:grid-cols-3 flex-wrap justify-center">
                    {this.state.videos.map((item) => {
                        return (
                            <Link
                                to={"/videos/" + item.id}
                                className="m-2 grid"
                            >
                                <div
                                    onClick={() => {
                                        this.setState({
                                            videoPlayerIsOpen: true,
                                            videoPlayerUrl: item.video,
                                        });
                                    }}
                                    className="relative w-full h-[300px] sm:h-[150px] bg-slate-200 rounded-lg  overflow-hidden flex items-center justify-center
                                                    text-slate-600 hover:bg-slate-300 duration-300 border"
                                >
                                    <video src={server + item.url}></video>
                                    <MdPlayCircle
                                        className="z-1 text-white drop-shadow-sm hover:text-slate-400 duration-300"
                                        size={80}
                                    ></MdPlayCircle>
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

        axios.get(server + "/mob/videos?store=" + id).then((resp) => {
            this.setState({
                videos: resp.data.data,
                isLoading: false,
            });
        });

        axios
            .get(
                server +
                    "/mob/products?page_size=" +
                    String(this.state.page_size) +
                    "&store=" +
                    id
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
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

export default StoreVideos;
