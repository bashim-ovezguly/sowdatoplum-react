import axios from "axios";
import React from "react";
import { BiMap, BiSave } from "react-icons/bi";
import { server } from "../../static";
import Loader from "../components/Loader";
import { MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";
import { toast } from "react-toastify";

class AddFlat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            categories: [],
            streets: [],
            remont_states: [],
            selected_images: [],
            location_id: "",
            location_name: "",
        };

        document.title = "Täze emläk";
    }

    componentDidMount() {
        this.setData();
    }

    setData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const store_id = urlParams.get("store");
        const customer_id = localStorage.getItem("id");

        // parent store
        if (store_id != null) {
            axios.get(server + "/mob/stores/" + store_id).then((resp) => {
                this.setState({ storeName: resp.data["name_tm"] });
                this.setState({ img: resp.data["img"] });
                this.setState({ storeID: store_id });
            });
        }

        // parent customer
        if (customer_id != null) {
            axios.get(server + "/mob/customer/" + customer_id).then((resp) => {
                this.setState({ customerName: resp.data.data["name"] });
                this.setState({ customerID: customer_id });
            });
        }

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
        });

        axios.get(server + "/mob/index/flat").then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                remont_states: resp.data["remont_states"],
                streets: resp.data["streets"],
            });

            this.setState({ isLoading: false });
        });
    }

    onImgSelect() {
        var files = document.getElementById("imgselector").files;
        var t = [];

        for (let i = 0; i < this.state.selected_images.length; i++) {
            t.push(this.state.selected_images[i]);
        }

        for (let i = 0; i < files.length; i++) {
            if (t.find((x) => x.name == files[i].name) == undefined) {
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
        var formdata = new FormData();

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("address", document.getElementById("address").value);
        formdata.append("location", this.state.location_id);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("category", document.getElementById("category").value);

        for (let i = 0; i < this.state.selected_images.length; i++) {
            formdata.append("images", this.state.selected_images[i]);
        }

        if (localStorage.getItem("user_id") != null) {
            formdata.append("customer", localStorage.getItem("user_id"));
        } else {
            toast.error("Ulanyjy anyklanmady");
        }

        if (this.state.storeID != null) {
            formdata.append("store", this.state.storeID);
        }

        if (document.getElementById("swap").checked === true) {
            formdata.append("swap", true);
        }

        if (document.getElementById("credit").checked === true) {
            formdata.append("credit", true);
        }

        if (document.getElementById("none_cash_pay").checked === true) {
            formdata.append("none_cash_pay", true);
        }

        if (document.getElementById("ipoteka").checked === true) {
            formdata.append("ipoteka", true);
        }

        if (document.getElementById("own").checked === true) {
            formdata.append("own", true);
        }

        if (document.getElementById("type").value === "rent") {
            formdata.append("for_rent", true);
        } else {
            formdata.append("for_rent", false);
        }

        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/flats", formdata)
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("Üstünlikli goşuldy. Moderator tassyklamasyna garaşyň");
                window.location.reload();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: false });
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
            <div className="grid max-w-[600px] my-2 mx-auto">
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <Loader open={this.state.isLoading}></Loader>
                <h3 className="font-bold text-[20px]">Täze emläk</h3>
                <div className="grid ">
                    <input
                        onChange={() => {
                            this.onImgSelect();
                        }}
                        id="imgselector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>
                    <input id="name" placeholder="Ady"></input>

                    <select id="type">
                        <option value={"sale"}>Satlyk</option>
                        <option value={"rent"}>Kärendesine</option>
                    </select>

                    <select id="category">
                        <option hidden value={""}>
                            Kategoriýasy
                        </option>
                        {this.state.categories.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <div className="border rounded-md flex items-center">
                        <BiMap
                            size={25}
                            className="hover:bg-slate-200 rounded-md m-2"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        ></BiMap>
                        <label className="mx-1 hover:text-sky-400">
                            {this.state.location_name}
                        </label>
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

                    <input
                        id="price"
                        placeholder="Bahasy (TMT)"
                        type={"number"}
                        min={0}
                    ></input>
                    <input id="address" placeholder="Salgysy"></input>
                    <input
                        id="floor"
                        type={"number"}
                        min={0}
                        placeholder="Binadaky gat sany"
                    ></input>
                    <input
                        id="at_floor"
                        type={"number"}
                        min={0}
                        placeholder="Ýerleşýän gaty"
                    ></input>
                    <input
                        id="room"
                        type={"number"}
                        min={1}
                        placeholder="Otag sany"
                    ></input>
                    <input
                        id="square"
                        type={"number"}
                        placeholder="Meýdany"
                    ></input>
                    <input
                        id="people"
                        type={"number"}
                        placeholder="Ýazgydaky adam sany"
                    ></input>

                    <select id="remont_state">
                        <option hidden value={""}>
                            Remont ýagdaýy
                        </option>
                        {this.state.remont_states.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <textarea
                        id="detail"
                        placeholder="Giňişleýin maglumat..."
                    ></textarea>

                    <input
                        id="phone"
                        className="phone"
                        placeholder="Telefon belgisi"
                        type="number"
                    ></input>

                    <div className="flex items-center  duration-300 rounded-md my-1 p-1">
                        <input
                            className="w-[20px] h-[20px]"
                            id="own"
                            type="checkbox"
                        ></input>
                        <label
                            onClick={() => {
                                document.getElementById("own").click();
                            }}
                            className="mx-1 hover:text-sky-400"
                        >
                            Eýesinden
                        </label>
                    </div>

                    <div className="flex items-center  duration-300 rounded-md my-1 p-1">
                        <input
                            className="w-[20px] h-[20px]"
                            id="swap"
                            type="checkbox"
                        ></input>
                        <label
                            onClick={() => {
                                document.getElementById("swap").click();
                            }}
                            className="mx-1 hover:text-sky-400"
                        >
                            Çalşyk
                        </label>
                    </div>

                    <div className="flex items-center  duration-300 rounded-md my-1 p-1">
                        <input
                            className="w-[20px] h-[20px]"
                            id="credit"
                            type="checkbox"
                        ></input>
                        <label
                            onClick={() => {
                                document.getElementById("credit").click();
                            }}
                            className="mx-1 hover:text-sky-400"
                        >
                            Kredit
                        </label>
                    </div>

                    <div className="flex items-center  duration-300 rounded-md my-1 p-1">
                        <input
                            className="w-[20px] h-[20px]"
                            id="none_cash_pay"
                            type="checkbox"
                        ></input>
                        <label
                            onClick={() => {
                                document
                                    .getElementById("none_cash_pay")
                                    .click();
                            }}
                            className="mx-1 hover:text-sky-400"
                        >
                            Nagt däl töleg
                        </label>
                    </div>

                    <div className="flex items-center  duration-300 rounded-md my-1 p-1">
                        <input
                            className="w-[20px] h-[20px]"
                            id="ipoteka"
                            type="checkbox"
                        ></input>
                        <label
                            onClick={() => {
                                document.getElementById("ipoteka").click();
                            }}
                            className="mx-1 hover:text-sky-400"
                        >
                            Ipoteka
                        </label>
                    </div>

                    {/* IMAGES */}
                    <div className="flex flex-wrap justify-center overflow-x-auto">
                        {this.state.selected_images.map((item) => {
                            return (
                                <div className="w-[140px] h-[140px] relative m-[10px] ">
                                    <img
                                        className="h-[100%] border rounded-md w-[100%] object-cover"
                                        alt=""
                                        src={URL.createObjectURL(item)}
                                    ></img>
                                    <MdClose
                                        className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                            duration-300 absolute bg-red-600 rounded-[50%] p-[5px] 
                                            text-white shadow-md right-[5px] top-[5px]"
                                        onClick={() => {
                                            this.removeImage(item);
                                        }}
                                        size={35}
                                    ></MdClose>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="p-2 w-max flex items-center bg-sky-700 text-white rounded-md"
                    >
                        <BiSave className=" m-1"></BiSave>
                        <label className="mx-1 hover:text-sky-400">
                            Ýatda sakla
                        </label>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddFlat;
