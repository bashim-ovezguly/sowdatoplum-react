import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap } from "react-icons/bi";
import Pagination from "@mui/material/Pagination";
import Grow from "@mui/material/Grow";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ProgressIndicator from "../../admin/ProgressIndicator";

class TradeCenters extends React.Component {
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
            .get(server + "/mob/trade_centers?page=" + pageNumber)
            .then((resp) => {
                this.setState({ bazarlar: resp.data.data });
            });
    }

    setData() {
        axios
            .get(server + "/mob/trade_centers?page=" + this.state.current_page)
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
            <div className="shopping_centers grid p-2">
                <h3 className="text-[15px] font-bold text-appColor">
                    Söwda merkezler{" "}
                </h3>

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

                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <div className="flex flex-wrap  justify-between">
                    {this.state.bazarlar.map((item) => {
                        var img_url = server + item.img;
                        if (item.img == "/media/") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/trade_centers/" + item.id}
                                className="grid w-[250px] sm:w-[150px]  grid-rows-[max-content_auto] overflow-hidden m-2 shadow-lg border rounded-md p-2"
                            >
                                <img
                                    alt=""
                                    className="aspect-video h-[160px] object-cover border rounded-md shadow-sm"
                                    src={img_url}
                                ></img>
                                <div className="grid h-max">
                                    <label className="font-bold text-[14px] line-clamp-1">
                                        {item.name}
                                    </label>
                                    <label className="flex items-center text-[12px] text-slate-500">
                                        {" "}
                                        <BiMap size={13}></BiMap>{" "}
                                        {item.location}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TradeCenters;
