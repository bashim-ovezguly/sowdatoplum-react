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
import { toast } from "react-toastify";
import ProgressIndicator from "../ProgressIndicator";

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
            .get(server + "/api/adm/products/" + id, this.state.headers)
            .then((resp) => {
                if (resp.data.category !== "") {
                    this.setState({
                        category_name: resp.data.category.name,
                        category_id: resp.data.category.id,
                    });
                }
                if (resp.data.store !== "") {
                    this.setState({
                        store_name: resp.data.store.name,
                        store_id: resp.data.store.id,
                    });
                }
                if (resp.data.location !== "") {
                    this.setState({
                        location_name: resp.data.location.name,
                        location_id: resp.data.location.id,
                    });
                }

                this.setState({
                    name: resp.data.name,
                    viewed: resp.data.viewed,
                    img: resp.data.img,
                    price: resp.data.price,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    phone: resp.data.phone,
                    amount: resp.data.amount,
                    status: resp.data.status,
                    active: resp.data.active,
                    credit: resp.data.credit,
                    error: resp.data.error_reason,
                    on_slider: resp.data.on_slider,
                    description: resp.data.description,

                    isLoading: false,
                });
            });
    }

    deleteProduct() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result == false) {
            return null;
        }

        axios
            .post(
                server + "/api/adm/products/delete/" + this.state.id,
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
                server + "/api/adm/products/" + this.state.id + "/",
                fdata,
                this.state.headers
            )
            .then((resp) => {
                this.setData();
                if (statusValue === "accepted") toast.success("Kabul edildi");
                if (statusValue === "pending") toast.success("Barlaga goýuldy");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(
                server + "/api/adm/products/" + this.state.id + "/",
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
        formdata.append("name", document.getElementById("name").value);

        if (document.getElementById("category").value != "") {
            formdata.append(
                "category",
                document.getElementById("category").value
            );
        }

        formdata.append(
            "description",
            document.getElementById("description").value
        );
        formdata.append("price", document.getElementById("price").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("location", this.state.location_id);

        this.setState({ isLoading: true });
        axios
            .put(
                server + "/api/adm/products/" + this.state.id + "/",
                formdata,
                this.state.headers
            )
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: true });
                toast.success("Yatda saklandy");
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
            <div className="max-w-[1440px] p-2 grid mx-auto">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <div className="flex whitespace-nowrap overflow-x-auto">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="p-1 m-1 flex items-center text-[12px] bg-slate-200 hover:bg-slate-200 rounded-md px-2"
                    >
                        <MdCheck></MdCheck>
                        <label>Kabul etmek</label>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="p-1 m-1 flex items-center text-[12px] bg-slate-200 hover:bg-slate-200 rounded-md px-2"
                    >
                        <MdWarning></MdWarning>
                        <label>Barlaga geçirmek</label>
                    </button>

                    <button
                        className="p-1 m-1 flex items-center text-[12px] bg-slate-200 hover:bg-slate-200 rounded-md px-2"
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
                        className="p-1 m-1 flex items-center text-[12px] bg-slate-200 hover:bg-slate-200 rounded-md px-2"
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
                        className="p-1 m-1 flex items-center text-[12px] bg-slate-200 hover:bg-slate-200 rounded-md px-2"
                    >
                        <IoMdTrash></IoMdTrash>
                        <label>Bozmak</label>
                    </button>
                </div>

                <img
                    alt=""
                    className="max-w-[200px] max-h-[200px] border my-2 object-contain rounded-lg "
                    src={server + this.state.img}
                ></img>

                <div className="flex overflow-x-auto">
                    {this.state.images.map((item) => {
                        return (
                            <div className="grid w-max m-1 rounded-lg relative">
                                <img
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_s}
                                    className="object-contain border rounded-lg overflow-hidden w-[150px] h-[150px] max-w-none"
                                ></img>
                                <div className="flex absolute top-1 left-1">
                                    <button className=" p-1 shadow-lg border hover:text-slate-300 duration-200 bg-white rounded-md mr-1 text-red-600">
                                        <AiFillDelete
                                            size={30}
                                            onClick={() => {
                                                this.removeImage(item.id);
                                            }}
                                        ></AiFillDelete>
                                    </button>
                                    <button className=" p-1 shadow-lg border hover:text-slate-300 duration-200 bg-white rounded-md mr-1 text-green-600">
                                        <MdCheck
                                            size={30}
                                            onClick={() => {
                                                this.setMainImage(item.id);
                                            }}
                                        ></MdCheck>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid max-w-[600px] text-[12px]">
                    <div className="grid h-max my-2">
                        <h2 className="text-lg">{this.state.name}</h2>
                        <div className="flex text-lg items-center">
                            <IoMdEye></IoMdEye> {this.state.viewed}
                            <BiCalendar></BiCalendar> {this.state.created_at}
                        </div>
                        {this.state.status === "accepted" && (
                            <label className="bg-green-600 rounded-md px-2 text-white w-max">
                                {" "}
                                {this.state.status}{" "}
                            </label>
                        )}
                        {this.state.status === "pending" && (
                            <label className="bg-orange-600 rounded-md px-2 text-white w-max">
                                {" "}
                                {this.state.status}{" "}
                            </label>
                        )}
                    </div>

                    <label>Ady</label>
                    <input id="name" defaultValue={this.state.name}></input>

                    <label>Bahasy</label>
                    <input id="price" defaultValue={this.state.price}></input>

                    <div className="border rounded-md my-1 p-1 flex items-center ">
                        <BiMap
                            size={25}
                            className="hover:bg-slate-200 rounded"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        ></BiMap>
                        <label>{this.state.location_name}</label>
                        <MdClose
                            size={25}
                            className="border p-1 rounded-md"
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

                    <label>Store</label>
                    <select id="store" className="">
                        <option value={""}></option>
                        <option selected value={this.state.store_id}>
                            {this.state.store_name}
                        </option>
                        {this.state.stores.map((item) => {
                            return (
                                <option value={item.id}>
                                    {" "}
                                    {String(item.name).substring(0, 20)}
                                </option>
                            );
                        })}
                    </select>

                    <label>Kategoriýasy</label>
                    <select id="category">
                        <option value={""}></option>
                        <option selected value={this.state.category_id}>
                            {this.state.category_name}
                        </option>
                        {this.state.categories.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>

                    <label>Goşmaça maglumat</label>
                    <textarea
                        className="min-h-[200px]"
                        id="description"
                        defaultValue={this.state.description}
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
