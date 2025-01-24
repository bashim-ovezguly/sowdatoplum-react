import axios from "axios";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar, BiLike } from "react-icons/bi";
import CircularProgress, {
    circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import ProgressIndicator from "../../admin/ProgressIndicator";

class Lenta extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",
            total_page: "",

            datalist: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Aksiýalar";
        this.setData();
    }

    setPage(pageNumber) {
        axios.get(server + "/lenta?page=" + pageNumber).then((resp) => {
            this.setState({ datalist: resp.data.data });
        });
    }

    setData() {
        axios
            .get(server + "/lenta?page_size=20&page=" + this.state.current_page)
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
                this.setState({ last_page: resp.data.total_page });
                this.setState({ count: resp.data.count });
                this.setState({
                    customer_photo: resp.data.data.customer_photo,
                });
                this.setState({ customer: resp.data.data.customer });
                this.setState({ total_page: resp.data.total_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ current_page: resp.data.current_page });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="lenta grid max-w-[1440px]">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <h3 className="text-[15px] m-2  text-appColor font-bold">
                    Aksiýalar
                </h3>
                <div className="items flex flex-wrap">
                    {this.state.datalist.map((item) => {
                        let img_url = item.images[0].img;
                        return (
                            <div
                                className="item grid grid-rows-[max-content_auto_max-content] m-2 p-2 w-[300px] 
                            overflow-hidden rounded-lg  border shadow-md "
                            >
                                <div className="customer flex items-center text-[12px] m-1">
                                    {item.store.logo != "" && (
                                        <img
                                            className="w-[30px] h-[30px] overflow-hidden border rounded-full object-cover"
                                            alt=""
                                            src={server + item.store.logo}
                                        ></img>
                                    )}
                                    {item.store.logo == "" && (
                                        <img
                                            alt=""
                                            src={"./default.png"}
                                            className="w-[30px] h-[30px] overflow-hidden border rounded-full object-cover"
                                        ></img>
                                    )}
                                    <label className="mx-1 line-clamp-1 font-bold">
                                        {item.store.name}
                                    </label>
                                </div>

                                <Link to={"/lenta/" + item.id}>
                                    <img
                                        className="w-full h-[200px] border object-cover rounded-lg overflow-hidden"
                                        alt=""
                                        src={server + img_url}
                                    ></img>
                                </Link>
                                <div>
                                    <label className="text-[12px] my-2 line-clamp-2">
                                        {item.text}
                                    </label>
                                    <div className="flex items-center text-[12px] m-2 ">
                                        <div className="flex items-center mr-2">
                                            <FiEye size={18}></FiEye>
                                            <label>{item.view}</label>
                                        </div>
                                        <div className="flex items-center mr-2">
                                            <BiLike size={18}></BiLike>
                                            <label>{item.like_count}</label>
                                        </div>
                                        <label className="date_time">
                                            {item.created_at}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {this.state.isLoading == false && (
                    <div className="">
                        <button className="border rounded-md text-slate-700 p-2">
                            Ýene-de görkez
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Lenta;
