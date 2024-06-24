import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import Grow from "@mui/material/Grow";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

class ShoppingCenters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",
            total_page: "",

            bazarlar: [],

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

    setPage(pageNumber) {
        axios
            .get(server + "/mob/shopping_centers?page=" + pageNumber)
            .then((resp) => {
                this.setState({ bazarlar: resp.data.data });
            });
    }

    setData() {
        axios
            .get(
                server + "/mob/shopping_centers?page=" + this.state.current_page
            )
            .then((resp) => {
                this.setState({ bazarlar: resp.data.data });
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
        return (
            <div className="shopping_centers grid p-[10px]">
                <h3 className="text-[20px] font-bold">Söwda merkezler </h3>

                <div className="flex justify-center">
                    <Pagination
                        className="pagination"
                        onChange={(event, page) => {
                            this.setPage(page);
                        }}
                        count={this.state.total_page}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>

                {this.state.isLoading && (
                    <div className="">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-2">
                    {this.state.bazarlar.map((item) => {
                        var img_url = server + item.img;
                        if (item.img == "/media/") {
                            img_url = default_img_url;
                        }

                        return (
                            <Grow
                                in={true}
                                style={{ transformOrigin: "0 0 0" }}
                                {...(true ? { timeout: 1000 } : {})}
                            >
                                <Link
                                    to={"/shopping_centers/" + item.id}
                                    className="grid grid-rows-[max-content_auto] overflow-hidden 
                                    m-2 rounded-lg  hover:shadow-lg shadow-md duration-300"
                                >
                                    <img
                                        alt=""
                                        className="w-full h-[200px]  object-cover border "
                                        src={img_url}
                                    ></img>
                                    <div className="grid h-max p-2">
                                        <label className="font-bold">
                                            {item.name}
                                        </label>
                                        <label className="flex items-center text-[14px]">
                                            {" "}
                                            <BiMap
                                                className="w-[20px] h-[20px]"
                                                size={20}
                                            ></BiMap>{" "}
                                            {item.location}
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

export default ShoppingCenters;
