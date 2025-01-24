import axios from "axios";
import React from "react";

import { BiPlus, BiTime } from "react-icons/bi";
import { server } from "../../static";
import { BiMap } from "react-icons/bi";
import { FiArrowLeftCircle, FiEye } from "react-icons/fi";
import LocationSelector from "../LocationSelector";
import { AiFillDelete } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import {} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ProgressIndicator from "../ProgressIndicator";
import { MotionAnimate } from "react-motion-animate";

class SliderDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: [],
            allLocations: [],
            categories: [],
            customers: [],
            stores: [],
            location_name: "",
            location_id: "",
            phone: "",
            phones: [],
            types: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Reklama giňişleýin";
    }
    componentDidMount() {
        this.setData();
    }

    setData() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/stores?pagination=None").then((resp) => {
            this.setState({ stores: resp.data });
        });

        axios
            .get(server + "/api/adm/ad_types", { auth: this.state.auth })
            .then((resp) => {
                this.setState({ types: resp.data.data });
            });

        axios
            .get(server + "/api/adm/ad_categories", { auth: this.state.auth })
            .then((resp) => {
                this.setState({ categories: resp.data.data });
            });

        axios
            .get(server + "/api/adm/stores?pagination=None", {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ customers: resp.data });
            });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];
        this.setState({ id: id });

        axios
            .get(server + "/api/adm/ads/" + id, { auth: this.state.auth })
            .then((resp) => {
                this.setState({
                    title_tm: resp.data.title_tm,
                    location: resp.data.location,
                    viewed: resp.data.viewed,
                    detail_text: resp.data.body_tm,
                    img: resp.data.img,
                    exprire_at: resp.data.exprire_at,
                    sort_order: resp.data.sort_order,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    category: resp.data.category,
                    phone: resp.data.phone,
                    type: resp.data.type,
                    store: resp.data.store,
                    active: resp.data.active,
                    phones: resp.data.phones,
                });

                this.setState({ isLoading: false });
            });
    }

    deleteAdv() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result == false) {
            return null;
        }

        axios
            .post(
                server + "/api/adm/ads/delete/" + this.state.id,
                {},
                { auth: this.state.auth }
            )
            .then((resp) => {
                window.history.back();
            });
    }

    changeStatus(statusValue) {
        var fdata = new FormData();

        fdata.append("status", statusValue);

        axios
            .put(server + "/api/adm/ads/" + this.state.id + "/", fdata)
            .then((resp) => {
                this.setData();
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(server + "/api/adm/ads/" + this.state.id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    deleteImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(
                    server + "/api/adm/ads/img/delete/" + id,
                    {},
                    this.state.auth
                )
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
            formdata.append("img_l", images[i]);
            formdata.append("ad", this.state.id);

            axios
                .post(server + "/api/adm/ad_imgs/", formdata, {
                    auth: this.state.auth,
                })
                .then((resp) => {
                    alert("Ýatda saklandy");
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
        }
    }

    save() {
        var formdata = new FormData();
        formdata.append("title_tm", document.getElementById("name").value);
        formdata.append("category", document.getElementById("category").value);
        formdata.append("body_tm", document.getElementById("body_tm").value);
        formdata.append("location", this.state.location_id);
        formdata.append("type", document.getElementById("type").value);
        formdata.append(
            "sort_order",
            document.getElementById("sort_order").value
        );
        formdata.append("store", document.getElementById("store").value);

        axios
            .put(server + "/api/adm/ads/" + this.state.id + "/", formdata, {
                auth: this.state.auth,
                headers: this.state.headers,
            })
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }
    deleteContact(id) {
        var formdata = new FormData();
        axios
            .post(server + "/api/adm/ads/contact/delete/" + id, formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Bozuldy");
            })
            .catch((err) => {
                toast.err("Ýalňyşlyk ýüze çykdy");
            });
    }

    add_contact() {
        var formdata = new FormData();
        formdata.append("value", document.getElementById("new_phone").value);

        formdata.append("adv", this.state.id);

        axios
            .post(server + "/api/adm/ad_contacts/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kontakt goşuldy");
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        return (
            <div className="grid mx-auto max-w-[600px]">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="text-[12px] flex items-center text-white">
                    <button
                        onClick={() => {
                            window.history.back();
                        }}
                        className="w-max flex items-center bg-slate-400 rounded-lg hover:bg-slate-400 m-1 p-2"
                    >
                        <FiArrowLeftCircle
                            className="mx-1"
                            size={18}
                        ></FiArrowLeftCircle>
                        <label className="text-md">Yza</label>
                    </button>
                    <button
                        className="w-max bg-green-600 rounded-lg hover:bg-slate-400 m-1 p-2"
                        onClick={() => {
                            this.save();
                        }}
                    >
                        Ýatda sakla
                    </button>
                    <button
                        onClick={() => {
                            this.deleteAdv();
                        }}
                        className="w-max bg-red-600 rounded-lg hover:bg-slate-400 m-1 p-2"
                    >
                        Bozmak
                    </button>
                </div>

                <div className="grid gallery">
                    <img
                        alt=""
                        className="w-[200px] h-[200px] rounded-lg object-contain border"
                        src={server + this.state.img}
                    ></img>
                    <div className="flex flex-wrap my-2">
                        {this.state.images.map((item) => {
                            return (
                                <div className="grid m-2">
                                    <img
                                        alt=""
                                        defaultValue={"/default.png"}
                                        src={server + item.img}
                                        className="h-[150px] w-[150px] object-contain border rounded-lg"
                                    ></img>
                                    <div className="flex items-center">
                                        <AiFillDelete
                                            size={25}
                                            className="hover:text-slate-400"
                                            onClick={() => {
                                                this.deleteImage(item.id);
                                            }}
                                        ></AiFillDelete>
                                        <MdCheck
                                            size={25}
                                            className="hover:text-slate-400"
                                            onClick={() => {
                                                this.setMainImage(item.id);
                                            }}
                                        ></MdCheck>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="">
                    <div className="grid max-w-[600px]">
                        <input
                            onChange={() => {
                                this.addSelectedImages();
                            }}
                            id="imgselector"
                            multiple
                            accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                            type="file"
                        ></input>
                        <label>Ady</label>
                        <input
                            id="name"
                            defaultValue={this.state.title_tm}
                        ></input>
                        <label>Tekst</label>
                        <textarea
                            className="min-h-[200px]"
                            id="body_tm"
                            defaultValue={this.state.detail_text}
                        ></textarea>

                        <label>Tertip belgisi</label>
                        <input
                            id="sort_order"
                            type="number"
                            defaultValue={this.state.sort_order}
                        ></input>

                        <label className="mx-2">Ýerleşýän ýeri</label>
                        <div className="rounded-md p-1 border flex items-center ">
                            <BiMap
                                className="hover:text-slate-500"
                                size={25}
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            <label>{this.state.location_name}</label>
                            <button className="p-1 bg-slate-300 rounded-full">
                                <MdClose className=" "></MdClose>
                            </button>
                        </div>
                        {this.state.locationSelectorOpen === true && (
                            <LocationSelector
                                parent={this}
                                open={this.state.locationSelectorOpen}
                            ></LocationSelector>
                        )}

                        <label>Görnüşi</label>
                        <select id="type">
                            {this.state.type != undefined && (
                                <option value={this.state.type.id} hidden>
                                    {this.state.type.name}
                                </option>
                            )}
                            {this.state.types.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Kategoriýasy</label>
                        <select id="category">
                            {this.state.category != undefined && (
                                <option value={this.state.category.id} hidden>
                                    {this.state.category.name}
                                </option>
                            )}
                            {this.state.categories.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {" "}
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label>Store</label>
                        <select id="store" className="overflow-hidden">
                            {this.state.store != undefined && (
                                <option value={this.state.store.id} hidden>
                                    {this.state.store.name}
                                </option>
                            )}
                            {this.state.store == undefined && (
                                <option value={""}></option>
                            )}
                            {this.state.stores.map((item) => {
                                return (
                                    <option value={item.id}>{item.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="view flex items-center">
                        <label>
                            <FiEye size={20}></FiEye>
                        </label>
                        <label>{this.state.viewed}</label>
                        <label>
                            <BiTime size={20}></BiTime>
                        </label>
                        <label>{this.state.created_at}</label>
                    </div>

                    <label>Kontaktlar </label>
                    <div className="contact-create flex items-center">
                        <input
                            placeholder="Contact"
                            type="text"
                            id="new_phone"
                        ></input>

                        <button
                            className="flex items-center text-[12px] bg-slate-600 text-white p-2 mx-2 rounded-md"
                            onClick={() => {
                                this.add_contact();
                            }}
                        >
                            <label>Goşmak</label>
                            <BiPlus className="add-contact"></BiPlus>
                        </button>
                    </div>
                    <div>
                        {this.state.phones.map((item) => {
                            return (
                                <MotionAnimate>
                                    <div
                                        onClick={() => {
                                            this.deleteContact(item.id);
                                        }}
                                        className="flex items-center m-2"
                                    >
                                        <label>{item.value}</label>
                                        <button className=" flex items-center text-[12px]">
                                            <MdDelete
                                                size={25}
                                                className="mx-2 text-red-600"
                                            ></MdDelete>
                                        </button>
                                    </div>
                                </MotionAnimate>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SliderDetail;
