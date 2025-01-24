import axios from "axios";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { server } from "../../static";

import { BiCalendar, BiMap, BiPhone, BiTime, BiTrash } from "react-icons/bi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";

class CarEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            created_at: "",
            price: "",

            marks: [],
            models: [],
            fuels: [],
            countries: [],
            transmissions: [],
            wheel_drives: [],
            colors: [],
            allLocations: [],
            body_types: [],
            images: [],
            location_id: "",
            location_name: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    delete() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result == true) {
            axios
                .post(server + "/mob/cars/delete/" + this.state.id)
                .then((resp) => {
                    window.history.back();
                });
        }
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        // index values
        axios.get(server + "/mob/index/car" + q).then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                transmissions: resp.data["transmissions"],
                countries: resp.data["countries"],
                colors: resp.data["colors"],
                wheel_drives: resp.data["wheel_drives"],
                models: resp.data["models"],
                marks: resp.data["marks"],
                fuels: resp.data["fuels"],
                body_types: resp.data["body_types"],
            });
            this.setState({ isLoading: false });
        });

        axios.get(server + "/mob/cars/" + id).then((resp) => {
            document.title =
                resp.data.mark.name +
                " " +
                resp.data.model.name +
                " " +
                resp.data.year;

            if (resp.data.location !== "") {
                this.setState({
                    location_id: resp.data.location.id,
                    location_name: resp.data.location.name,
                });
            }

            this.setState({
                mark: resp.data.mark.name,
                mark_id: resp.data.mark.id,
                model: resp.data.model.name,
                model_id: resp.data.model.id,
                price: resp.data.price,
                img: resp.data.img.img_m,
                color: resp.data.color.name,
                color_id: resp.data.color.id,
                credit: resp.data.credit,
                swap: resp.data.swap,
                none_cash_pay: resp.data.none_cash_pay,
                fuel: resp.data.fuel.name,
                fuel_id: resp.data.fuel.id,
                body_type: resp.data.body_type.name,
                body_type_id: resp.data.body_type.id,
                id: resp.data.id,
                millage: resp.data.millage,
                on_search: resp.data.on_search,
                transmission: resp.data.transmission.name,
                transmission_id: resp.data.transmission.id,
                vin: resp.data.vin,
                year: resp.data.year,
                recolored: resp.data.recolored,
                engine: resp.data.engine,
                viewed: resp.data.viewed,
                detail: resp.data.detail,
                wd: resp.data.wd.name,
                wd_id: resp.data.wd.id,
                created_at: resp.data.created_at,
                images: resp.data.images,
                phone: resp.data.phone,
                store_name: resp.data.store.name,
                store_id: resp.data.store.id,
                isLoading: false,
            });
        });
    }

    saveSelectedImages() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(server + "/mob/cars/" + this.state.id, formdata)
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(server + "/mob/cars/" + this.state.id, formdata)
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
                .post(server + "/mob/cars/img/delete/" + id)
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
    }

    save() {
        var formdata = new FormData();
        formdata.append("model", document.getElementById("model").value);
        formdata.append(
            "body_type",
            document.getElementById("body_type").value
        );
        formdata.append("color", document.getElementById("color").value);
        formdata.append("wd", document.getElementById("wd").value);
        formdata.append("fuel", document.getElementById("fuel").value);
        formdata.append(
            "transmission",
            document.getElementById("korobka").value
        );
        formdata.append("vin", document.getElementById("vin").value);
        formdata.append(
            "price",
            document.getElementById("price").value.replaceAll(" ", "")
        );
        formdata.append("engine", document.getElementById("engine").value);
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("detail", document.getElementById("description").value);

        formdata.append("location", this.state.location_id);

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

        axios
            .put(server + "/mob/cars/" + this.state.id, formdata)
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    onMarkSelect() {
        let mark_id = document.getElementById("mark").value;

        axios.get(server + "/mob/index/car?mark=" + mark_id).then((resp) => {
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
    }

    render() {
        return (
            <div className="p-2 grid">
                <Loader open={this.state.isLoading}></Loader>
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>

                <div>
                    <input
                        onChange={() => {
                            this.saveSelectedImages();
                        }}
                        id="imgselector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        hidden
                        type="file"
                    ></input>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1">
                    <div className="grid h-max ">
                        <img
                            alt=""
                            className="w-full max-h-[500px] object-cover border rounded-xl overflow-hidden mx-auto"
                            src={server + this.state.img}
                        ></img>
                        <div className="flex overflow-x-auto w-full">
                            {this.state.images.map((item) => {
                                return (
                                    <div
                                        className="rounded-xl m-1 relative w-[150px] h-[150px] min-w-[150px] overflow-hidden "
                                        key={item.id}
                                    >
                                        <img
                                            alt=""
                                            className=" w-full h-full object-cover border rounded-xl overflow-hidden "
                                            src={server + item.img_l}
                                        ></img>
                                        <div className="flex items-center absolute top-1 left-1">
                                            <button
                                                className="flex items-center rounded-full bg-white shadow-lg p-1 m-1"
                                                onClick={() => {
                                                    this.removeImage(item.id);
                                                }}
                                            >
                                                <BiTrash
                                                    title="Bozmak"
                                                    size={25}
                                                ></BiTrash>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    this.setMainImage(item.id);
                                                }}
                                                className="flex items-center rounded-full bg-white shadow-lg p-1  m-1"
                                            >
                                                <FcCheckmark
                                                    size={25}
                                                    title="Esasy surata bellemek"
                                                ></FcCheckmark>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="button-steelblue bg-sky-600 text-white w-max p-[5px] text-[12px] rounded-full px-2"
                            onClick={() => {
                                document.getElementById("imgselector").click();
                            }}
                        >
                            Surat goş
                        </button>
                    </div>

                    {/* INPUTS */}
                    <div className="grid text-[14px] h-max p-2 max-w-[400px]">
                        <label className="mx-2 font-bold text-[12px]">
                            Markasy
                        </label>
                        <select
                            id="mark"
                            onChange={() => {
                                this.onMarkSelect();
                            }}
                        >
                            <option value={this.state.mark_id}>
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

                        <label className="mx-2 font-bold text-[12px]">
                            Modeli
                        </label>
                        <select id="model">
                            <option value={this.state.model_id}>
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

                        <label className="mx-2 font-bold text-[12px]">
                            Bahasy (TMT)
                        </label>
                        <input
                            id="price"
                            defaultValue={this.state.price.replace(" TMT", "")}
                        ></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Motory
                        </label>
                        <input
                            id="engine"
                            defaultValue={this.state.engine}
                        ></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Ýyly
                        </label>
                        <input id="year" defaultValue={this.state.year}></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Geçen ýoly (km)
                        </label>
                        <input
                            id="millage"
                            defaultValue={this.state.millage}
                        ></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Telefon belgisi
                        </label>
                        <input
                            type="number"
                            min={0}
                            id="phone"
                            defaultValue={this.state.phone}
                        ></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Kuzowy
                        </label>
                        <select id="body_type">
                            <option hidden value={this.state.body_type_id}>
                                {this.state.body_type}
                            </option>
                            <option value={""}>(Görkezilmedik)</option>
                            {this.state.body_types.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="mx-2 font-bold text-[12px]">
                            Reňki
                        </label>
                        <select id="color">
                            <option value={this.state.color_id} hidden>
                                {this.state.color}
                            </option>
                            <option value={""}>(Görkezilmedik)</option>
                            {this.state.colors.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="mx-2 font-bold text-[12px]">
                            Ýörediji
                        </label>
                        <select id="wd">
                            <option hidden value={this.state.wd_id}>
                                {this.state.wd}
                            </option>
                            <option value={""}>(Görkezilmedik)</option>
                            {this.state.wheel_drives.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="mx-2 font-bold text-[12px]">
                            Ýangyjy
                        </label>
                        <select id="fuel">
                            <option hidden value={this.state.fuel_id}>
                                {this.state.fuel}
                            </option>
                            <option value={""}>(Görkezilmedik)</option>
                            {this.state.fuels.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="mx-2 font-bold text-[12px]">
                            Korobka
                        </label>
                        <select id="korobka">
                            <option hidden value={this.state.transmission_id}>
                                {this.state.transmission}
                            </option>
                            <option value={""}>(Görkezilmedik)</option>
                            {this.state.transmissions.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="mx-2 font-bold text-[12px]">
                            Ýerleşýän ýeri
                        </label>
                        <div
                            className="border rounded p-[10px] m-[5px] flex items-center"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        >
                            <BiMap size={20}></BiMap> {this.state.location_name}
                        </div>

                        {this.state.locationSelectorOpen && (
                            <LocationSelector parent={this}></LocationSelector>
                        )}

                        <label className="mx-2 font-bold text-[12px]">
                            VIN
                        </label>
                        <input id="vin" defaultValue={this.state.vin}></input>

                        <label className="mx-2 font-bold text-[12px]">
                            Giňişleýin maglumat
                        </label>
                        <textarea
                            className="min-h-200px"
                            id="description"
                            defaultValue={this.state.detail}
                        ></textarea>

                        <div className="checkbox flex items-center  m-1 ">
                            <input
                                defaultChecked={this.state.swap}
                                className="w-[20px] h-[20px]"
                                id="swap"
                                type={"checkbox"}
                            ></input>
                            <label className="mx-2 font-bold text-[12px]">
                                Çalşyk
                            </label>
                        </div>
                        <div className="checkbox flex items-center  m-1 ">
                            <input
                                defaultChecked={this.state.credit}
                                className="w-[20px] h-[20px]"
                                id="credit"
                                type={"checkbox"}
                            ></input>
                            <label className="mx-2 font-bold text-[12px]">
                                Kredit
                            </label>
                        </div>

                        <div className="grid grid-cols-2">
                            <button
                                onClick={() => {
                                    this.save();
                                }}
                                className="bg-green-600 text-white rounded-md m-1 p-2"
                            >
                                Ýatda sakla
                            </button>
                            <button
                                onClick={() => {
                                    this.delete();
                                }}
                                className="bg-red-600 text-white rounded-md m-1 p-2"
                            >
                                Bozmak
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CarEdit;
