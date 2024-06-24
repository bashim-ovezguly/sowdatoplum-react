import axios from "axios";
import React from "react";
import { BiMap, BiPlus } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import { server } from "../../static";
import LocationSelector from "../LocationSelector";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

class AdminCars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            statuses: [],
            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            newCarOpen: false,
            selected_images: [],
            categories: [],
            transmissions: [],
            countries: [],
            colors: [],
            wds: [],
            models: [],
            marks: [],
            fuels: [],
            bodyTypes: [],
            stores: [],
            location_id: "",
            customers: [],
            cars: [],
            pageNumber: 1,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Cars";
        this.setData();
    }

    saveNewCar() {
        var formdata = new FormData();

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("address", document.getElementById("address").value);
        formdata.append(
            "body_type",
            document.getElementById("body_type").value
        );
        formdata.append("location", this.state.location_id);
        formdata.append("mark", document.getElementById("mark").value);
        formdata.append("model", document.getElementById("model").value);
        formdata.append("color", document.getElementById("color").value);
        formdata.append("fuel", document.getElementById("fuel").value);
        formdata.append(
            "transmission",
            document.getElementById("transmission").value
        );
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("wd", document.getElementById("wd").value);
        formdata.append("engine", document.getElementById("engine").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("customer", document.getElementById("customer").value);

        let imageFiles = document.getElementById("imgselector").files;

        for (let i = 0; i < imageFiles.length; i++) {
            formdata.append("images", imageFiles[i]);
        }

        if (this.props.stores === "all") {
            formdata.append("store", document.getElementById("store").value);
        } else {
            if (this.state.storeID != null) {
                formdata.append("store", this.state.storeID);
            }
        }

        if (document.getElementById("swap").checked === true) {
            formdata.append("swap", true);
        }

        if (document.getElementById("credit").checked === true) {
            formdata.append("credit", true);
        }

        if (document.getElementById("none_cash_pay").checked === true) {
            formdata.append("none_cash_pay", true);
        }

        if (document.getElementById("recolored").checked === true) {
            formdata.append("recolored", true);
        }
        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/cars", formdata, this.state.auth)
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("Awtoulag üstünlikli goşuldy");
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    addCarModal() {
        if (this.state.newCarOpen === false) {
            return null;
        }

        return (
            <div className="newCar absolute mx-auto left-0 right-0 bg-white p-4 shadow-lg grid max-w-[600px]">
                <label>
                    Saýlanan surat jemi: {this.state.selected_images.length}{" "}
                    sany{" "}
                </label>

                <input
                    onChange={(event) => {
                        console.log(event.target.files.length);
                    }}
                    id="imgselector"
                    multiple
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <div>
                    <BiMap
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                        className="icon"
                    ></BiMap>
                    <label>{this.state.location_name}</label>
                </div>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <select id="store">
                    <option value={""}>Dükan</option>
                    {this.state.stores.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>

                <select id="customer">
                    <option hidden value={""}>
                        Satyjy
                    </option>
                    {this.state.customers.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {" "}
                                {item.phone} {item.name}
                            </option>
                        );
                    })}
                </select>

                <select
                    onChange={() => {
                        this.setState(
                            {
                                selectedMark:
                                    document.getElementById("mark").value,
                            },
                            () => {
                                this.setState();
                            }
                        );
                    }}
                    id="mark"
                >
                    <option hidden value={""}>
                        Markasy
                    </option>
                    {this.state.marks.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <select id="model">
                    <option hidden value={""}>
                        Model
                    </option>
                    {this.state.models.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <input
                    id="price"
                    placeholder="Bahasy (TMT)"
                    type={"number"}
                    min={0}
                ></input>
                <input id="address" placeholder="Salgysy"></input>
                <input
                    id="engine"
                    type={"number"}
                    step={0.1}
                    min={0}
                    max={10}
                    placeholder="Motoryň göwrümi"
                ></input>
                <input
                    id="millage"
                    type={"number"}
                    min={0}
                    placeholder="Geçen ýoly (km)"
                ></input>
                <input
                    id="year"
                    type={"number"}
                    min={1900}
                    placeholder="Ýyly"
                ></input>

                <select id="body_type">
                    <option hidden value={""}>
                        Kuzow görnüşi
                    </option>
                    {this.state.bodyTypes.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <select id="color">
                    <option hidden value={""}>
                        Reňki
                    </option>
                    {this.state.colors.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <select id="fuel">
                    <option hidden value={""}>
                        Ýangyjy
                    </option>
                    {this.state.fuels.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>

                <select id="transmission">
                    <option hidden value={""}>
                        Transmissiýa (korobka)
                    </option>
                    {this.state.transmissions.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>

                <select id="wd">
                    <option hidden value={""}>
                        Ýörediji görnüşi
                    </option>
                    {this.state.wds.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>

                <textarea
                    id="body_tm"
                    placeholder="Giňişleýin maglumat..."
                ></textarea>

                <input
                    id="phone"
                    className="phone"
                    placeholder="Telefon belgisi"
                ></input>

                <div>
                    <div className="checkbox">
                        <input id="swap" type={"checkbox"}></input>
                        <label>Çalşyk</label>
                    </div>
                    <div className="checkbox">
                        <input id="credit" type={"checkbox"}></input>
                        <label>Kredit</label>
                    </div>
                    <div className="checkbox">
                        <input id="none_cash_pay" type={"checkbox"}></input>
                        <label>Nagt däl töleg</label>
                    </div>
                    <div className="checkbox">
                        <input id="recolored" type={"checkbox"}></input>
                        <label>Reňki üýtgedilen</label>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => {
                            this.saveNewCar();
                        }}
                        className="border m-1 p-1 bg-sky-600 text-white"
                    >
                        Goşmak
                    </button>
                    <button
                        className="border m-1 p-1 bg-sky-600 text-white"
                        onClick={() => {
                            this.setState({ newCarOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    setData() {
        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/car" + q).then((resp) => {
            this.setState({
                categories: resp.data.categories,
                transmissions: resp.data.transmissions,
                countries: resp.data.countries,
                colors: resp.data.colors,
                wds: resp.data.wheel_drives,
                models: resp.data.models,
                marks: resp.data.marks,
                fuels: resp.data.fuels,
                bodyTypes: resp.data.body_types,
            });
            this.setState({ isLoading: false });
        });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios
            .get(server + "/api/admin/stores?pagination=None", {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ stores: resp.data });
            });

        axios.get(server + "/mob/customers", this.state.auth).then((resp) => {
            this.setState({ customers: resp.data });
        });

        axios.get(server + "/mob/index/car").then((resp) => {
            this.setState({ categories: resp.data.categories });
            this.setState({ countries: resp.data.countries });
        });

        axios
            .get(server + "/api/admin/cars/?page=" + this.state.current_page, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ locations: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ cars: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    filter_modal() {
        return (
            <div className="filter">
                <h3>Filter </h3>
                <div className="name-field-form">
                    <input id="id" hidden></input>
                    <label>Ady</label>
                    <input id="edit_name" type="search"></input>

                    <label>Statusy</label>
                    <select id="status">
                        <option></option>
                        {this.state.statuses.map((item) => {
                            return (
                                <option value={item.id}> {item.name}</option>
                            );
                        })}
                    </select>

                    <label>Tertip belgisi</label>
                    <input
                        id="sort_order"
                        type="number"
                        placeholder="Tertip belgisi"
                    ></input>
                    <label>Degişli ýeri</label>

                    <select id="parent">
                        {this.state.all_locations.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>

                    <label>Aktiw ýagdaýy</label>
                    <select>
                        <option>Hemmesi</option>
                        <option>Aktiw</option>
                        <option>Passiw</option>
                    </select>
                </div>
                <button
                    className="save"
                    onClick={() => {
                        this.edit();
                    }}
                >
                    Filter et
                </button>
            </div>
        );
    }

    setPage(pageNumber) {
        this.setState({ current_page: pageNumber });
        axios
            .get(server + "/api/admin/cars?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ cars: resp.data.data });
            });
    }

    render() {
        return (
            <div className="grid">
                <h3>
                    Awtoulaglar ({this.state.total} sany)
                    {this.state.isLoading && <label> Ýüklenýär...</label>}
                </h3>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setState();
                        }}
                        className="flex items-center text-[12px] border rounded-md m-1 p-1 hover:bg-slate-200"
                    >
                        <label>Refresh</label>
                        <MdRefresh></MdRefresh>
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ newCarOpen: true });
                        }}
                        className="flex items-center text-[12px] border rounded-md m-1 p-1 hover:bg-slate-200"
                    >
                        <label>Goşmak</label>
                        <BiPlus></BiPlus>
                    </button>
                </div>

                {this.addCarModal()}

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={Number(this.state.last_page)}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="grid grid-cols-6 sm:grid-cols-2 ">
                    {this.state.cars.map((item, index) => {
                        return (
                            <Link
                                to={"/admin/cars/" + item.id}
                                key={item.id}
                                className="item m-2 shadow-md rounded-md overflow-hidden border"
                            >
                                <img
                                    className="w-full h-[200px] sm:h-[150px] object-cover"
                                    src={server + item.img.img_s}
                                    alt=""
                                ></img>

                                <div className="text grid text-[14px] p-[5px]">
                                    <label className="font-bold">
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="text-blue-700 font-bold">
                                        {item.price}
                                    </label>

                                    {item.customer !== "" && (
                                        <div className="flex items-center">
                                            <img
                                                src={server + item.customer.img}
                                                alt=""
                                                className="w-[20px] h-[20px] rounded-full border m-1"
                                            ></img>
                                            <label className="name">
                                                {item.customer.name}
                                            </label>
                                        </div>
                                    )}

                                    <label className="text-[12px]">
                                        {item.created_at}
                                    </label>
                                    {item.status === "canceled" && (
                                        <label className="text-red-600">
                                            Gaýtarlan
                                        </label>
                                    )}
                                    {item.status === "pending" && (
                                        <label className="text-orange-600">
                                            Garaşylýar
                                        </label>
                                    )}
                                    {item.status === "accepted" && (
                                        <label className="text-green-600 font-bold text-[12px]">
                                            Kabul edilen
                                        </label>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AdminCars;
