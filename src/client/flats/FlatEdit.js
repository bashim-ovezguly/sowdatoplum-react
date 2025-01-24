import axios from "axios";
import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { server } from "../../static";
import { CircularProgress } from "@mui/material";
import Loader from "../components/Loader";
import { ToastContainer } from "react-toastify";

class FlatEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            images: [],

            categories: [],
            trade_centers: [],
            sizes: [],
            locations: [],
            units: [],
            brands: [],
            factories: [],
            selected_images: [],
            countries: [],
            location_id: "",
            location_name: "",

            headers: {
                token: localStorage.getItem("access_token"),
            },
        };

        document.title = "Gozgalmaýan emläk | Düzetmek";
        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios.get(server + "/mob/flats/" + id).then((resp) => {
            this.setState({
                name: resp.data.name,
                location: resp.data.location.name,
                location_id: resp.data.location.id,
                detail_text: resp.data.body_tm,
                img: resp.data.img,
                images: resp.data.images,
                category: resp.data.category.name,
                category_id: resp.data.category.id,
                phone: resp.data.phone,
                at_floor: resp.data.at_floor,
                floor: resp.data.floor,
                room_count: resp.data.room_count,
                square: resp.data.square,
                description: resp.data.description,
                id: resp.data.id,
                price: resp.data.price,

                isLoading: false,
            });
        });

        axios.get(server + "/mob/index/flat").then((resp) => {
            this.setState({ categories: resp.data["categories"] });
        });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
            this.setState({ isLoading: false });
        });

        axios.get(server + "/mob/customers").then((resp) => {
            this.setState({ customers: resp.data });
        });
    }

    removeImage(file) {
        var temp = this.state.selected_images;
        temp.splice(temp.indexOf(file), 1);
        this.setState({ selected_images: temp });
    }

    addSelectedImages() {
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(server + "/mob/flats/" + this.state.id, formdata)
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(server + "/mob/flats/" + this.state.id, formdata, {
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

    // removeImage(id) {
    //     if (window.confirm("Bozmaga ynamyňyz barmy?") == true)
    //         axios
    //             .post(
    //                 server + "/mob/flats/img/delete/" + id,
    //                 {},
    //                 { headers: this.state.headers }
    //             )
    //             .then((resp) => {
    //                 this.setData();
    //             })
    //             .catch((err) => {
    //                 alert("Ýalňyşlyk ýüze çykdy");
    //             });
    // }

    save() {
        this.setState({ isLoading: true });
        if (document.getElementById("name").value.length == 0) {
            alert("Adyny hökman girizmeli");
            this.setState({ isLoading: false });
            return null;
        }

        var formdata = new FormData();
        formdata.append("name", document.getElementById("name").value);

        if (document.getElementById("category").value != "") {
            formdata.append(
                "category",
                document.getElementById("category").value
            );
        }

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append(
            "room_count",
            document.getElementById("room_count").value
        );
        formdata.append("floor", document.getElementById("floor").value);
        formdata.append("at_floor", document.getElementById("at_floor").value);
        formdata.append("square", document.getElementById("square").value);
        formdata.append(
            "description",
            document.getElementById("description").value
        );

        formdata.append("location", this.state.location_id);

        axios
            .put(server + "/mob/flats/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }
    delete() {
        if (window.confirm("Bozmaga ynamyňyz barmy?") == false) {
            return null;
        }

        axios
            .post(server + "/mob/flats/delete/" + this.state.id, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: false });
                window.history.back();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-1 text-[12px]">
                <div className="grid h-max p-2">
                    <ToastContainer
                        autoClose={true}
                        closeOnClick={true}
                    ></ToastContainer>
                    <Loader open={this.state.isLoading}></Loader>

                    <input
                        onChange={() => {
                            this.addSelectedImages();
                        }}
                        id="imgselector"
                        multiple
                        hidden
                        className="max-w-300px"
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>
                    <img
                        alt=""
                        className="w-full p-1"
                        src={server + this.state.img}
                    ></img>
                    <div className="grid overflow-x-auto p-1">
                        {this.state.images.map((item) => {
                            var img = server + item.img;
                            return (
                                <div
                                    className="border my-1 grid grid-cols-[max-content_auto] text-[12px]"
                                    key={item.id}
                                >
                                    <img
                                        alt=""
                                        className=" w-[100px] p-1 h-[100px] object-cover max-w-none"
                                        src={img}
                                    ></img>
                                    <div className="flex items-center ">
                                        <button
                                            className="flex items-center border m-1 p-1 text-red-600"
                                            onClick={() => {
                                                this.removeImage(item.id);
                                            }}
                                        >
                                            <label>Bozmak</label>
                                            <MdClose
                                                title="Bozmak"
                                                size={25}
                                                className="mx-2"
                                            ></MdClose>
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.setMainImage(item.id);
                                            }}
                                            className="flex items-center border m-1 p-1"
                                        >
                                            <label>Esasy</label>

                                            <FcCheckmark
                                                size={25}
                                                title="Esasy surata bellemek"
                                                className="mx-2"
                                            ></FcCheckmark>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                        className="bg-sky-600 text-white p-1 rounded-md w-max"
                    >
                        Surat goşmak
                    </button>
                </div>

                <div className="grid max-w-[400px] h-max p-2">
                    <label className="fieldName">Ady</label>
                    <input id="name" defaultValue={this.state.name}></input>

                    <label className="fieldName">Bahasy (TMT)</label>
                    <input
                        id="price"
                        type="number"
                        defaultValue={this.state.price}
                    ></input>

                    <label className="fieldName">Otag sany</label>
                    <input
                        id="room_count"
                        type="number"
                        defaultValue={this.state.room_count}
                    ></input>

                    <label className="fieldName">Binadaky gat sany</label>
                    <input
                        id="floor"
                        type="number"
                        defaultValue={this.state.floor}
                    ></input>

                    <label className="fieldName">Ýerleşýän gaty</label>
                    <input
                        id="at_floor"
                        type="number"
                        defaultValue={this.state.at_floor}
                    ></input>

                    <label className="fieldName">Meýdany</label>
                    <input
                        id="square"
                        type="number"
                        defaultValue={this.state.square}
                    ></input>

                    <label className="fieldName">Telefon belgisi</label>
                    <input id="phone" defaultValue={this.state.phone}></input>

                    <label className="fieldName">Kategoriýasy</label>
                    <select id="category">
                        <option hidden value={""}>
                            {this.state.category}
                        </option>
                        {this.state.categories.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <label className="fieldName">Ýerleşýän ýeri</label>
                    <select id="location">
                        <option value={""}>{this.state.location}</option>
                        {this.state.locations.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>

                    <label className="fieldName">Giňişleýin maglumat</label>
                    <textarea
                        id="description"
                        defaultValue={this.state.description}
                    ></textarea>

                    <div className="btns">
                        <button
                            onClick={() => {
                                this.save();
                            }}
                            className="bg-green-600 text-white rounded-md m-[5px] p-[5px]"
                        >
                            Ýatda saklamak
                        </button>
                        <button
                            onClick={() => {
                                this.delete();
                            }}
                            className="bg-red-600 text-white rounded-md m-[5px] p-[5px]"
                        >
                            Bozmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FlatEdit;
