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
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/index/stores/all").then((resp) => {
            this.setState({ stores: resp.data });
        });

        axios.get(server + "/mob/customers").then((resp) => {
            this.setState({ customers: resp.data });
        });

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/car" + q).then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                transmissions: resp.data["transmissions"],
                countries: resp.data["countries"],
                colors: resp.data["colors"],
                wds: resp.data["wheel_drives"],
                models: resp.data["models"],
                marks: resp.data["marks"],
                fuels: resp.data["fuels"],
                body_types: resp.data["body_types"],
            });
            this.setState({ isLoading: false });
        });

        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const id = urlParams.get('id')

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios
            .get(server + "/api/admin/cars/" + id, this.state.auth)
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
                    recolored: resp.data["recolored"],
                    engine: resp.data["engine"],
                    viewed: resp.data["viewed"],
                    detail: resp.data["detail"],
                    img: resp.data.img.img_m,
                    created_at: resp.data["created_at"],
                    images: resp.data["images"],
                    category: resp.data["category"],
                    phone: resp.data["phone"],
                    country: resp.data["country"],
                    store_id: resp.data.store.id,
                    store_name: resp.data.store.name,
                    location_name: resp.data.location,
                    location_id: resp.data.location_id,
                    status: resp.data["status"],
                    price: resp.data["price"],
                    customer_id: resp.data.customer.id,
                    customer_name: resp.data.customer.name,
                    customer_phone: resp.data.customer.phone,
                    wd: resp.data.wheel_drive,
                    isLoading: false,
                });
            });
    }

    deleteCar() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(
                server + "/api/admin/cars/delete/" + this.state.id,
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
                server + "/api/admin/cars/" + this.state.id + "/",
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
            .put(
                server + "/mob/cars/" + this.state.id,
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
                .post(server + "/mob/cars/img/delete/" + id, this.state.auth)
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
                server + "/mob/cars/" + this.state.id,
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
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append("customer", document.getElementById("customer").value);

        formdata.append("engine", document.getElementById("engine").value);

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

        formdata.append("location", this.state.location_id);

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
                server + "/api/admin/cars/" + this.state.id + "/",
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
            <div className="carDetail">
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
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Kabul etmek</label>
                        <MdCheck size={20}></MdCheck>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("canceled");
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Gaýtarmak</label>
                        <MdCancel size={20}></MdCancel>
                    </button>

                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Barlaga goymak</label>
                        <MdWarning size={20}></MdWarning>
                    </button>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Yatda sakla</label>
                        <MdSave size={20}></MdSave>
                    </button>

                    <button
                        onClick={() => {
                            this.deleteCar();
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Bozmak</label>
                        <BiTrash size={20}></BiTrash>
                    </button>

                    <button
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Surat goşmak</label>
                        <MdImage size={20}></MdImage>
                    </button>

                    <button
                        onClick={() => {
                            this.moveUp();
                        }}
                        className="text-[12px] hover:bg-slate-200 m-1 p-1 flex items-center border rounded-md"
                    >
                        <label>Yokary galdyrmak</label>
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

                <label className="text-[30px]">
                    {this.state.mark} {this.state.model} {this.state.year}
                </label>
                <img
                    alt=""
                    className="w-[200px] h-[200px] rounded-md shadow-md object-cover"
                    src={server + this.state.img}
                ></img>

                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <div className="relative z-[-1] overflow-hidden m-2">
                                <img
                                    className="w-[120px] h-[120px] object-cover rounded-lg "
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img_m}
                                ></img>
                                <div className="absolute z-1 top-1 left-1 flex items-center">
                                    <AiFillDelete
                                        className="bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-slate-500"
                                        size={25}
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                    ></AiFillDelete>
                                    <FcCheckmark
                                        className="bg-white text-green-600 rounded-full p-1 shadow-lg hover:bg-slate-500"
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

                <div className="textData max-w-[400px]">
                    <div className="grid">
                        {this.state.status === "accepted" && (
                            <label>Kabul edilen </label>
                        )}
                        {this.state.status === "pending" && (
                            <label>Garaşylýar </label>
                        )}
                        {this.state.status === "canceled" && (
                            <label>Gaýtarlan </label>
                        )}

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

                        <label>Ýyly</label>
                        <input id="year" defaultValue={this.state.year}></input>

                        <label>Motory</label>
                        <input
                            id="engine"
                            defaultValue={this.state.engine}
                        ></input>

                        <label>Geçen ýoly</label>
                        <input
                            id="millage"
                            defaultValue={this.state.millage}
                        ></input>

                        <label>Ýangyjy</label>
                        <select id="fuel">
                            <option value={""} hidden>
                                {this.state.fuel}
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
                                        {item.phone} {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="flex items-center border rounded-md p-2">
                            <BiMap
                                size={30}
                                className=" hover:bg-slate-300 rounded-md p-2"
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

                        <label>Kuzow görnüşi</label>
                        <select id="body_type">
                            <option value={""} hidden>
                                {this.state.body_type}
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

                        <label>Korobka</label>
                        <select id="transmission">
                            <option value={""} hidden>
                                {this.state.transmission}
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

                        <label>Reňki</label>
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

                        <label>Ýörediji</label>
                        <select id="wd">
                            <option value={""} hidden>
                                {this.state.wheel_drive}
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

                        <div>
                            <label>Çalşyk</label>
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

                        <div>
                            <label>Kredit</label>
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

                        <div>
                            <label>Nagt däl töleg</label>
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

                        <div>
                            <label>Slaýderde görkez</label>
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
