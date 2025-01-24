import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap, BiSearch, BiSort } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { MotionAnimate } from "react-motion-animate";

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
        axios.get(server + "/mob/cars").then((resp) => {
            this.setState({ cars: resp.data.data });
            this.setState({ count: resp.data.data.length });
            this.setState({ isLoading: false });

            document.title = "Awtoulaglar";
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
            <MotionAnimate>
                <div className="cars grid p-2">
                    {this.state.filterModalIsOpen && this.filterModal()}
                    <div className="flex justify-between">
                        <h3 className="text-[15px] text-appColor font-bold">
                            Awtoulaglar {this.state.count}
                        </h3>
                    </div>

                    <label className="flex items-center bold text-18px"></label>

                    {this.state.isLoading && (
                        <div className="flex justify-center">
                            <CircularProgress></CircularProgress>
                        </div>
                    )}

                    <div className=" grid grid-cols-5 sm:grid-cols-2 justify-center">
                        {this.state.cars.map((item) => {
                            var img_url = server + item.img;
                            if (item.img === "") {
                                img_url = default_img_url;
                            }

                            return (
                                <MotionAnimate>
                                    <Link
                                        to={"/cars/" + item.id}
                                        className="grid overflow-hidden m-2 p-2 rounded-md hover:shadow-2xl text-[12px]
                                     duration-300 shadow-lg border "
                                    >
                                        <div className="">
                                            <img
                                                alt=""
                                                className="w-full h-[200px] sm:h-[150px] border rounded-md object-cover"
                                                src={img_url}
                                            ></img>
                                        </div>
                                        <div className="text grid py-1 sm:text-[10px]">
                                            <label className="name sm:text-[12px] font-bold text-slate-600  ">
                                                {item.mark} {item.model}{" "}
                                                {item.year}
                                            </label>
                                            <label className="price font-bold text-appColor rounded-r-sm">
                                                {item.price} TMT
                                            </label>

                                            <div className="text-slategrey flex items-center">
                                                <BiMap></BiMap>
                                                <label>{item.location}</label>
                                            </div>

                                            <label
                                                className="rounded-sm line-clamp-1 top-[175px] sm:top-[125px] text-slate-600
                                            font-bold  w-max"
                                            >
                                                {item.store.name}
                                            </label>
                                            <label className="">
                                                {item.created_at}
                                            </label>
                                        </div>
                                    </Link>
                                </MotionAnimate>
                            );
                        })}
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default Cars;
