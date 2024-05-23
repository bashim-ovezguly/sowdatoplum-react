import axios from "axios";
import React from "react";
import { BiCalendar, BiMap } from "react-icons/bi";
import { server } from "../../static";
import {
    MdCancel,
    MdCheck,
    MdClose,
    MdImage,
    MdSave,
    MdWarning,
} from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";

import { AiFillDelete } from "react-icons/ai";
import { IoMdEye, IoMdTrash } from "react-icons/io";
import LocationSelector from "../LocationSelector";
import { CircularProgress } from "@mui/material";

class AdminProductDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            status: "",
            customer: "",
            store: "",
            category: "",
            name: "",
            location: "",
            img: "./default.png",
            created_at: "",
            detail_text: "",
            images: [],
            price: "",
            brand: "",
            unit: "",
            viewed: 0,
            address: "",
            customer_id: "",
            customer_name: "",
            phone: "",
            allLocations: [],
            categories: [],
            brands: [],
            units: [],
            countries: [],
            made_in: [],
            stores: [],
            customers: [],

            location_name: "",
            location_id: "",

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Admin | Product detail";
    }
    componentDidMount() {
        this.setData();
    }

    setData() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/index/stores/all").then((resp) => {
            this.setState({ stores: resp.data });
        });

        axios.get(server + "/mob/customers").then((resp) => {
            this.setState({ customers: resp.data });
        });

        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                units: resp.data["units"],
                countries: resp.data["countries"],
                brands: resp.data["brands"],
            });
        });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];
        this.setState({ id: id });

        axios
            .get(server + "/api/admin/products/" + id, this.state.headers)
            .then((resp) => {
                this.setState({
                    name: resp.data["name_tm"],
                    location: resp.data["location"],
                    viewed: resp.data["viewed"],
                    detail_text: resp.data["body_tm"],
                    img: resp.data["img"],
                    price: resp.data["price"],
                    created_at: resp.data["created_at"],
                    images: resp.data["images"],
                    category: resp.data["category"],
                    address: resp.data["address"],
                    phone: resp.data["phone"],
                    customer_id: resp.data.customer_id,
                    customer: resp.data.customer,
                    amount: resp.data["amount"],
                    brand: resp.data["brand"],
                    unit: resp.data["unit"],
                    made_in: resp.data["made_in"],
                    status: resp.data["status"],
                    active: resp.data["active"],
                    credit: resp.data["credit"],
                    swap: resp.data["swap"],
                    none_cash_pay: resp.data["none_cash_pay"],
                    moderated_at: resp.data["moderated_at"],
                    moderator: resp.data["moderator"],
                    store: resp.data["store"],
                    store_name: resp.data["store_name"],
                    store_id: resp.data.store_id,
                    location_name: resp.data.location,
                    location_id: resp.data.location_id,
                    error: resp.data.error_reason,
                    on_slider: resp.data.on_slider,

                    isLoading: false,
                });

                if (resp.data["status"] === "pending") {
                    this.setState({ status: "Barlagda" });
                }
                if (resp.data["status"] === "accepted") {
                    this.setState({ status: "Kabul edilen" });
                }
                if (resp.data["status"] === "canceled") {
                    this.setState({ status: "Gaýtarlan" });
                }
            });
    }

    deleteProduct() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result == false) {
            return null;
        }

        axios
            .post(
                server + "/api/admin/products/delete/" + this.state.id,
                {},
                this.state.headers
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
                server + "/api/admin/products/" + this.state.id + "/",
                fdata,
                this.state.headers
            )
            .then((resp) => {
                this.setData();
            });
    }

    sendSMS(msg) {
        var formdata = new FormData();

        formdata.append("msg", msg);

        axios
            .put(
                server + "/api/admin/sms/" + this.state.id,
                formdata,
                this.state.headers
            )
            .then((resp) => {})
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(
                server + "/api/admin/products/" + this.state.id + "/",
                formdata,
                this.state.headers
            )
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") == true)
            axios
                .post(server + "/mob/products/img/delete/" + id)
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

        this.setState({ isLoading: true });
        axios
            .put(server + "/mob/products/" + this.state.id, formdata)
            .then((resp) => {
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        var formdata = new FormData();
        formdata.append("name_tm", document.getElementById("name").value);

        if (document.getElementById("category").value != "") {
            formdata.append(
                "category",
                document.getElementById("category").value
            );
        }

        formdata.append("body_tm", document.getElementById("body_tm").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("customer", document.getElementById("customer").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("error_reason", document.getElementById("error").value);
        formdata.append("location", this.state.location_id);

        if (document.getElementById("active").checked) {
            formdata.append("active", true);
        } else {
            formdata.append("active", false);
        }

        if (document.getElementById("on_slider").checked) {
            formdata.append("on_slider", true);
        } else {
            formdata.append("on_slider", false);
        }

        this.setState({ isLoading: true });
        axios
            .put(
                server + "/api/admin/products/" + this.state.id + "/",
                formdata,
                this.state.headers
            )
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: true });
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        let images = [];
        this.state.images.map((item) => {
            images.push(server + item.img_m);
        });

        return (
            <div className="product_detail">
                {this.state.isLoading && (
                    <div>
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="flex flex-wrap">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                    >
                        <MdCheck></MdCheck>
                        <label>Kabul etmek</label>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("canceled");
                        }}
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                    >
                        <MdCancel></MdCancel>
                        <label>Gaýtarmak</label>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                    >
                        <MdWarning></MdWarning>
                        <label>Barlaga geçirmek</label>
                    </button>

                    <button
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                    >
                        <MdImage></MdImage>
                        <button>Surat goşmak</button>
                    </button>
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

                    <button
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                        onClick={() => {
                            this.save();
                        }}
                    >
                        <MdSave></MdSave>
                        <label>Ýatda sakla</label>
                    </button>
                    <button
                        onClick={() => {
                            this.deleteProduct();
                        }}
                        className="border p-2 m-1 flex items-center text-[12px] hover:bg-slate-100"
                    >
                        <IoMdTrash></IoMdTrash>
                        <label>Bozmak</label>
                    </button>
                </div>

                <div className="grid grid-cols-[max-content_auto] sm:grid-cols-1">
                    <img
                        alt=""
                        className="w-52 h-52 border my-3 object-cover rounded-md mx-2"
                        src={server + this.state.img}
                    ></img>
                    {/* TEXT */}
                    <div className="grid h-max m-2">
                        <h2 className="text-3xl">{this.state.name}</h2>
                        <div className="flex text-lg items-center">
                            <IoMdEye></IoMdEye> {this.state.viewed}
                            <BiCalendar></BiCalendar> {this.state.created_at}
                        </div>
                        <label>Statusy: {this.state.status} </label>
                    </div>
                </div>

                <div className="images">
                    {this.state.images.map((item) => {
                        return (
                            <div className="imageCard overflow-hidden rounded-md">
                                <img
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_s}
                                    className="object-contain border"
                                ></img>
                                <div className="grid grid-cols-2 content-center bg-slate-200 p-2">
                                    <AiFillDelete
                                        className="hover:text-slate-300 duration-200"
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                    ></AiFillDelete>
                                    <MdCheck
                                        className="hover:text-slate-300 duration-200"
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                    ></MdCheck>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid max-w-[600px]">
                    <div>
                        <label>Slaýderde gorkez</label>
                        {this.state.on_slider ? (
                            <input
                                defaultChecked
                                type="checkbox"
                                id="on_slider"
                            ></input>
                        ) : (
                            <input type="checkbox" id="on_slider"></input>
                        )}
                    </div>

                    <div>
                        <label>Aktiw</label>
                        {this.state.active ? (
                            <input
                                defaultChecked
                                type="checkbox"
                                id="active"
                            ></input>
                        ) : (
                            <input type="checkbox" id="active"></input>
                        )}
                    </div>

                    <label>Ady</label>
                    <input id="name" defaultValue={this.state.name}></input>

                    <label>Bahasy</label>
                    <input id="price" defaultValue={this.state.price}></input>

                    <div className="border rounded-md my-1 p-[10px] flex items-center ">
                        <BiMap
                            size={35}
                            className="p-2 hover:bg-slate-200 rounded"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        ></BiMap>
                        <label>{this.state.location_name}</label>
                        <MdClose
                            size={25}
                            className="border p-1"
                            onClick={() => {
                                this.setState({
                                    location_id: "",
                                    location_name: "",
                                });
                            }}
                        ></MdClose>
                    </div>

                    {this.state.locationSelectorOpen && (
                        <LocationSelector parent={this}></LocationSelector>
                    )}

                    <label>Dükany</label>
                    <select id="store">
                        <option value={this.state.store_id} hidden>
                            {this.state.store_name}
                        </option>
                        {this.state.stores.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>

                    <label>Ulanyjy</label>
                    <select id="customer">
                        <option value={this.state.customer_id} hidden>
                            {this.state.customer_id} {this.state.customer}
                        </option>
                        <option value={""}>(Görkezilmedik)</option>
                        {this.state.customers.map((item) => {
                            return (
                                <option value={item.id}>
                                    {" "}
                                    {item.id} {item.name} {item.phone}
                                </option>
                            );
                        })}
                    </select>

                    <label>Kategoriýasy</label>
                    <select id="category">
                        <option value={""} hidden>
                            {this.state.category}
                        </option>
                        {this.state.categories.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>

                    <label>Goşmaça maglumat</label>
                    <textarea
                        id="body_tm"
                        defaultValue={this.state.detail_text}
                    ></textarea>

                    <label>Telefon belgisi</label>
                    <input
                        defaultValue={this.state.phone}
                        id="phone"
                        type="text"
                    ></input>

                    <label>Ýalňyşlyk</label>
                    <input id="error" defaultValue={this.state.error}></input>
                </div>
            </div>
        );
    }
}

export default AdminProductDetail;
