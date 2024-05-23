import axios from "axios";
import React from "react";
import { server } from "../static";
import "./admin.css";
import { FcCheckmark } from "react-icons/fc";
import LocationSelector from "./LocationSelector";
import { IoMdEye, IoMdTrash } from "react-icons/io";
import {
    MdCancel,
    MdCheck,
    MdClose,
    MdImage,
    MdSave,
    MdTimer,
    MdWarning,
} from "react-icons/md";
import { FiArrowUp } from "react-icons/fi";
import { BiMap, BiPlus } from "react-icons/bi";

class AdminCarPartDetail extends React.Component {
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
            wds: [],
            categories: [],
            price: "",
            locationSelectorOpen: false,
            category: "",

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
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/stores?pagination=None").then((resp) => {
            this.setState({ stores: resp.data });
        });

        axios.get(server + "/mob/customers").then((resp) => {
            this.setState({ customers: resp.data });
        });

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/part" + q).then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                transmissions: resp.data["transmissions"],
                countries: resp.data["made_in_countries"],
                colors: resp.data["colors"],
                wds: resp.data["wheel_drives"],
                models: resp.data["models"],
                marks: resp.data["marks"],
                fuels: resp.data["fuels"],
                body_types: resp.data["body_types"],
            });
            this.setState({ isLoading: false });
        });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios
            .get(server + "/api/admin/parts/" + id, this.state.auth)
            .then((resp) => {
                this.setState({
                    mark: resp.data["mark"],
                    model: resp.data["model"],
                    active: resp.data["active"],
                    color: resp.data["color"],
                    credit: resp.data["credit"],
                    swap: resp.data["swap"],
                    on_slider: resp.data.on_slider,
                    none_cash_pay: resp.data["none_cash_pay"],
                    fuel: resp.data["fuel"],
                    body_type: resp.data["body_type"],
                    id: resp.data["id"],
                    millage: resp.data["millage"],
                    on_search: resp.data["on_search"],
                    transmission: resp.data["transmission"],
                    vin: resp.data["vin"],
                    year: resp.data["year"],
                    viewed: resp.data["viewed"],
                    detail: resp.data["detail"],
                    img: resp.data.img,
                    created_at: resp.data["created_at"],
                    images: resp.data["images"],
                    category: resp.data.category,
                    phone: resp.data["phone"],
                    country: resp.data["country"],
                    store_id: resp.data.store_id,
                    store_name: resp.data.store_name,
                    location_name: resp.data.location,
                    location_id: resp.data.location_id,
                    status: resp.data.status,
                    price: resp.data.price,
                    customer_id: resp.data.customer_id,
                    customer_name: resp.data.customer_name,
                    customer_phone: resp.data.customer.phone,
                    wd: resp.data.wheel_drive,
                    name_tm: resp.data.name_tm,
                    isLoading: false,
                });
            });
    }

    deleteProduct() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(
                server + "/mob/parts/delete/" + this.state.id,
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
                server + "/api/admin/parts/" + this.state.id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
                alert("status uytgedildi");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(
                server + "/mob/parts/" + this.state.id,
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

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(server + "/mob/parts/img/delete/" + id, this.state.auth)
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
            .put(
                server + "/mob/parts/" + this.state.id,
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
        var formdata = new FormData();

        formdata.append(
            "price",
            document.getElementById("price").value.replace(" ", "")
        );
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append("customer", document.getElementById("customer").value);
        formdata.append("store", document.getElementById("store").value);

        if (document.getElementById("mark").value !== "") {
            formdata.append("mark", document.getElementById("mark").value);
        }

        if (document.getElementById("model").value !== "") {
            formdata.append("model", document.getElementById("model").value);
        }

        formdata.append("location", this.state.location_id);

        axios
            .put(
                server + "/api/admin/parts/" + this.state.id + "/",
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
        if (this.state.isLoading === true) {
            return <h3>Maglumat ýüklenýär</h3>;
        }

        return (
            <div className="grid">
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
                        <BiPlus
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></BiPlus>
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
                            this.deleteProduct();
                        }}
                    >
                        <IoMdTrash
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

                <div className="flex h-max">
                    <img
                        alt=""
                        className="w-[150px] h-[150px] rounded-md shadow-md object-cover"
                        src={server + this.state.img}
                    ></img>
                    <div className="grid text-slate-700 px-[10px] h-max">
                        <label className="text-[30px]">
                            {this.state.name_tm}
                        </label>

                        <div className="flex items-center">
                            <MdTimer></MdTimer>
                            <label>{this.state.created_at}</label>
                            <IoMdEye></IoMdEye>
                            <label>{this.state.viewed}</label>
                        </div>

                        <label>
                            Statusy:
                            {this.state.status === "accepted" && (
                                <label>Kabul edilen </label>
                            )}
                            {this.state.status === "pending" && (
                                <label>Garaşylýar </label>
                            )}
                            {this.state.status === "canceled" && (
                                <label>Gaýtarlan </label>
                            )}
                        </label>
                    </div>
                </div>

                <div className="images">
                    {this.state.images.map((item) => {
                        return (
                            <div className="imageCard">
                                <img
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_m}
                                ></img>
                                <div className="absolute flex items-center">
                                    <MdClose
                                        className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                    duration-300  bg-red-600 rounded-[50%] p-[5px] 
                                    text-white shadow-md right-[5px] top-[5px]"
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                        size={30}
                                    ></MdClose>
                                    <FcCheckmark
                                        size={30}
                                        className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                            duration-300 bg-white rounded-[50%] p-[5px] 
                                            text-white shadow-md right-[5px] top-[5px]"
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                    ></FcCheckmark>
                                </div>
                            </div>
                        );
                    })}

                    <div className="imageCard"></div>
                </div>

                <div className="grid">
                    <div className="grid max-w-[400px]">
                        <label>Dükany</label>
                        <select id="store">
                            <option value={""} hidden>
                                {this.state.store_name}
                            </option>
                            <option value={""}></option>
                            {this.state.stores.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Ulanyjy</label>
                        <select id="customer">
                            <option value={this.state.customer_id} hidden>
                                {this.state.customer_name}{" "}
                                {this.state.customer_phone}{" "}
                            </option>
                            <option value={""}></option>
                            {this.state.customers.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {item.phone} {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Kategoriýasy</label>
                        <select id="category">
                            <option hidden value={""}>
                                {this.state.category.name}
                            </option>
                            {this.state.categories.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Marka</label>
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
                            <option hidden value={""}>
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

                        <label>Model</label>
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

                        <label>Bahasy</label>
                        <input
                            id="price"
                            defaultValue={this.state.price
                                .replace("TMT", "")
                                .replace(" ", "")}
                        ></input>

                        <div className="location border rounded-[5px] p-[10px] my-[5px] flex items-center">
                            <BiMap
                                size={25}
                                className="hover:bg-slate-200 rounded-md p-[2px]"
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            <label>{this.state.location_name}</label>
                            {this.state.location_name.length > 0 && (
                                <MdClose
                                    size={25}
                                    className="border rounded-full"
                                    onClick={() => {
                                        this.setState({ location_name: "" });
                                        this.setState({ location_id: "" });
                                    }}
                                ></MdClose>
                            )}
                        </div>

                        {this.state.locationSelectorOpen && (
                            <LocationSelector parent={this}></LocationSelector>
                        )}

                        <label>Goşmaça maglumat</label>
                        <textarea
                            id="detail"
                            defaultValue={this.state.detail}
                        ></textarea>

                        <label>Telefon belgisi</label>
                        <input
                            id="phone"
                            type={"tel"}
                            defaultValue={this.state.phone}
                        ></input>
                    </div>
                    <div></div>

                    <div></div>
                </div>
            </div>
        );
    }
}

export default AdminCarPartDetail;
