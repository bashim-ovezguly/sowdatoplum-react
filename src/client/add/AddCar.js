import axios from "axios";
import React from "react";
import { server } from "../../static";
import LocationSelector from "../../admin/LocationSelector";
import { BiMap, BiSave, BiTrash } from "react-icons/bi";
import Loader from "../components/Loader";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import ProgressIndicator from "../../admin/ProgressIndicator";

class AddCar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            categories: [],
            countries: [],
            selected_images: [],
            marks: [],
            models: [],
            fuels: [],
            transmissions: [],
            wds: [],
            bodyTypes: [],
            colors: [],
            stores: [],
            customers: [],
            location_name: "",
            location_id: "",
        };

        document.title = "Täze awtoulag";
        this.setData();
    }

    setData() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
        });

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/car" + q).then((resp) => {
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
                isLoading: false,
            });
        });
    }

    onImgSelect() {
        var files = document.getElementById("imgselector").files;
        var t = [];

        for (let i = 0; i < this.state.selected_images.length; i++) {
            t.push(this.state.selected_images[i]);
        }

        for (let i = 0; i < files.length; i++) {
            if (t.find((x) => x.name === files[i].name) === undefined) {
                t.push(files[i]);
            }
        }

        this.setState({ selected_images: t });
    }

    removeImage(file) {
        var temp = this.state.selected_images;
        temp.splice(temp.indexOf(file), 1);
        this.setState({ selected_images: temp });
    }

    save() {
        if (document.getElementById("mark").value.length == 0) {
            toast.error("Marka hökman görkezmeli");
            return null;
        }
        if (this.state.selected_images.length == 0) {
            toast.error("Surat hökman saýlamaly");
            return null;
        }

        var formdata = new FormData();

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append(
            "body_type",
            document.getElementById("body_type").value
        );
        formdata.append("location", this.state.location_id);
        formdata.append("mark", document.getElementById("mark").value);
        formdata.append("model", document.getElementById("model").value);
        formdata.append("color", document.getElementById("color").value);
        formdata.append("fuel", document.getElementById("fuel").value);
        formdata.append("store", localStorage.getItem("user_id"));
        formdata.append(
            "transmission",
            document.getElementById("transmission").value
        );
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("wd", document.getElementById("wd").value);
        formdata.append("motor", document.getElementById("motor").value);
        formdata.append("price", document.getElementById("price").value);

        for (let i = 0; i < this.state.selected_images.length; i++) {
            formdata.append("images", this.state.selected_images[i]);
        }

        if (this.props.customers === "all") {
            formdata.append(
                "customer",
                document.getElementById("customer").value
            );
        } else {
            formdata.append("customer", localStorage.getItem("user_id"));
        }

        if (document.getElementById("swap").checked === true) {
            formdata.append("swap", true);
        }

        if (document.getElementById("credit").checked === true) {
            formdata.append("credit", true);
        }

        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/cars", formdata)
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Üstünlikli goşuldy");
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    storeCard() {
        if (this.state.storeID == null) {
            return null;
        }
        return (
            <div className="storeCard">
                <img alt="" src={server + this.state.img}></img>
                <a href={"/stores/" + this.state.storeID}>
                    <h3>{this.state.storeName}</h3>
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="grid max-w-[400px] p-4 mx-auto">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <h3 className="font-bold text-[20px]">Awtoulag</h3>
                <div className="grid text-[12px]">
                    <select
                        className="p-2"
                        onChange={() => {
                            this.setState(
                                {
                                    selectedMark:
                                        document.getElementById("mark").value,
                                },
                                () => {
                                    this.setData();
                                }
                            );
                        }}
                        id="mark"
                    >
                        <option value={""}>Markasy</option>
                        {this.state.marks.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>

                    <select className="p-2" id="model">
                        <option value={""}>Model</option>
                        {this.state.models.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                    <input
                        id="year"
                        type={"number"}
                        className="p-2"
                        min={1900}
                        placeholder="Ýyly"
                    ></input>
                    <input
                        id="price"
                        className="p-2"
                        placeholder="Bahasy (TMT)"
                        type={"number"}
                        min={0}
                    ></input>
                    <input
                        id="motor"
                        type={"number"}
                        className="p-2"
                        step={0.1}
                        min={0}
                        max={10}
                        placeholder="Motoryň göwrümi"
                    ></input>
                    <input
                        id="millage"
                        className="p-2"
                        type={"number"}
                        min={0}
                        placeholder="Geçen ýoly (km)"
                    ></input>

                    <div className="border border-solid border-slate-300 rounded-md flex items-center p-1">
                        <BiMap
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                            className="text-slate-600 hover:bg-slate-200 rounded-md m-1 duration-300 "
                            size={25}
                        ></BiMap>

                        {this.state.location_name}
                        {this.state.location_name !== "" && (
                            <MdClose
                                size={20}
                                onClick={() => {
                                    this.setState({
                                        location_name: "",
                                        location_id: "",
                                    });
                                }}
                                className="border border-solid border-slate-300 rounded-full 
                                            p-[5px] m-[5px] w-[25px] h-[25px] hover:bg-slate-200 duration-300 "
                            ></MdClose>
                        )}
                    </div>

                    {this.state.locationSelectorOpen && (
                        <LocationSelector parent={this}></LocationSelector>
                    )}

                    <select className="p-2" id="body_type">
                        <option value={""}>Kuzow</option>
                        {this.state.bodyTypes.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>

                    <select className="p-2" id="color">
                        <option value={""}>Reňki</option>
                        {this.state.colors.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>

                    <select className="p-2" id="fuel">
                        <option value={""}>Ýangyjy</option>
                        {this.state.fuels.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <select className="p-2" id="transmission">
                        <option value={""}>Korobka</option>
                        {this.state.transmissions.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <select className="p-2" id="wd">
                        <option value={""}>Ýörediji görnüşi</option>
                        {this.state.wds.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <input
                        id="phone"
                        className="p-2"
                        placeholder="Telefon belgisi"
                    ></input>

                    <textarea
                        id="body_tm"
                        className="min-h-[100px] p-2"
                        placeholder="Giňişleýin maglumat..."
                    ></textarea>

                    <div className="flex items-center duration-300 rounded-md my-2">
                        <input
                            className="h-[20px] w-[20px]"
                            id="swap"
                            type={"checkbox"}
                        ></input>
                        <label className="mx-2">Obmen</label>
                    </div>
                    <div className="flex items-center duration-300 rounded-md my-2">
                        <input
                            className="h-[20px] w-[20px]"
                            id="credit"
                            type={"checkbox"}
                        ></input>
                        <label className="mx-2">Kredit</label>
                    </div>

                    <input
                        hidden
                        onChange={() => {
                            this.onImgSelect();
                        }}
                        id="imgselector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>

                    <div>
                        <label>
                            Saýlanan suratlar:{" "}
                            {this.state.selected_images.length}
                        </label>
                    </div>

                    <div className="flex overflow-x-auto my-2 py-2">
                        {this.state.selected_images.map((item) => {
                            return (
                                <div className="rounded-lg relative border h-[150px] w-[150px] min-w-[150px] overflow-hidden m-1 ">
                                    <img
                                        className=" object-cover rounded-md w-full h-full"
                                        alt=""
                                        src={URL.createObjectURL(item)}
                                    ></img>
                                    <BiTrash
                                        size={30}
                                        onClick={() => {
                                            this.removeImage(item);
                                        }}
                                        className="m-1 text-red-600 shadow-lg hover:bg-slate-100 duration-200 absolute bg-white rounded-full p-1 top-1 left-1"
                                    ></BiTrash>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="p-2 rounded-md bg-sky-600 my-1 text-white"
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                    >
                        Surat goşmak
                    </button>

                    {this.state.isLoading === false && (
                        <button
                            onClick={() => {
                                this.save();
                            }}
                            className="flex justify-center items-center p-2 my-4     rounded-md border shadow-md bg-green-600 text-white 
                                duration-300 hover:bg-slate-500"
                        >
                            <BiSave size={25} className="mx-[5px]"></BiSave>
                            Ýatda sakla
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default AddCar;
