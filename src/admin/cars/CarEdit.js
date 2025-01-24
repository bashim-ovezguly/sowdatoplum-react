import axios from "axios";
import React from "react";
import { server } from "../../static";
// import "./admin.css";
import { FcCheckmark } from "react-icons/fc";
import { AiFillDelete } from "react-icons/ai";
import LocationSelector from "../LocationSelector";
import { BiMap, BiPlus, BiTrash } from "react-icons/bi";
import Loader from "../../client/components/Loader";
import { ToastContainer, toast } from "react-toastify";

import { MdCancel, MdCheck, MdImage, MdSave, MdWarning } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { FiArrowUp } from "react-icons/fi";

class AdminCarDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            countries: [],
            images: [],
            allLocations: [],
            body_types: [],
            fuels: [],
            marks: [],
            models: [],
            location_name: "",
            location_id: "",
            stores: [],
            customers: [],
            transmissions: [],
            colors: [],
            wds: [],
            price: "",
            storeName: "",
            storeID: "",

            locationSelectorOpen: false,

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        this.setData();
    }

    setData() {
        axios.get(server + "/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/index/stores/all").then((resp) => {
            this.setState({ stores: resp.data });
        });

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/index/car" + q).then((resp) => {
            this.setState({
                categories: resp.data.categories,
                transmissions: resp.data.transmissions,
                countries: resp.data.countries,
                colors: resp.data.colors,
                wds: resp.data.wheel_drives,
                models: resp.data.models,
                marks: resp.data.marks,
                fuels: resp.data.fuels,
                body_types: resp.data.body_types,
            });
            this.setState({ isLoading: false });
        });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios
            .get(server + "/api/adm/cars/" + id, this.state.auth)
            .then((resp) => {
                this.setState({
                    active: resp.data.active,
                    credit: resp.data.credit,
                    swap: resp.data.swap,
                    on_slider: resp.data.on_slider,
                    none_cash_pay: resp.data.none_cash_pay,
                    id: resp.data.id,
                    millage: resp.data.millage,
                    on_search: resp.data.on_search,
                    vin: resp.data.vin,
                    year: resp.data.year,
                    recolored: resp.data.recolored,
                    engine: resp.data.engine,
                    viewed: resp.data.viewed,
                    detail: resp.data.detail,
                    img: resp.data.img.img_m,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    phone: resp.data.phone,
                    store_id: resp.data.store.id,
                    store_name: resp.data.store.name,
                    location_name: resp.data.location.name,
                    location_id: resp.data.location.id,
                    status: resp.data.status,
                    price: resp.data.price,
                    isLoading: false,
                });

                if (resp.data.mark != undefined) {
                    this.setState({
                        mark: resp.data.mark.name,
                        markId: resp.data.mark.id,
                    });
                }
                if (resp.data.model != undefined) {
                    this.setState({
                        model: resp.data.model.name,
                        modelId: resp.data.model.id,
                    });
                }
                if (resp.data.color != undefined) {
                    this.setState({
                        color: resp.data.color.name,
                        colorId: resp.data.color.id,
                    });
                }
                if (resp.data.body_type != undefined) {
                    this.setState({
                        body_type_name: resp.data.body_type.name,
                        body_type_id: resp.data.body_type.id,
                    });
                }
                if (resp.data.fuel != undefined) {
                    this.setState({
                        fuel_name: resp.data.fuel.name,
                        fuel_id: resp.data.fuel.id,
                    });
                }
                if (resp.data.transmission != undefined) {
                    this.setState({
                        transmission_name: resp.data.transmission.name,
                        transmission_id: resp.data.transmission.id,
                    });
                }
                if (resp.data.wd != undefined) {
                    this.setState({
                        wd_name: resp.data.wd.name,
                        wd_id: resp.data.wd.id,
                    });
                }
            });
    }

    deleteCar() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(
                server + "/api/adm/cars/delete/" + this.state.id,
                {},
                this.state.auth
            )
            .then((resp) => {
                window.history.back();
            });
    }

    changeStatus(statusValue) {
        var fdata = new FormData();

        fdata.append("status", statusValue);

        axios
            .put(
                server + "/api/adm/cars/" + this.state.id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
                toast.success("Status uytgedildi");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(server + "/cars/" + this.state.id, formdata, this.state.auth)
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(server + "/cars/img/delete/" + id, this.state.auth)
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
    }

    addSelectedImages() {
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(server + "/cars/" + this.state.id, formdata, this.state.auth)
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        var formdata = new FormData();

        formdata.append(
            "price",
            document.getElementById("price").value.replace(" ", "")
        );
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("engine", document.getElementById("engine").value);
        formdata.append("vin", document.getElementById("vin").value);

        if (document.getElementById("swap").checked) {
            formdata.append("swap", true);
        } else {
            formdata.append("swap", false);
        }

        if (document.getElementById("credit").checked) {
            formdata.append("credit", true);
        } else {
            formdata.append("credit", false);
        }

        if (document.getElementById("on_slider").checked) {
            formdata.append("on_slider", true);
        } else {
            formdata.append("on_slider", false);
        }

        if (document.getElementById("none_cash_pay").checked) {
            formdata.append("none_cash_pay", true);
        } else {
            formdata.append("none_cash_pay", false);
        }

        if (document.getElementById("color").value !== "") {
            formdata.append("color", document.getElementById("color").value);
        }

        if (document.getElementById("wd").value !== "") {
            formdata.append("wd", document.getElementById("wd").value);
        }

        if (document.getElementById("transmission").value !== "") {
            formdata.append(
                "transmission",
                document.getElementById("transmission").value
            );
        }

        if (document.getElementById("mark").value !== "") {
            formdata.append("mark", document.getElementById("mark").value);
        }

        if (document.getElementById("model").value !== "") {
            formdata.append("model", document.getElementById("model").value);
        }

        if (this.state.location_id != undefined) {
            formdata.append("location", this.state.location_id);
        }

        if (document.getElementById("fuel").value !== "") {
            formdata.append("fuel", document.getElementById("fuel").value);
        }

        if (document.getElementById("body_type").value !== "") {
            formdata.append(
                "body_type",
                document.getElementById("body_type").value
            );
        }

        axios
            .put(
                server + "/api/adm/cars/" + this.state.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        return (
            <div className="mx-auto text-[12px] p-2">
                <ToastContainer
                    closeOnClick={true}
                    autoClose={5000}
                ></ToastContainer>
                <Loader open={this.state.isLoading}></Loader>
                <div className="flex flex-wrap text-slate-600 bg-white ">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Kabul etmek</label>
                        <MdCheck size={18}></MdCheck>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Barlaga goymak</label>
                        <MdWarning size={18}></MdWarning>
                    </button>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Yatda sakla</label>
                        <MdSave size={18}></MdSave>
                    </button>

                    <button
                        onClick={() => {
                            this.deleteCar();
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Bozmak</label>
                        <BiTrash size={18}></BiTrash>
                    </button>

                    <button
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Surat goşmak</label>
                        <MdImage size={18}></MdImage>
                    </button>

                    <button
                        onClick={() => {
                            this.moveUp();
                        }}
                        className="text-[12px] hover:bg-slate-500 m-1 p-1 px-1 bg-appColor text-white flex items-center border rounded-md "
                    >
                        <label>Yokary galdyrmak</label>
                        <FiArrowUp size={18}></FiArrowUp>
                    </button>

                    <div className="imageCard">
                        <input
                            onChange={() => {
                                this.addSelectedImages();
                            }}
                            id="imgselector"
                            multiple
                            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                            hidden
                            type="file"
                        ></input>
                    </div>
                </div>

                <label className="text-[30px]">
                    {this.state.mark} {this.state.model} {this.state.year}
                </label>
                <img
                    alt=""
                    className="w-[200px] h-[200px] rounded-md shadow-md object-cover"
                    src={server + this.state.img}
                ></img>

                <div className="flex overflow-x-auto">
                    {this.state.images.map((item) => {
                        return (
                            <div className=" border m-1 rounded-xl relative">
                                <img
                                    className="w-[100px] h-[100px] object-cover rounded-md max-w-none "
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_m}
                                ></img>
                                <div className="top-1 left-1 flex items-center absolute">
                                    <AiFillDelete
                                        className="rounded-full p-1 hover:bg-slate-200 bg-white text-red-600"
                                        size={25}
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                    ></AiFillDelete>
                                    <FcCheckmark
                                        className="rounded-full p-1 hover:bg-slate-200 bg-white"
                                        size={25}
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                    ></FcCheckmark>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="max-w-[600px] mx-auto">
                    <div className="grid">
                        {this.state.status === "accepted" && (
                            <label className="bg-green-600 rounded-md px-2 text-white w-max">
                                Kabul edilen{" "}
                            </label>
                        )}
                        {this.state.status === "pending" && (
                            <label>Garaşylýar </label>
                        )}
                        {this.state.status === "canceled" && (
                            <label>Gaýtarlan </label>
                        )}

                        <label className="font-bold">Marka</label>
                        <select
                            onChange={() => {
                                this.setState(
                                    {
                                        selectedMark:
                                            document.getElementById("mark")
                                                .value,
                                    },
                                    () => {
                                        this.setData();
                                    }
                                );
                            }}
                            id="mark"
                        >
                            <option hidden value={this.state.markId}>
                                {this.state.mark}
                            </option>
                            {this.state.marks.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Model</label>
                        <select id="model">
                            <option hidden value={""}>
                                {this.state.model}
                            </option>
                            {this.state.models.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Bahasy</label>
                        <input
                            id="price"
                            defaultValue={this.state.price
                                .replace("TMT", "")
                                .replace(" ", "")}
                        ></input>

                        <label className="font-bold">Ýyly</label>
                        <input id="year" defaultValue={this.state.year}></input>

                        <label className="font-bold">Motory</label>
                        <input
                            id="engine"
                            defaultValue={this.state.engine}
                        ></input>

                        <label className="font-bold">Geçen ýoly</label>
                        <input
                            id="millage"
                            defaultValue={this.state.millage}
                        ></input>

                        <label className="font-bold">Ýangyjy</label>
                        <select id="fuel">
                            <option value={this.state.fuel_id} hidden>
                                {this.state.fuel_name}
                            </option>
                            {this.state.fuels.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>
                        <label className="font-bold">Store</label>
                        <select id="store">
                            <option value={this.state.store_id} hidden>
                                {this.state.store_name}
                            </option>
                            {this.state.stores.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="flex items-center border rounded-md p-1">
                            <BiMap
                                size={25}
                                className=" hover:bg-slate-300 rounded-md   "
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            {this.state.location_name}
                        </div>

                        {this.state.locationSelectorOpen && (
                            <LocationSelector parent={this}></LocationSelector>
                        )}

                        <label className="font-bold">Kuzow görnüşi</label>
                        <select id="body_type">
                            <option value={this.state.body_type_id} hidden>
                                {this.state.body_type_name}
                            </option>
                            {this.state.body_types.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Korobka</label>
                        <select id="transmission">
                            <option value={this.state.transmission_id} hidden>
                                {this.state.transmission_name}
                            </option>
                            {this.state.transmissions.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Reňki</label>
                        <select id="color">
                            <option value={""} hidden>
                                {this.state.color}
                            </option>
                            {this.state.colors.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Ýörediji</label>
                        <select id="wd">
                            <option value={this.state.wd_id} hidden>
                                {this.state.wd_name}
                            </option>
                            {this.state.wds.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="font-bold">Goşmaça maglumat</label>
                        <textarea
                            id="detail"
                            defaultValue={this.state.detail}
                        ></textarea>

                        <label className="font-bold">Telefon belgisi</label>
                        <input
                            id="phone"
                            type={"tel"}
                            defaultValue={this.state.phone}
                        ></input>

                        <label className="font-bold">VIN</label>
                        <input
                            id="vin"
                            type={"text"}
                            defaultValue={this.state.vin}
                        ></input>

                        <div className="flex items-center">
                            <label className="font-bold">Çalşyk</label>
                            {this.state.swap === true ? (
                                <input
                                    id="swap"
                                    defaultChecked
                                    type={"checkbox"}
                                ></input>
                            ) : (
                                <input id="swap" type={"checkbox"}></input>
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="font-bold">Kredit</label>
                            {this.state.credit === true ? (
                                <input
                                    id="credit"
                                    defaultChecked
                                    type={"checkbox"}
                                ></input>
                            ) : (
                                <input id="credit" type={"checkbox"}></input>
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="font-bold">Nagt däl töleg</label>
                            {this.state.none_cash_pay === true ? (
                                <input
                                    id="none_cash_pay"
                                    defaultChecked
                                    type={"checkbox"}
                                ></input>
                            ) : (
                                <input
                                    id="none_cash_pay"
                                    type={"checkbox"}
                                ></input>
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="font-bold">
                                Slaýderde görkez
                            </label>
                            {this.state.on_slider === true ? (
                                <input
                                    id="on_slider"
                                    defaultChecked
                                    type={"checkbox"}
                                ></input>
                            ) : (
                                <input id="on_slider" type={"checkbox"}></input>
                            )}
                        </div>
                    </div>
                    <div></div>

                    <div></div>
                </div>
            </div>
        );
    }
}

export default AdminCarDetail;
