import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

class Flats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            count: "",
            cars: [],

            url_params: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Gozgalmaýan emläkler";
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

        axios.get(server + "/mob/flats").then((resp) => {
            this.setState({ cars: resp.data.data });
            this.setState({ isLoading: false });
            this.setState({ count: resp.data.data.length });
        });
    }

    filterModal() {
        return (
            <div className="filter">
                <h3>Gozgalmaýan emläkler</h3>

                <label className="fieldName">Ady</label>
                <input className="field" type="search"></input>

                <label className="fieldName">Ýerleşýän ýeri</label>
                <div className="field">
                    <BiMap></BiMap>
                </div>

                <label className="fieldName">Kategoriýasy</label>
                <select className="field">
                    <option value={""}></option>
                </select>

                <label className="fieldName">Bahasy (min)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Bahasy (max)</label>
                <input className="field" type="number" min={0}></input>

                <label className="fieldName">Otag sany</label>
                <input className="field" type="number" min={1}></input>

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
            <div className="flats grid p-[10px]">
                <label className="text-[20px] text-sky-800 my-[10px]">
                    Gozgalmaýan emläkler {this.state.count}
                </label>

                {this.state.isLoading && (
                    <div className="progress">
                        {" "}
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-2">
                    {this.state.cars.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/flats/" + item.id}
                                className="grid grid-rows-[max-content_auto] duration-200 hover:shadow-lg 
                                shadow-md rounded-md text-slate-600 sm:w-[150px] m-2 overflow-hidden border"
                            >
                                <img
                                    className="h-[200px] object-cover sm:h-[150px] w-full"
                                    alt=""
                                    src={img_url}
                                ></img>
                                <div className="text-[12px] p-2 h-max grid">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>
                                    <label className="font-bold text-sky-600">
                                        {item.price}
                                    </label>
                                    <div className="flex items-center">
                                        <BiMap size={15}></BiMap>
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

export default Flats;
