import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiFilter, BiMap, BiSearch } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class Parts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            cars: [],
            url_params: [],
            count: "",
            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Awtoşaýlar";
        this.setData();
    }

    setFilter() {
        let params = {
            mark: document.getElementById("filter_name").value,
            model: document.getElementById("filter_check_state").value,
            price_min: document.getElementById("filter_price_min").value,
            price_max: document.getElementById("filter_price_max").value,
        };

        this.setState({ url_params: params });
    }

    setData() {
        this.setState({ isLoading: true });
        axios
            .get(server + "/mob/parts", { params: this.state.url_params })
            .then((resp) => {
                this.setState({ cars: resp.data.data });
                this.setState({ isLoading: false });
                this.setState({ count: resp.data.data.length });
            });
    }

    filterModal() {
        return (
            <div className="filter">
                <label className="fieldName">Ady</label>
                <input className="field" type="search"></input>

                <label className="fieldName">Kategoriýasy</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Markasy</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Model</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Bahasy (min)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Bahasy (max)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Ýerleşýän ýeri</label>
                <div className="field">
                    <BiMap></BiMap>
                </div>

                <button
                    onClick={() => {
                        this.setData();
                    }}
                >
                    Gözle
                </button>
            </div>
        );
    }

    render() {
        var default_img_url = "/default.png";
        return (
            <div className="auto_parts p-[20px] grid">
                <label className="text-[20px] text-sky-800">
                    Awtoşaýlar {this.state.count}
                </label>

                {this.state.isLoading && (
                    <div className="progress">
                        {" "}
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="flex flex-wrap">
                    {this.state.cars.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/parts/" + item.id}
                                className="grid grid-rows-[max-content_auto] hover:shadow-slate-700/50 duration-200
                                shadow-md rounded-md w-[200px] m-2 overflow-hidden border"
                            >
                                <img
                                    className="w-full h-[200px] object-cover"
                                    alt=""
                                    src={img_url}
                                ></img>
                                <div className="text-slate-600 p-[5px] text-[13px] grid h-max">
                                    <label className="font-bold text-[14px]">
                                        {item.name_tm}
                                    </label>
                                    <label>
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="text-sky-600 font-bold text-[18px]">
                                        {item.price}
                                    </label>
                                    <div>
                                        <BiMap></BiMap>
                                        <label>{item.location}</label>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Parts;
