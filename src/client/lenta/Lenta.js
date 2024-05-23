import axios from "axios";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { server } from "../../static";
import "./lenta.css";
import { BiCalendar, BiLike } from "react-icons/bi";
import CircularProgress, {
    circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

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

        document.title = "Lenta";
        this.setData();
    }

    setPage(pageNumber) {
        axios.get(server + "/mob/lenta?page=" + pageNumber).then((resp) => {
            this.setState({ datalist: resp.data.data });
        });
    }

    setData() {
        axios
            .get(
                server +
                    "/mob/lenta?page_size=20&page=" +
                    this.state.current_page
            )
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

    // set_more_post(){
    //     for(let i=0, )
    // }

    render() {
        return (
            <div className="lenta">
                <div className="items">
                    {this.state.datalist.map((item) => {
                        let img_url = item.images[0].img;
                        return (
                            <div className="item">
                                <div className="customer m-10px">
                                    {item.customer_photo !== "/media/" && (
                                        <img
                                            alt=""
                                            src={server + item.customer_photo}
                                        ></img>
                                    )}
                                    {item.customer_photo === "/media/" && (
                                        <img
                                            alt=""
                                            src={"/default.png   "}
                                        ></img>
                                    )}
                                    <label>{item.customer}</label>
                                </div>
                                <Link to={"/lenta/" + item.id}>
                                    <img alt="" src={server + img_url}></img>
                                </Link>
                                <label className="text">{item.text}</label>
                                <label className="date_time">
                                    {item.created_at}
                                </label>
                                <div className="flex items-center text-[14px] ">
                                    <div className="flex items-center mr-[5px]">
                                        <FiEye></FiEye>
                                        <label>{item.view}</label>
                                    </div>
                                    <div className="flex items-center mr-[5px]">
                                        <BiLike></BiLike>
                                        <label>{item.like_count}</label>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {this.state.isLoading && (
                    <CircularProgress className="progress"></CircularProgress>
                )}

                {this.state.isLoading == false && (
                    <div className="footer_btn">
                        <button className="more">Ýene-de görkez</button>
                    </div>
                )}
            </div>
        );
    }
}

export default Lenta;
