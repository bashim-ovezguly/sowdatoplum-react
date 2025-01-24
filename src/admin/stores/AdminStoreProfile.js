import axios from "axios";
import React from "react";
import { BiMap, BiPlus } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import {
    MdCheck,
    MdClose,
    MdRestartAlt,
    MdSave,
    MdWarning,
} from "react-icons/md";
import LocationSelector from "../LocationSelector";
import { server } from "../../static";
import { toast, ToastContainer } from "react-toastify";

class AdminStoreProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],

            current_page: 1,
            last_page: 1,
            total: 0,
            stores: [],
            url_params: [],
            filterOpen: false,
            newStoreOpen: false,
            categories: [],
            sizes: [],
            centers: [],
            contacts: [],
            links: [],
            page_size: 50,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        this.setData();
    }

    addContact() {
        var formdata = new FormData();
        const value = document.getElementById("contact-value").value;

        if (value !== "") {
            formdata.append("value", value);
            formdata.append("store", this.state.id);
        }

        axios
            .post(server + "/api/adm/store_contacts/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kontakt goshuldy");
            });
    }

    setNewPassword(newPassword) {
        var id = window.location.pathname.split("/")[3];

        var formdata = new FormData();
        if (newPassword == "") {
            toast.error("Açar sözi giriziň");
            return null;
        }

        formdata.append("password", newPassword);

        axios
            .put(server + "/api/adm/stores/" + id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Açar sözi üýtgedildi");
            });
    }

    addWebsite() {
        var formdata = new FormData();
        const value = document.getElementById("link").value;

        if (value !== "") {
            formdata.append("link", value);
            formdata.append("store", this.state.id);
        }

        axios
            .post(server + "/api/adm/store_websites/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kontakt goshuldy");
            });
    }

    save() {
        var formdata = new FormData();
        formdata.append("name_tm", document.getElementById("name").value);
        formdata.append("name", document.getElementById("name").value);
        formdata.append(
            "description",
            document.getElementById("description").value
        );

        if (document.getElementById("premium").checked === true) {
            formdata.append("premium", "True");
        } else {
            formdata.append("premium", "False");
        }

        if (document.getElementById("on_slider").checked === true) {
            formdata.append("on_slider", "True");
        } else {
            formdata.append("on_slider", "False");
        }

        formdata.append("category", document.getElementById("category").value);
        formdata.append("center", document.getElementById("tradeCenter").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("email", document.getElementById("email").value);
        formdata.append("name", document.getElementById("name").value);
        formdata.append("location", this.state.location_id);

        axios
            .put(server + "/api/adm/stores/" + this.state.id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error(JSON.stringify(err));
            });
    }

    changeStatus(statusValue) {
        var fdata = new FormData();
        this.setData({
            optionsOpen: !this.state.optionsOpen,
            isLoading: true,
        });

        fdata.append("status", statusValue);

        axios
            .put(server + "/api/adm/stores/" + this.state.id + "/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kabul edildi");
            });
    }

    moveUp() {
        var formdata = new FormData();

        formdata.append("moveUp", "True");
        axios
            .put(server + "/stores/" + this.state.id, formdata, this.state.auth)
            .then((resp) => {
                this.setData();
                toast.success("Moved up");
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });

        this.setState({ isLoading: true });
    }

    deleteStore() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(
                server + "/api/adm/stores/delete/" + this.state.id,
                {},
                { auth: this.state.auth }
            )
            .then((resp) => {
                toast.success("Dükan bozuldy");
                window.location.href = "/superuser/stores";
            });
    }

    setData() {
        const pathname = window.location.pathname;

        var id = pathname.split("/")[3];

        axios.get(server + "/index/store").then((resp) => {
            this.setState({
                categories: resp.data.categories,
                centers: resp.data.trade_centers,
            });
        });

        axios
            .get(server + "/api/adm/stores/" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({
                    name: resp.data.name,
                    logo: resp.data.logo,
                    images: resp.data.images,
                    status: resp.data.status,
                    phone: resp.data.phone,
                    img: resp.data.logo,
                    created_at: resp.data.created_at,
                    category_name: resp.data.category.name,
                    category_id: resp.data.category.id,
                    email: resp.data.email,
                    center: resp.data.center,
                    id: resp.data.id,
                    on_slider: resp.data.on_slider,
                    premium: resp.data.premium,
                    description: resp.data.description,
                    state: resp.data.state,
                    type: resp.data.type,
                    links: resp.data.websites,
                    isLoading: false,
                });

                if (resp.data.location != null) {
                    this.setState({
                        location_name: resp.data.location.name,
                        location_id: resp.data.location.id,
                    });
                }
            });

        axios
            .get(server + "/api/adm/store_contacts?store=" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ contacts: resp.data.data });
            });
    }

    deletePhone(contact) {
        let result = window.confirm(
            contact.value + " - bozmaga ynamyňyz barmy"
        );
        if (result === true) {
            axios
                .delete(server + "/api/adm/store_contacts/" + contact.id, {
                    auth: this.state.auth,
                })
                .then((resp) => {
                    this.setData();
                    toast.success("Kontakt bozuldy");
                });
        }
    }
    deleteWebsite(website) {
        let result = window.confirm("Bozmaga ynamyňyz barmy");
        if (result === true) {
            axios
                .delete(server + "/api/adm/store_websites/" + website.id, {
                    auth: this.state.auth,
                })
                .then((resp) => {
                    this.setData();
                    toast.success("website bozuldy");
                });
        }
    }

    render() {
        return (
            <div className="grid text-[14px] ">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                {/* BUTTONS */}
                <div className="flex overflow-x-auto whitespace-nowrap text-slate-600  text-[12px]">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="bg-slate-200 rounded-md px-2 flex items-center py-1 mr-1 my-1 hover:bg-slate-200"
                    >
                        <MdCheck size={20}></MdCheck>
                        <label>Kabul etmek</label>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="bg-slate-200 rounded-md px-2 flex items-center py-1 mr-1 my-1 hover:bg-slate-200"
                    >
                        <MdWarning size={20}></MdWarning>
                        <label>Barlagda goýmak</label>
                    </button>

                    <button
                        className="bg-slate-200 rounded-md px-2 flex items-center py-1 mr-1 my-1 hover:bg-slate-200"
                        onClick={() => {
                            this.save();
                        }}
                    >
                        <MdSave size={20}></MdSave>
                        <label>Ýatda saklamak</label>
                    </button>
                    <button
                        className="bg-slate-200 rounded-md px-2 flex items-center py-1 mr-1 my-1 hover:bg-slate-200"
                        onClick={() => {
                            this.deleteStore();
                        }}
                    >
                        <IoMdTrash size={20}></IoMdTrash>
                        <label>Bozmak</label>
                    </button>

                    <button
                        onClick={() => {
                            this.moveUp();
                        }}
                        className="bg-slate-200 rounded-md px-2 flex items-center py-1 mr-1 my-1 hover:bg-slate-200"
                    >
                        <MdRestartAlt size={20}></MdRestartAlt>
                        <label>Galdyrmak</label>
                    </button>
                </div>
                <div className="max-w-[400px] grid">
                    <label className="text-[13px]">Ady</label>
                    <input id="name" defaultValue={this.state.name}></input>
                    <label className="text-[13px]">Telefon nomeri</label>
                    <input id="phone" defaultValue={this.state.phone}></input>
                    <label className="text-[13px]">Email</label>
                    <input id="email" defaultValue={this.state.email}></input>
                    <label className="text-[13px]">Ýerleşýän ýeri</label>
                    <div className="location border text-[13px] rounded-md p-1 my-2 flex items-center">
                        <BiMap
                            size={25}
                            className="hover:bg-slate-200 rounded-md"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        ></BiMap>
                        <label>{this.state.location_name}</label>
                        {this.state.location_name !== "" && (
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
                    <label className="text-[13px]">Söwda merkezi</label>
                    <select id="tradeCenter">
                        <option value={this.state.trade_center_id}>
                            {this.state.trade_center_name}
                        </option>
                        <option value={""}>--Saýlaň--</option>
                        {this.state.centers.map((item) => {
                            if (this.state.center === item.name) {
                                return (
                                    <option selected value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            } else {
                                return (
                                    <option value={item.id}>{item.name}</option>
                                );
                            }
                        })}
                    </select>
                    <label>Kategoriýasy</label>
                    <select id="category">
                        <option value={""}>--Saýlaň--</option>

                        {this.state.category_id != "" && (
                            <option selected value={this.state.category_id}>
                                {this.state.category_name}
                            </option>
                        )}
                        {this.state.categories.map((item) => {
                            if (this.state.category_name === item.name_tm) {
                                return (
                                    <option selected value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            } else {
                                return (
                                    <option value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            }
                        })}
                    </select>
                    {this.state.locationSelectorOpen === true && (
                        <LocationSelector
                            parent={this}
                            open={this.state.locationSelectorOpen}
                        ></LocationSelector>
                    )}
                    <label>Goşmaça maglumat</label>
                    <textarea
                        id="description"
                        defaultValue={this.state.description}
                    ></textarea>

                    <div className="flex items-center">
                        {this.state.premium === "True" ? (
                            <input
                                className="w-[20px] h-[20px] mx-2"
                                id="premium"
                                type="checkbox"
                                defaultChecked
                            ></input>
                        ) : (
                            <input
                                id="premium"
                                className="w-[20px] h-[20px] mx-2"
                                type="checkbox"
                            ></input>
                        )}
                        <label>Premium</label>
                    </div>

                    <div>
                        {this.state.on_slider === "True" ? (
                            <input
                                id="on_slider"
                                type="checkbox"
                                defaultChecked
                                className="w-[20px] h-[20px] mx-2"
                            ></input>
                        ) : (
                            <input
                                id="on_slider"
                                className="w-[20px] h-[20px] mx-2"
                                type="checkbox"
                            ></input>
                        )}
                        <label>Sliders</label>
                    </div>
                    <div className="grid">
                        <label>Kontakt</label>
                        <div className="grid grid-cols-[auto_max-content] w-full">
                            <input
                                placeholder="Telefon belgi"
                                type="text"
                                id="contact-value"
                            ></input>
                            <button
                                onClick={() => {
                                    this.addContact();
                                }}
                                className=" rounded-lg m-1 px-2 hover:bg-slate-200"
                            >
                                <BiPlus size={25}> </BiPlus>
                            </button>
                        </div>
                    </div>
                    <div className="grid">
                        {this.state.contacts.map((item) => {
                            return (
                                <div className="grid grid-cols-[auto_max-content] border rounded-md p-2 items-center">
                                    <label>{item.value}</label>
                                    <IoMdTrash
                                        onClick={() => {
                                            this.deletePhone(item);
                                        }}
                                        className="text-slate-600 hover:text-slate-700"
                                        size={25}
                                    ></IoMdTrash>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid">
                        <label>Linkler</label>
                        <div className="grid grid-cols-[auto_max-content] w-full">
                            <input
                                placeholder="Website"
                                type="text"
                                id="link"
                            ></input>
                            <button
                                onClick={() => {
                                    this.addWebsite();
                                }}
                                className=" rounded-lg m-1 px-2 hover:bg-slate-200"
                            >
                                <BiPlus size={25}> </BiPlus>
                            </button>
                        </div>
                    </div>
                    <div className="grid">
                        {this.state.links.map((item) => {
                            return (
                                <div className="grid grid-cols-[auto_max-content] border rounded-md p-2 items-center">
                                    <a
                                        className="text-sky-600 font-bold"
                                        target="blank_"
                                        href={"https://" + item.link}
                                    >
                                        {item.link}
                                    </a>
                                    <IoMdTrash
                                        onClick={() => {
                                            this.deleteWebsite(item);
                                        }}
                                        className="text-slate-600 hover:text-slate-700"
                                        size={25}
                                    ></IoMdTrash>
                                </div>
                            );
                        })}
                    </div>
                    <div className="shadow-lg rounded-lg p-2 my-2 border max-w-[400px] grid">
                        <label>Açar sözi</label>
                        <input
                            id="new_password"
                            type="text"
                            placeholder=""
                        ></input>
                        <button
                            onClick={() => {
                                this.setNewPassword(
                                    document.getElementById("new_password")
                                        .value
                                );
                            }}
                            className="bg-appColor p-2 my-2 rounded-md text-white"
                        >
                            Täze parol goýmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminStoreProfile;
