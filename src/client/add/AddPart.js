import axios from "axios";
import React from "react";
import { server } from "../../static";
import Loader from "../components/Loader";
import { BiMap, BiSave, BiTrash } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";
import { toast, ToastContainer } from "react-toastify";

class AddPart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            categories: [],
            selected_images: [],
            marks: [],
            models: [],
            stores: [],
            error: false,
            location_id: "",
            location_name: "",
        };

        document.title = "Täze awtoşaý";
    }

    componentDidMount() {
        this.setData();
    }

    setData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const store_id = urlParams.get("store");
        const customer_id = urlParams.get("customer");

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

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/part" + q).then((resp) => {
            this.setState({
                categories: resp.data["categories"],
                transmissions: resp.data["transmissions"],
                countries: resp.data["countries"],
                colors: resp.data["colors"],
                wds: resp.data["wheel_drives"],
                models: resp.data["models"],
                marks: resp.data["marks"],
                fuels: resp.data["fuels"],
                bodyTypes: resp.data["body_types"],
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
        if (document.getElementById("name").value.length === 0) {
            toast.error("Adyny hökman girizmeli");
            return null;
        }

        var formdata = new FormData();

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("location_id", this.state.location_id);
        formdata.append("mark", document.getElementById("mark").value);
        formdata.append("model", document.getElementById("model").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("name_tm", document.getElementById("name").value);
        formdata.append("category", document.getElementById("category").value);
        formdata.append("customer", localStorage.getItem("user_id"));

        for (let i = 0; i < this.state.selected_images.length; i++) {
            formdata.append("images", this.state.selected_images[i]);
        }

        if (localStorage.getItem("id") != null) {
            formdata.append("customer", localStorage.getItem("id"));
        }

        if (this.state.storeID != null) {
            formdata.append("store", this.state.storeID);
        }

        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/parts", formdata)
            .then((resp) => {
                this.setState({ isLoading: false });
                alert(
                    "Awtoşaý üstünlikli goşuldy. Moderator tassyklamasyna garaşyň"
                );
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                this.setState({ isLoading: false });
            });
    }

    setErrorMessage(msg) {
        this.setState({ errorText: msg, error: true });
    }

    render() {
        return (
            <div className="max-w-[600px] grid my-2 mx-auto">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <Loader open={this.state.isLoading}></Loader>
                {this.state.error === true && (
                    <div className="error_container">
                        <label className="error">{this.state.errorText}</label>
                    </div>
                )}

                <h3 className="font-bold text-[20px]">Täze awtoşaý</h3>
                <div className="grid">
                    <input
                        onChange={() => {
                            this.onImgSelect();
                        }}
                        id="imgselector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>

                    <input id="name" type={"text"} placeholder="Ady"></input>
                    <select
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
                        <option hidden value={""}>
                            Markasy
                        </option>
                        {this.state.marks.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>

                    <select id="model">
                        <option hidden value={""}>
                            Model
                        </option>
                        {this.state.models.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
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

                    <input
                        id="price"
                        placeholder="Bahasy (TMT)"
                        type={"number"}
                        min={0}
                    ></input>

                    <div className="rounded-md border flex items-center">
                        <BiMap
                            size={25}
                            className="hover:text-slate-400 rounded-md m-2"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                        ></BiMap>
                        <label>{this.state.location_name}</label>
                        {this.state.location_name.length > 0 && (
                            <MdClose
                                size={25}
                                className="border rounded-circle"
                                onClick={() => {
                                    this.setState({ location_name: "" });
                                    this.setState({ location_id: "" });
                                }}
                            ></MdClose>
                        )}
                    </div>

                    <textarea id="detail" placeholder="Goşmaça"></textarea>

                    <div className="grid grid-cols-3 sm:grid-cols-2">
                        {this.state.selected_images.map((item) => {
                            return (
                                <div className="item">
                                    <img
                                        alt=""
                                        src={URL.createObjectURL(item)}
                                    ></img>
                                    <div className="text">
                                        <BiTrash
                                            onClick={() => {
                                                this.removeImage(item);
                                            }}
                                            className="m-1"
                                        >
                                            Bozmak
                                        </BiTrash>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <input
                        id="phone"
                        type="number"
                        placeholder="Telefon belgisi (993 XX XXXXXX)"
                    ></input>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="rounded-md p-2 w-max flex items-center bg-sky-700 text-white"
                    >
                        <BiSave size={25} className="m-1"></BiSave>
                        <label>Ýatda saklamak</label>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddPart;
