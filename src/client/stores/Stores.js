import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiSearch } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import Grow from "@mui/material/Grow";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

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
        this.setState({ isLoading: true });

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
                    "/mob/stores?name_tm=" +
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
            <div className="stores p-2">
                <div className="flex justify-between text-sky-800 items-center flex-wrap">
                    <label className="text-[20px] ">
                        Dükanlar {this.state.count}
                    </label>
                    <div className="filter flex items-center">
                        <BiSearch
                            size={40}
                            className="hover:bg-slate-200 p-[5px] rounded-md w-[40px] h-[40px] "
                            onClick={() => {
                                this.setSearch();
                            }}
                        ></BiSearch>
                        <input
                            id="search-by-name"
                            className="search"
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

                {this.state.isLoading && (
                    <div className="flex justify-center m-5px">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-2 justify-between">
                    {this.state.stores.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Grow
                                in={true}
                                style={{ transformOrigin: "0 0 0" }}
                                {...(true ? { timeout: 1000 } : {})}
                            >
                                <Link
                                    to={"/stores/" + item.id + "/"}
                                    className="w-[200px] sm:w-[140px] m-1 mx-auto duration-300 text-center  "
                                >
                                    <img
                                        className="h-[200px] w-[200px] sm:h-[140px] sm:w-[140px] shadow-md
                                        object-cover rounded-3xl border hover:shadow-2xl duration-200"
                                        alt=""
                                        src={img_url}
                                    ></img>
                                    <div className="p-2 h-max">
                                        <label className="text-[14px] font-bold">
                                            {item.name}
                                        </label>
                                    </div>
                                </Link>
                            </Grow>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Stores;
