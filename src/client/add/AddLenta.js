import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdClose, MdDelete } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import LocationSelector from "../../admin/LocationSelector";
import { BiMap, BiSave } from "react-icons/bi";

class AddLenta extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
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
        this.setState({ isLoading: true });
        var formdata = new FormData();
        formdata.append("text", document.getElementById("text").value);
        // formdata.append('token', localStorage.getItem('user_access_token'))

        if (this.state.selected_images.length === 0) {
            alert("Surat hökan saýlamaly!");
            this.setState({ isLoading: false });
            return null;
        }

        this.state.selected_images.map((item) => {
            formdata.append("images", item);
        });

        formdata.append("customer", localStorage.getItem("user_id"));
        formdata.append("token", localStorage.getItem("user_access_token"));
        const token = localStorage.getItem("user_access_token");

        axios
            .post(server + "/mob/lenta", formdata, {
                headers: { token: token },
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                alert(
                    "Lenta üstünlikli goşuldy. Moderator tassyklamasyna garaşyň"
                );
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                alert("Ýalňyşlyk ýüze çykdy");
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
            <div className="grid max-w-[600px] my-2 mx-auto">
                {this.state.isLoading && (
                    <div className="flex justify-center">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <h3 className="font-bold text-[20px]">Täze lenta</h3>
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

                    <textarea
                        placeholder="Text"
                        className="min-h-100px"
                        id="text"
                    ></textarea>

                    {/* IMAGES */}
                    <div className="grid grid-cols-3 sm:grid-cols-2 justify-center overflow-x-auto">
                        {this.state.selected_images.map((item) => {
                            return (
                                <div className="h-[140px] relative m-1 ">
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
                        className="flex items-center p-1 rounded-md w-max border shadow-md bg-sky-700 text-white 
                                duration-300 hover:bg-slate-500"
                    >
                        <BiSave size={25} className="m-1"></BiSave>
                        <label className="mx-2">Ýatda saklamak</label>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddLenta;
