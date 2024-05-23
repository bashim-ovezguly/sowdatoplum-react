import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./cars.css";
import { BiMap, BiSearch, BiSort } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class Cars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            cars: [],
            marks: [],
            models: [],
            korobka: [],
            body_types: [],
            colors: [],
            count: "",

            url_params: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        // document.title = 'Dükanlar';
        this.setData();
    }

    setFilter() {
        let params = {
            mark: document.getElementById("filter_name").value,
            model: document.getElementById("filter_check_state").value,
            price_min: document.getElementById("filter_category").value,
            price_max: document.getElementById("filter_category").value,
        };
    }

    setData() {
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const customer = urlParams.get('customer')

        // const pathname = window.location.pathname
        // const id = pathname.split('/')[2]

        axios.get(server + "/mob/cars").then((resp) => {
            this.setState({ cars: resp.data.data });
            this.setState({ count: resp.data.data.length });
            this.setState({ isLoading: false });
        });

        axios.get(server + "/mob/index/car").then((resp) => {
            this.setState({ models: resp.data.models });
            this.setState({ marks: resp.data.marks });
            this.setState({ wheels: resp.data.wheels });
            this.setState({ isLoading: false });
        });
    }

    filterModal() {
        return (
            <div className="filter rounded shadowed">
                <label className="fieldName">Markasy</label>
                <select className="field">
                    <option value={""}></option>
                    {this.state.marks.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <label className="fieldName">Model</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Korobka</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Kuzowy</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Reňki</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <div>
                    <div>
                        <label className="fieldName">Ýyly</label>
                        <input
                            className="field"
                            type="number"
                            defaultValue={2023}
                            min={1960}
                        ></input>
                    </div>
                    <div>
                        <label className="fieldName">Ýyly</label>
                        <input
                            className="field"
                            type="number"
                            defaultValue={2023}
                            min={1960}
                        ></input>
                    </div>
                </div>

                <label className="fieldName">Bahasy (min)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Bahasy (max)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Motory</label>
                <input
                    className="field"
                    type="number"
                    step={0.1}
                    min={0.8}
                ></input>

                <label className="fieldName">Ýerleşýän ýeri</label>
                <div className="field">
                    <BiMap></BiMap>
                </div>

                <div>
                    <input type="checkbox"></input> <label>Kredit</label>
                </div>
                <div>
                    <input type="checkbox"></input>{" "}
                    <label>Nagt däl töleg</label>
                </div>
                <div>
                    {" "}
                    <input type="checkbox"></input> <label>Çalşyk</label>
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
            <div className="cars p-[10px]">
                {this.state.filterModalIsOpen && this.filterModal()}
                <div className="flex justify-between">
                    <h3 className="text-[20px] text-sky-800">
                        Awtoulaglar {this.state.count}
                    </h3>
                    <div className="flex items-center text-[12px]">
                        <button className="m-5px steelblue_btn flex items-center">
                            <label>Gözleg</label>
                            <BiSearch className="m-[2px]" size={20}></BiSearch>
                        </button>
                        <button className="m-[5px] flex items-center">
                            <label>Tertibi</label>
                            <BiSort className="m-2px" size={20}></BiSort>
                        </button>
                    </div>
                </div>

                <label className="flex items-center bold text-18px"></label>

                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="items">
                    {this.state.cars.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/cars/" + item.id}
                                className="grid w-[300px] sm:w-[150px] overflow-hidden m-[10px] rounded-md hover:shadow-lg 
                                shadow-md duration-300 border"
                            >
                                <img
                                    alt=""
                                    className="w-full h-[200px] sm:h-[100px] object-cover"
                                    src={img_url}
                                ></img>
                                <div className="text grid p-3">
                                    <label className="name text-[14px] font-bold text-slate-600  ">
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="price text-blue-700 font-bold p-[2px] text-[14px] ">
                                        {item.price}
                                    </label>
                                    <div className="text-slategrey flex items-center text-[12px]">
                                        <BiMap></BiMap>
                                        <label>{item.location}</label>
                                    </div>
                                    <label className="text-[12px]">
                                        {item.created_at}
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

export default Cars;
