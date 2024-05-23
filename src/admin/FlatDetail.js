import axios from "axios";
import React from "react";

import { BiCheck, BiSave, BiTime } from "react-icons/bi";
import { server } from "../static";
import "./admin.css";
import { BiMap } from "react-icons/bi";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LocationSelector from "./LocationSelector";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import {
    MdCancel,
    MdDelete,
    MdImage,
    MdPending,
    MdPlusOne,
    MdTimer,
} from "react-icons/md";

import { MdAnnouncement, MdCheck, MdSave, MdWarning } from "react-icons/md";
import { IoMdEye, IoMdTrash } from "react-icons/io";
import { FiArrowUp } from "react-icons/fi";

class FlatDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            img: "./default.png",
            images: [],
            locations: [],
            categories: [],
            remont_states: [],
            location_name: "",
            location_id: "",
            price: "",
            phone: "",

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Gozgalmaýan emläk | Giňişleýin";
        this.setData();
    }

    setData() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/index/flat").then((resp) => {
            this.setState({ categories: resp.data.categories });
        });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios
            .get(server + "/api/admin/flats/" + id, this.state.auth)
            .then((resp) => {
                this.setState({
                    name: resp.data.title_tm,
                    location_name: resp.data.location,
                    location_id: resp.data.location_id,
                    viewed: resp.data.viewed,
                    detail: resp.data.detail,
                    img: resp.data.img,
                    id: resp.data.id,
                    exprire_at: resp.data.exprire_at,
                    sort_order: resp.data.sort_order,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    category: resp.data.category,
                    category_id: resp.data.category_id,
                    status: resp.data.status,
                    active: resp.data.active,
                    price: resp.data.price.replace(" ", "").replace(" TMT", ""),
                    at_floor: resp.data.at_floor,
                    floor: resp.data.floor,
                    people: resp.data.people,
                    swap: resp.data.swap,
                    credit: resp.data.price,
                    ipoteka: resp.data.ipoteka,
                    square: resp.data.square,
                    address: resp.data.address,
                    room: resp.data.room_count,
                    phone: resp.data.phone,
                    for_rent: resp.data.for_rent,
                    customer_id: resp.data.customer_id,
                });

                this.setState({ isLoading: false });
            });
    }

    deleteFlat() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result == false) {
            return null;
        }

        axios
            .post(
                server + "/mob/flats/delete/" + this.state.id,
                {},
                this.state.auth
            )
            .then((resp) => {
                window.history.back();
            });
    }

    changeStatus(statusValue) {
        var fdata = new FormData();
        fdata.append("for_rent", this.state.for_rent);
        fdata.append("status", statusValue);
        axios
            .put(
                server + "/api/admin/flats/" + this.state.id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(
                server + "/api/admin/flats/" + this.state.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    deleteImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") == true)
            axios
                .post(server + "/mob/flats/img/delete/" + id)
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
        formdata.append("flat", this.state.id);

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(
                server + "/mob/flats/" + this.state.id,
                formdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        if ((this.state.location_name == "") | (this.state.location_id == "")) {
            alert("Ýerleşýän ýerini hökman görkezmeli");
            return null;
        }
        var formdata = new FormData();
        formdata.append("price", document.getElementById("price").value);
        formdata.append("address", document.getElementById("address").value);

        if (document.getElementById("own").checked) {
            formdata.append("own", true);
        }

        if (document.getElementById("swap").checked) {
            formdata.append("swap", true);
        }
        if (document.getElementById("credit").checked) {
            formdata.append("credit", true);
        }
        if (document.getElementById("ipoteka").checked) {
            formdata.append("ipoteka", true);
        }

        if (document.getElementById("for_rent").checked) {
            formdata.append("for_rent", true);
        } else {
            formdata.append("for_rent", false);
        }

        formdata.append("at_floor", document.getElementById("at_floor").value);
        formdata.append("floor", document.getElementById("floor").value);
        formdata.append("square", document.getElementById("square").value);
        formdata.append(
            "remont_state",
            document.getElementById("remont_state").value
        );
        formdata.append("people", document.getElementById("people").value);
        formdata.append("credit", document.getElementById("credit").value);
        formdata.append("swap", document.getElementById("swap").value);
        formdata.append("ipoteka", document.getElementById("ipoteka").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append(
            "customer",
            document.getElementById("customer_id").value
        );

        if (document.getElementById("store") != null) {
            formdata.append("store", document.getElementById("store").value);
        }

        formdata.append("category", document.getElementById("category").value);
        formdata.append("room_count", document.getElementById("room").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("location", this.state.location_id);

        axios
            .put(
                server + "/api/admin/flats/" + this.state.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        return (
            <div className="flat_detail">
                <div className="flex flex-wrap text-slate-600">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="accept"
                    >
                        <MdCheck
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdCheck>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("canceled");
                        }}
                        className="cancel"
                    >
                        <MdCancel
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdCancel>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="onCheck"
                    >
                        <MdWarning
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdWarning>
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ add_product_open: true });
                        }}
                    >
                        <MdPlusOne
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdPlusOne>
                    </button>
                    <button
                        onClick={() => {
                            this.save();
                        }}
                    >
                        <MdSave
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdSave>
                    </button>
                    <button
                        onClick={() => {
                            this.deleteStore();
                        }}
                    >
                        <IoMdTrash
                            onClick={() => {
                                this.deleteFlat();
                            }}
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></IoMdTrash>
                    </button>
                    <button
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                    >
                        <MdImage
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdImage>
                    </button>
                    <button
                        onClick={() => {
                            this.moveUp();
                        }}
                    >
                        <FiArrowUp
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></FiArrowUp>
                    </button>
                    <button
                        className="flex items-center"
                        onClick={() => {
                            this.setState({ productsModalOpen: true });
                        }}
                    ></button>
                </div>

                <input
                    onChange={() => {
                        this.addSelectedImages();
                    }}
                    id="imgselector"
                    multiple
                    hidden
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <div className="gallery">
                    <div className="flex my-[10px]">
                        <div className="grid mx-[10px]">
                            <img
                                alt=""
                                className="w-[200px] h-[200px] object-cover rounded-md shadow-md"
                                src={server + this.state.img}
                            ></img>
                        </div>
                        <div className="h-max grid">
                            <h2 className="my-[10px] text-[30px]">
                                {this.state.name}
                            </h2>
                            <div className="flex items-center">
                                <MdTimer></MdTimer>
                                <label>{this.state.created_at}</label>
                                <IoMdEye></IoMdEye>
                                <label>{this.state.viewed}</label>
                            </div>

                            <label>Statusy: {this.state.status}</label>

                            <div>
                                <label>Premium</label>
                                {this.state.premium === "True" ? (
                                    <input
                                        id="premium"
                                        type="checkbox"
                                        defaultChecked
                                    ></input>
                                ) : (
                                    <input id="premium" type="checkbox"></input>
                                )}
                            </div>

                            <div>
                                <label>Slaýderde</label>
                                {this.state.on_slider === "True" ? (
                                    <input
                                        id="on_slider"
                                        type="checkbox"
                                        defaultChecked
                                    ></input>
                                ) : (
                                    <input
                                        id="on_slider"
                                        type="checkbox"
                                    ></input>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="images">
                        {this.state.images.map((item) => {
                            return (
                                <div className="grid m-1 overflow-hidden rounded-lg">
                                    <a href={server + item.img} target="_blank">
                                        <img
                                            alt=""
                                            className="object-cover w-full h-full"
                                            defaultValue={"/default.png"}
                                            src={server + item.img_s}
                                        ></img>
                                    </a>
                                    <div className="text-slate-600 grid grid-cols-2 w-full items-center">
                                        <AiFillDelete
                                            size={25}
                                            className="bg-slate-300 w-full p-[2px] hover:bg-slate-500/50"
                                            onClick={() => {
                                                this.removeImage(item.id);
                                            }}
                                        ></AiFillDelete>
                                        <AiFillCheckCircle
                                            className="bg-slate-300 w-full p-[2px] hover:bg-slate-500/50"
                                            size={25}
                                            onClick={() => {
                                                this.setMainImage(item.id);
                                            }}
                                        ></AiFillCheckCircle>
                                    </div>
                                </div>
                            );
                        })}
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
                </div>

                <div className="textData">
                    <div className="fields">
                        <div className="rdbtns">
                            <label>Kärende</label>
                            {this.state.for_rent == true ? (
                                <input
                                    checked
                                    id="for_rent"
                                    name="rent"
                                    type="radio"
                                ></input>
                            ) : (
                                <input
                                    id="for_rent"
                                    name="rent"
                                    type="radio"
                                ></input>
                            )}

                            <label>Satlyk</label>
                            {this.state.for_rent == false ? (
                                <input
                                    checked
                                    id="for-sale"
                                    name="rent"
                                    type="radio"
                                ></input>
                            ) : (
                                <input
                                    id="for-sale"
                                    name="rent"
                                    type="radio"
                                ></input>
                            )}
                        </div>

                        <label>Telefon belgisi</label>
                        <input
                            min={0}
                            id="phone"
                            defaultValue={this.state.phone}
                        ></input>

                        <label>Customer ID</label>
                        <input
                            defaultValue={this.state.customer_id}
                            id="customer_id"
                            type="number"
                        ></input>

                        <div>
                            <BiMap
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            {this.state.location_name}
                        </div>

                        {this.state.locationSelectorOpen == true && (
                            <LocationSelector
                                parent={this}
                                open={this.state.locationSelectorOpen}
                            ></LocationSelector>
                        )}

                        <label>Kategoriýasy</label>
                        <select id="category">
                            <option value={this.state.category_id} hidden>
                                {this.state.category}
                            </option>
                            {this.state.categories.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Remont yagdayy</label>
                        <select id="remont_state">
                            <option value={""} hidden>
                                {this.state.remont_state}
                            </option>
                            {this.state.remont_states.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Bina gat sany</label>
                        <input
                            id="floor"
                            defaultValue={this.state.floor}
                            type="number"
                        ></input>
                        <label>Ýerleşýän gaty</label>
                        <input
                            defaultValue={this.state.at_floor}
                            id="at_floor"
                            type="number"
                        ></input>
                        <label>Bahasy</label>
                        <input
                            defaultValue={this.state.price}
                            id="price"
                            type="number"
                        ></input>
                        <label>Salgysy</label>
                        <input
                            defaultValue={this.state.address}
                            id="address"
                            type="text"
                        ></input>
                        <label>Otag sany</label>
                        <input
                            defaultValue={this.state.room}
                            id="room"
                            type="number"
                        ></input>
                        <label>Meýdany</label>
                        <input
                            defaultValue={this.state.square}
                            id="square"
                            type="number"
                        ></input>
                        <label>Ýazgydaky adam sany</label>
                        <input
                            defaultValue={this.state.people}
                            id="people"
                            type="number"
                        ></input>

                        <div>
                            <label>Eýesinden</label>
                            <input id="own" type="checkbox"></input>
                        </div>
                        <div>
                            <label>Karzyna</label>
                            <input id="credit" type="checkbox"></input>
                        </div>

                        <div>
                            <label>Çalşyk </label>
                            <input id="swap" type="checkbox"></input>
                        </div>

                        <div>
                            <label>Ipoteka</label>
                            <input id="ipoteka" type="checkbox"></input>
                        </div>

                        <label>Goşmaça maglumat</label>
                        <textarea
                            id="detail"
                            defaultValue={this.state.detail}
                        ></textarea>
                    </div>
                    <div></div>
                </div>
            </div>
        );
    }
}

export default FlatDetail;
