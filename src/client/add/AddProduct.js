import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdClose } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import LocationSelector from "../../admin/LocationSelector";
import { BiMap, BiSave, BiTrash } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import ProgressIndicator from "../../admin/ProgressIndicator";

class AddProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            categories: [],
            selected_images: [],
            selectedImageCount: 0,
            locations: [],
            countries: [],
            brands: [],
            units: [],
            stores: [],
            customerID: null,
            storeID: null,
            location_id: "",
            location_name: "",
        };

        document.title = "Täze haryt";
    }
    componentDidMount() {
        this.setData();
    }

    setData() {
        const customer_id = localStorage.getItem("user_id");
        axios
            .get(server + "/mob/stores?customer=" + customer_id)
            .then((resp) => {
                this.setState({ stores: resp.data.data });
            });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
        });

        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({ categories: resp.data["categories"] });
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
            if (t.find((x) => x.name === files[i].name) === undefined) {
                t.push(files[i]);
            }
        }

        this.setState({ selected_images: t }, () => {
            this.setState({
                selectedImageCount: this.state.selected_images.length,
            });
        });
    }

    add_phone() {
        var temp = this.state.phone_elems;
        temp.push(
            <input
                className="phones"
                placeholder="Telefon belgisi"
                type="number"
            ></input>
        );
        this.setState({ phone_elems: temp });
    }

    removeImage(file) {
        var temp = this.state.selected_images;
        temp.splice(temp.indexOf(file), 1);
        this.setState({ selected_images: temp }, () => {
            this.setState({
                selectedImageCount: this.state.selected_images.length,
            });
        });
    }

    save() {
        var formdata = new FormData();
        formdata.append("name", document.getElementById("name").value);
        formdata.append("location", this.state.location_id);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("category", document.getElementById("category").value);
        formdata.append(
            "description",
            document.getElementById("description").value
        );
        formdata.append("price", document.getElementById("price").value);

        if (document.getElementById("name").value === "") {
            alert("Adyny hökman girizmeli!");
            return null;
        }

        if (this.state.selected_images.length === 0) {
            alert("Surat hökan saýlamaly!");
            return null;
        }

        this.state.selected_images.map((item) => {
            formdata.append("images", item);
        });

        formdata.append("store", localStorage.getItem("user_id"));
        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/products", formdata)
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Haryt goşuldy");
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    clearSelectedImages() {
        this.setState({ selected_images: [] }, () => {
            this.setState({
                selectedImageCount: this.state.selected_images.length,
            });
        });
    }

    render() {
        return (
            <div className="grid max-w-[400px] p-4 mx-auto text-[13px]">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <h3 className="font-bold text-[20px]">Haryt</h3>
                <div className="grid">
                    <input placeholder="Ady" id="name"></input>
                    <input
                        placeholder="Bahasy (TMT)"
                        id="price"
                        type="number"
                        min={0}
                    ></input>

                    <select className="" id="category">
                        <option value={""}>Kategoriýasy</option>
                        {this.state.categories.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>
                    <div className="location border rounded p-1  flex items-center">
                        <BiMap
                            size={25}
                            className="hover:text-slate-400 duration-200 text-slate-600"
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
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

                    <input
                        id="phone"
                        placeholder="Telefon belgisi"
                        type="number"
                    ></input>

                    <textarea
                        placeholder="Giňişleýin maglumat"
                        className="min-h-[100px] p-2"
                        id="description"
                    ></textarea>

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
                                        size={35}
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

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="p-1 my-4 rounded-md justify-center bg-green-600 flex items-center text-white"
                    >
                        <BiSave size={20} className="m-2"></BiSave>
                        <label>Ýatda saklamak</label>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddProduct;
