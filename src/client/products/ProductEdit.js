import axios from "axios";
import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { MdCheck, MdClose } from "react-icons/md";
import { productUrl, server } from "../../static";
import { CircularProgress } from "@mui/material";
import { BiMap } from "react-icons/bi";
import LocationSelector from "../../admin/LocationSelector";
import { toast, ToastContainer } from "react-toastify";

class ProductEdit extends React.Component {
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

        // document.title = 'Dükanlar';
        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios.get(productUrl + "/" + id).then((resp) => {
            this.setState({
                name: resp.data.name,
                location_id: resp.data.location.id,
                location_name: resp.data.location.name,
                description: resp.data.description,
                img: resp.data.img,
                amount: resp.data.amount,
                images: resp.data.images,
                category: resp.data.category.name,
                category_id: resp.data.category.id,
                address: resp.data.address,
                phone: resp.data.phone,
                id: resp.data.id,
                created_at: resp.data.created_at,
                price: resp.data.price,
                isLoading: false,
            });
            document.title = resp.data.name;
        });

        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({ categories: resp.data["categories"] });
        });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
            this.setState({ isLoading: false });
        });
    }

    addSelectedImages() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(server + "/mob/products/" + this.state.id, formdata)
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
            .put(server + "/mob/products/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                toast.success("Ýatda saklandy");

                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        this.setState({ isLoading: true });
        if (document.getElementById("name").value.length === 0) {
            toast.warning("Adyny hökman girizmeli");
            this.setState({ isLoading: false });
            return null;
        }

        var formdata = new FormData();
        formdata.append("name_tm", document.getElementById("name").value);

        if (document.getElementById("category").value !== "") {
            formdata.append(
                "category",
                document.getElementById("category").value
            );
        }

        formdata.append(
            "description",
            document.getElementById("description").value
        );
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("amount", document.getElementById("amount").value);
        formdata.append("location", this.state.location_id);

        let headers = { token: localStorage.getItem("user_access_token") };
        axios
            .put(server + "/mob/products/" + this.state.id, formdata, {
                headers: headers,
            })
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }
    delete() {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === false) {
            return null;
        }

        axios
            .post(server + "/mob/products/delete/" + this.state.id, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setData();
                this.setState({ isLoading: false });
                window.history.back();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: false });
            });
    }

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(server + "/mob/products/img/delete/" + id)
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    toast.error("Ýalňyşlyk ýüze çykdy");
                });
    }

    render() {
        // const customer_page= '/customer/'+this.state.customer_id+'/';
        var default_img_url = "/default.png";
        var main_img = server + this.state.img;

        if (this.state.img === "") {
            main_img = default_img_url;
        }

        return (
            <div className="product_edit grid p-2">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                {this.state.isLoading && (
                    <div className="progress">
                        <CircularProgress></CircularProgress>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-1 ">
                    <div className="grid h-max">
                        <img
                            alt=""
                            className="w-full h-[300px] border object-contain"
                            src={main_img}
                        ></img>
                        <div className="flex flex-wrap overflow-x-auto w-full p-1 border my-2 ">
                            {this.state.images.map((item) => {
                                var img = server + item.img_s;
                                if (item.img_m === "") {
                                    img = default_img_url;
                                }

                                return (
                                    <div className="relative m-1" key={item.id}>
                                        <img
                                            alt=""
                                            className="h-[90px] w-[90px] object-cover rounded-md "
                                            src={img}
                                        ></img>
                                        <div className="absolute top-[2px] left-[2px] z-2 flex">
                                            <MdClose
                                                size={25}
                                                title="Bozmak"
                                                onClick={() => {
                                                    this.removeImage(item.id);
                                                }}
                                                className="bg-red-700 hover:bg-red-600 duration-300 hover:shadow-lg text-white rounded-full p-[5px] m-[2px]"
                                            ></MdClose>
                                            <MdCheck
                                                size={25}
                                                onClick={() => {
                                                    this.setMainImage(item.id);
                                                }}
                                                title="Esasy surata bellemek"
                                                className="bg-white hover:bg-slate-400 duration-300 hover:shadow-lg  text-green-700 rounded-full p-[5px] m-[2px]"
                                            ></MdCheck>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div>
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
                            <button
                                onClick={() => {
                                    document
                                        .getElementById("imgselector")
                                        .click();
                                }}
                                className="w-max bg-dodgerblue text-white p-5px shadowed "
                            >
                                Surat goş
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                document.getElementById("imgselector").click();
                            }}
                            className="bg-sky-600 text-white w-max p-[5px]"
                        >
                            Surat goşmak
                        </button>
                    </div>

                    <div className="grid max-w-[400px] text-[14px] h-max mx-[10px]">
                        <label className="">Ady</label>
                        <input id="name" defaultValue={this.state.name}></input>
                        <label className="">Bahasy</label>
                        <input
                            id="price"
                            type="number"
                            defaultValue={this.state.price}
                        ></input>
                        <label className="">Ammardaky sany</label>
                        <input
                            id="amount"
                            type="number"
                            defaultValue={this.state.amount}
                        ></input>
                        <label className="">Telefon belgisi</label>
                        <input
                            type="number"
                            id="phone"
                            defaultValue={this.state.phone}
                        ></input>
                        <label className="">Kategoriýasy</label>
                        <select id="category">
                            <option value={""}>{this.state.category}</option>
                            {this.state.categories.map((item) => {
                                return (
                                    <option value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>
                        <label className="">Ýerleşýän ýeri</label>
                        <div className="border p-1 flex items-center rounded-md">
                            <BiMap
                                size={25}
                                className="hover:bg-slate-100 rounded-full mx-2 "
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            <label>{this.state.location_name}</label>
                            {this.state.location_name != undefined && (
                                <MdClose
                                    size={25}
                                    className="border hover:bg-slate-400 mx-2 rounded-full"
                                    onClick={() => {
                                        this.setState({ location_name: "" });
                                        this.setState({ location_id: "" });
                                    }}
                                ></MdClose>
                            )}
                        </div>
                        {this.state.locationSelectorOpen && (
                            <LocationSelector parent={this}></LocationSelector>
                        )}
                        <label className="">Giňişleýin maglumat</label>
                        <textarea
                            className="min-h-[200px]"
                            id="description"
                            defaultValue={this.state.description}
                        ></textarea>
                        <div className="grid grid-cols-2">
                            <button
                                onClick={() => {
                                    this.save();
                                }}
                                className="bg-green-600 text-white p-2 rounded-md m-1 hover:bg-slate-400 duration-150"
                            >
                                Ýatda saklamak
                            </button>
                            <button
                                onClick={() => {
                                    this.delete();
                                }}
                                className="bg-red-600 text-white p-2 rounded-md m-1 hover:bg-slate-400 duration-150"
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

export default ProductEdit;
