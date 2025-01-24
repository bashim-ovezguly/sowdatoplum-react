import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiSave, BiTrash } from "react-icons/bi";
import ProgressIndicator from "../../admin/ProgressIndicator";

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

        document.title = "Täze aksiýa";
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
            <div className="grid max-w-[400px] p-4 mx-auto">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <h3 className="font-bold text-[20px]">Aksiýa</h3>
                <div className="grid">
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

                    <textarea
                        placeholder="Text"
                        className="min-h-[200px]"
                        id="text"
                    ></textarea>

                    <div>
                        <label>
                            Saýlanan suratlar:{" "}
                            {this.state.selected_images.length}
                        </label>
                    </div>

                    {/* IMAGES */}
                    <div className="flex overflow-x-auto my-2 py-2">
                        {this.state.selected_images.map((item) => {
                            return (
                                <div className="rounded-lg p-1 relative border h-[150px] w-[150px] min-w-[150px] overflow-hidden m-1 ">
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
                        className="p-2 rounded-md border my-1 text-sky-600 border-sky-600 "
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                    >
                        Surat goşmak
                    </button>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="flex justify-center items-center p-1 my-4 rounded-md bg-green-600 w-full text-white 
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
