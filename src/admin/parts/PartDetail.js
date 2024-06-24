import axios from "axios";
import React from "react";
import { server } from "../../static";
import "../admin.css";
import { FcCheckmark } from "react-icons/fc";
import LocationSelector from "../LocationSelector";
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
import { toast, ToastContainer } from "react-toastify";

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
                    mark: resp.data.mark,
                    model: resp.data.model,
                    active: resp.data.active,
                    color: resp.data.color,
                    credit: resp.data.credit,
                    swap: resp.data.swap,
                    on_slider: resp.data.on_slider,
                    none_cash_pay: resp.data.none_cash_pay,
                    fuel: resp.data.fuel,
                    body_type: resp.data.body_type,
                    id: resp.data.id,
                    millage: resp.data.millage,
                    on_search: resp.data.on_search,
                    transmission: resp.data.transmission,
                    vin: resp.data.vin,
                    year: resp.data.year,
                    viewed: resp.data.viewed,
                    detail: resp.data.detail,
                    img: resp.data.img,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    category: resp.data.category,
                    category_id: resp.data.category.id,
                    category_name: resp.data.category.name,
                    phone: resp.data.phone,
                    country: resp.data.country,
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
                toast.success("status uytgedildi");
            });
    }

    unsetMark() {
        var formdata = new FormData();
        formdata.append("mark", "");
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

    unsetModel() {
        var formdata = new FormData();
        formdata.append("model", "");
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
        formdata.append("name", document.getElementById("name").value);
        formdata.append("name_tm", document.getElementById("name").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append("customer", document.getElementById("customer").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("category", document.getElementById("category").value);

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
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        if (this.state.isLoading === true) {
            return <h3>Maglumat ýüklenýär</h3>;
        }

        return (
            <div className="grid justify-center p-2">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex flex-wrap text-slate-600 text-[12px] my-2">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                    >
                        <label>Kabul etmek</label>
                        <MdCheck className="" size={20}></MdCheck>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("canceled");
                        }}
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                    >
                        <label>Gaýtarmak</label>
                        <MdCancel size={20}></MdCancel>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                    >
                        <label>Barlaga goýmak</label>
                        <MdWarning size={20}></MdWarning>
                    </button>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                    >
                        <label>Ýatda saklamak</label>
                        <MdSave size={20}></MdSave>
                    </button>
                    <button
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                        onClick={() => {
                            this.deleteProduct();
                        }}
                    >
                        <label>Bozmak</label>
                        <IoMdTrash size={20}></IoMdTrash>
                    </button>
                    <button
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                    >
                        <label>Surat goşmak</label>
                        <MdImage size={20}></MdImage>
                    </button>
                    <button
                        className="flex items-center hover:text-slate-500 border rounded-md p-1 hover:bg-slate-100 m-1"
                        onClick={() => {
                            this.moveUp();
                        }}
                    >
                        <label>Öňe süýşürmek</label>

                        <FiArrowUp size={20}></FiArrowUp>
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

                <div className="grid">
                    <img
                        alt=""
                        className="w-full h-[300px] rounded-md border object-contain mx-auto"
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

                <div className="border">
                    {this.state.images.map((item) => {
                        return (
                            <div className="grid border w-max rounded-md m-1 p-1 ">
                                <img
                                    className="rounded-lg max-w-[100px] max-h-[100px]"
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_m}
                                ></img>
                                <div className="flex items-center">
                                    <MdClose
                                        className="text-red-600 hover:text-slate-600 rounded-md bg-slate-200 m-1"
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                        size={20}
                                    ></MdClose>
                                    <MdCheck
                                        size={20}
                                        className="hover:text-slate-600 text-green-600 rounded-md bg-slate-200 m-1"
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                    ></MdCheck>
                                </div>
                            </div>
                        );
                    })}

                    <div className="imageCard"></div>
                </div>

                <div className="grid text-[12px]">
                    <label>Ady</label>
                    <input defaultValue={this.state.name_tm} id="name"></input>
                    <label>Dükany</label>
                    <select id="store">
                        <option value={this.state.store_id} hidden>
                            {this.state.store_name}
                        </option>
                        <option value={""}></option>
                        {this.state.stores.map((item) => {
                            return (
                                <option value={item.id}>
                                    {" "}
                                    {String(item.name_tm).substring(0, 20)}
                                </option>
                            );
                        })}
                    </select>

                    <label>Customer</label>
                    <select id="customer">
                        <option value={this.state.customer_id} hidden>
                            {this.state.customer_name}{" "}
                            {this.state.customer_phone}{" "}
                        </option>
                        <option value={""}></option>
                        {this.state.customers.map((item) => {
                            return (
                                <option value={item.id}>
                                    {item.phone}{" "}
                                    {String(item.name).substring(0, 20)}
                                </option>
                            );
                        })}
                    </select>

                    <label>Kategoriýasy</label>
                    <select id="category">
                        <option hidden value={this.state.category_id}>
                            {this.state.category_name}
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
                    <div className="grid items-center grid-cols-[auto_max-content]">
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
                        <MdClose
                            onClick={() => {
                                this.unsetMark();
                            }}
                            size={20}
                            className="m-2"
                        ></MdClose>
                    </div>

                    <label>Model</label>

                    <div className="grid items-center grid-cols-[auto_max-content]">
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
                        <MdClose
                            onClick={() => {
                                this.unsetModel();
                            }}
                            size={20}
                            className="m-2"
                        ></MdClose>
                    </div>

                    <label>Bahasy</label>
                    <input
                        id="price"
                        defaultValue={this.state.price
                            .replace("TMT", "")
                            .replace(" ", "")}
                    ></input>

                    <div className="location border rounded-[5px] p-2 my-2 flex items-center">
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
            </div>
        );
    }
}

export default AdminCarPartDetail;
