import axios from "axios";
import React from "react";
import { BiLeftArrow, BiMap, BiPlus, BiRightArrow } from "react-icons/bi";
import { server } from "../../static";
import LocationSelector from "../LocationSelector";
import { Link } from "react-router-dom";
import ProgressIndicator from "../ProgressIndicator";
import { MdRefresh } from "react-icons/md";

class TradeCenters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            datalist: [],

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",

            addOpen: false,
            locationSelectorOpen: false,
            location_name: "",
            location_id: "",

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Söwda merkezler";
        this.setData();
    }

    next_page() {
        if (this.state.last_page >= this.state.current_page + 1) {
            var next_page_number = this.state.current_page + 1;
            this.setState({ current_page: next_page_number }, () => {
                this.setData();
            });
        }
    }
    prev_page() {
        if (this.state.current_page - 1 != 0) {
            this.setState({ current_page: this.state.current_page - 1 }, () => {
                this.setData();
            });
        }
    }

    setData() {
        axios
            .get(
                server +
                    "/api/adm/trade_centers/?page=" +
                    this.state.current_page,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ datalist: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ customers: resp.data.data });
            });
    }

    edit_img(id) {
        var fdata = new FormData();
        fdata.append("img_l", document.getElementById("imgselector").value);

        axios
            .put(
                server + "/api/adm/trade_centers/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            });
    }

    delete(id) {
        var result = window.confirm("Bozmaga ynamyňyz barmy?");

        if (result === true) {
            axios
                .post(
                    server + "/api/adm/trade_centers/delete/" + id,
                    {},
                    this.state.auth
                )
                .then((resp) => {
                    this.setData();
                });
        }
    }

    saveNewTradeCenter() {
        var formdata = new FormData();
        this.setState({ isLoading: true });
        this.setState({ addOpen: false });

        formdata.append("name_tm", document.getElementById("name").value);
        formdata.append("location", this.state.location_id);

        if (document.getElementById("imgselector").files.length > 0) {
            formdata.append(
                "img_l",
                document.getElementById("imgselector").files[0]
            );
        }

        axios
            .post(server + "/api/adm/trade_centers/", formdata, this.state.auth)
            .then((resp) => {
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    NewTradeCenterModal() {
        if (this.state.addOpen === false) {
            return null;
        }

        return (
            <div className="absolute left-0 right-0 mx-auto max-w-[600px] bg-white rounded-md p-2 grid shadow-lg border ">
                <h3 className="font-bold">Täze söwda merkezi</h3>
                <input id="name" placeholder="Ady"></input>
                <input
                    id="sort_order"
                    placeholder="Tertip belgisi"
                    type="number"
                    min={0}
                ></input>
                <div className="flex items-center border rounded-md p-2">
                    <BiMap className="icon"></BiMap>
                    <label>Ýerleşýän ýeri - {this.state.location_name} </label>
                </div>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <input
                    id="imgselector"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <div className="text-[12px]">
                    <button
                        className="p-2 mx-1 bg-slate-600 text-white rounded-md"
                        onClick={() => {
                            this.saveNewTradeCenter();
                        }}
                    >
                        Ýatda saklamak
                    </button>
                    <button
                        className="p-2 mx-1 bg-slate-600 text-white rounded-md"
                        onClick={() => {
                            this.setState({ addOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="grid">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                {this.NewTradeCenterModal()}
                <div className="flex items-center flex-wrap text-[12px] border-b ">
                    <h3 className="p-2 text-[17px] font-bold">
                        Söwda merkezler {this.state.total} sany
                    </h3>
                    <button
                        className="rounded-md border p-2 mx-1 hover:shadow-md"
                        onClick={() => {
                            this.setData();
                            this.setState({ isLoading: true });
                        }}
                    >
                        <MdRefresh size={20}></MdRefresh>
                    </button>
                    <button
                        className="rounded-md border p-2 mx-1 hover:shadow-md"
                        onClick={() => {
                            this.setState({ addOpen: true });
                        }}
                    >
                        <BiPlus size={20}></BiPlus>
                    </button>

                    {this.state.locationSelectorOpen && (
                        <LocationSelector parent={this}></LocationSelector>
                    )}
                </div>

                <div className="pagination">
                    <button
                        onClick={() => {
                            this.prev_page();
                        }}
                    >
                        <BiLeftArrow></BiLeftArrow>
                    </button>
                    <label>
                        Sahypa {this.state.current_page}/{this.state.last_page}{" "}
                    </label>
                    <button
                        onClick={() => {
                            this.next_page();
                        }}
                    >
                        <BiRightArrow></BiRightArrow>
                    </button>
                </div>

                <div className="flex flex-wrap justify-center">
                    {this.state.datalist.map((item) => {
                        return (
                            <Link
                                to={"/superuser/trade_centers/" + item.id}
                                className="hover:bg-slate-200 duration-200 w-[250px] m-2 p-2 shadow-md rounded-md text-[12px]
                                overflow-hidden grid border"
                            >
                                <img
                                    className="w-full h-[150px] object-cover rounded-md"
                                    alt=""
                                    src={item.img_l}
                                ></img>
                                <label className=" font-bold">
                                    {item.name_tm}
                                </label>
                                <label className="">
                                    Stores: {item.stores.length}
                                </label>
                                <div className="flex items-center">
                                    <BiMap className="location icon"></BiMap>
                                    <label className="">{item.location}</label>
                                </div>
                                {item.active === "true" ? (
                                    <label className="bg-green-600 text-white p-1 my-1 w-max rounded-md">
                                        Aktiw
                                    </label>
                                ) : (
                                    <label className="bg-orange-600 text-white p-1 my-1 w-max rounded-md">
                                        Passiw
                                    </label>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TradeCenters;
