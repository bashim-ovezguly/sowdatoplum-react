import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiSearch } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import Grow from "@mui/material/Grow";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import ProgressIndicator from "../../admin/ProgressIndicator";
import { MotionAnimate } from "react-motion-animate";

class Stores extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",
            total_page: "",
            categories: [],
            stores: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Dükanlar";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true, stores: [] });

        axios.get(server + "/mob/stores?page=" + pageNumber).then((resp) => {
            this.setState({ stores: resp.data.data });
            this.setState({ isLoading: false });
        });
    }

    setData() {
        axios
            .get(server + "/mob/stores?page=" + this.state.current_page)
            .then((resp) => {
                this.setState({ stores: resp.data.data });
                this.setState({ last_page: resp.data.total_page });
                this.setState({ count: resp.data.count });
                this.setState({ total_page: resp.data.total_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ current_page: resp.data.current_page });
                this.setState({ isLoading: false });
            });

        axios.get(server + "/mob/index/store").then((resp) => {
            this.setState({ categories: resp.data.categories });
        });
    }

    setSearch() {
        let name = document.getElementById("search-by-name").value;
        axios
            .get(
                server +
                    "/mob/stores?name=" +
                    name +
                    "&page=" +
                    this.state.current_page
            )
            .then((resp) => {
                this.setState({ stores: resp.data.data });
            });
    }

    render() {
        var default_img_url = "/default.png";

        return (
            <MotionAnimate>
                <div className="stores">
                    <div className="flex justify-between text-appColor items-center flex-wrap">
                        <label className="text-[15px] font-bold m-2">
                            Dükanlar {this.state.count}
                        </label>
                        <div className="filter flex items-center">
                            <BiSearch
                                size={30}
                                className="hover:bg-slate-200 p-2 rounded-md w-[40px] h-[40px] "
                                onClick={() => {
                                    this.setSearch();
                                }}
                            ></BiSearch>
                            <input
                                id="search-by-name"
                                className="search p-1"
                                type="search"
                                placeholder="Ady boýunça gözleg..."
                            ></input>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Pagination
                            className="m-auto my-2"
                            onChange={(event, page) => {
                                this.setPage(page);
                            }}
                            count={Number(this.state.total_page)}
                            variant="outlined"
                            shape="rounded"
                        />
                    </div>

                    <ProgressIndicator
                        open={this.state.isLoading}
                    ></ProgressIndicator>

                    <div className="flex flex-wrap  justify-between m-1">
                        {this.state.stores.map((item) => {
                            var img_url = server + item.logo;
                            if (item.img === "") {
                                img_url = default_img_url;
                            }

                            return (
                                <Link
                                    to={"/stores/" + item.id + "/"}
                                    className="w-[200px] sm:w-[100px] 
                                    duration-300 text-center text-appColor m-2 sm:m-1  "
                                >
                                    <img
                                        className="h-[200px] aspect-square sm:h-[90px] shadow-md rounded-lg  border overflow-hidden
                                        object-cover  duration-200"
                                        alt=""
                                        src={img_url}
                                    ></img>

                                    <label className="text-[12px] sm:text-[10px] py-1 font-bold line-clamp-1">
                                        {item.name}
                                    </label>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default Stores;
