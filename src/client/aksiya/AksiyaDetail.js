import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar } from "react-icons/bi";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

class LentaDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",
            total_page: "",
            images: [],
            logo: "",
            store_name: "",
            view: "",
            created_at: "",

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
        axios.get(server + "/lenta?page=" + pageNumber).then((resp) => {
            this.setState({ datalist: resp.data.data });
        });
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/lenta/" + id).then((resp) => {
            this.setState({
                lenta: resp.data,
                images: resp.data.images,
                view: resp.data.view,
                text: resp.data.text,
                created_at: resp.data.created_at,
            });

            if (resp.data.store != null) {
                this.setState({
                    logo: resp.data.store.logo,
                    store_name: resp.data.store.name,
                    store_id: resp.data.store.id,
                });
            }
        });
    }

    render() {
        return (
            <div className="lenta_detail p-2 mx-auto grid max-w-[900px]">
                <Link
                    to={"/stores/" + this.state.store_id}
                    className="customer m-2 flex items-center"
                >
                    {this.state.logo !== "/media/" && (
                        <img
                            alt=""
                            className="w-[30px] h-[30px] overflow-hidden rounded-full"
                            src={server + this.state.logo}
                        ></img>
                    )}
                    {this.state.logo === "/media/" && (
                        <img
                            className="w-[30px] h-[30px] overflow-hidden rounded-full"
                            alt=""
                            src={"/default.png   "}
                        ></img>
                    )}
                    <label className="m-2">{this.state.store_name}</label>
                </Link>

                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <img
                                alt=""
                                className="max-w-[400px] max-h-[400px] object-cover m-2 rounded-md border"
                                src={server + item.img}
                            ></img>
                        );
                    })}
                </div>

                <p>{this.state.text}</p>

                <div className="view flex items-center my-2 text-slate-600">
                    <FiEye></FiEye>
                    <label>{this.state.view}</label>
                    <BiCalendar></BiCalendar>
                    <label>{this.state.created_at}</label>
                </div>
            </div>
        );
    }
}

export default LentaDetail;
