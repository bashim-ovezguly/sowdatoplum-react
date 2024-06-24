import axios from "axios";
import React from "react";
import { BiMap, BiPhone, BiTime } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import { MdCheck, MdClose } from "react-icons/md";
import { server } from "../../static";
import LocationSelector from "../../admin/LocationSelector";
import Loader from "../components/Loader";
import { FiEye } from "react-icons/fi";

class StoreEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            viewed: 0,
            center: "",
            customer_id: "",
            customer_name: "",
            phones: [],
            body_tm: "",
            street: "",
            trade_center: "",
            categories: [],
            trade_centers: [],
            sizes: [],
            locations: [],

            selected_images: [],

            location_name: "",
            location_id: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        // document.title = 'Dükanlar';
        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios.get(server + "/mob/stores/" + id).then((resp) => {
            this.setState({
                name: resp.data.name_tm,
                location: resp.data.location,
                viewed: resp.data.viewed,
                detail_text: resp.data.body_tm,
                img: resp.data.img,
                created_at: resp.data.created_at,
                images: resp.data.images,
                products: resp.data.products,
                category: resp.data.category,
                center: resp.data.center,
                phones: resp.data.phones,
                customer_id: resp.data.customer.id,
                customer_name: resp.data.customer.name,
                id: resp.data.id,
                trade_center: resp.data.center,
                location_id: resp.data.location.id,
                location_name: resp.data.location.name,
                delivery: resp.data.has_delivery,
                isLoading: false,
            });
        });

        axios.get(server + "/mob/index/store").then((resp) => {
            this.setState({ categories: resp.data["categories"] });
            this.setState({ sizes: resp.data["sizes"] });
            this.setState({ trade_centers: resp.data["trade_centers"] });
            this.setState({ streets: resp.data["streets"] });
        });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data });
        });
    }

    // removeImage(file){
    //     var temp = this.state.selected_images
    //     temp.splice(temp.indexOf(file), 1)

    //     this.setState({selected_images: temp})
    // }

    addSelectedImages() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        axios
            .put(server + "/mob/stores/" + this.state.id, formdata)
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: false });
            });
    }

    setMainImage(id) {
        var formdata = new FormData();

        formdata.append("img", id);

        axios
            .put(server + "/mob/stores/" + this.state.id, formdata)
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
                .post(server + "/mob/stores/img/delete/" + id)
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
    }

    deleteStore(id) {
        let result = window.confirm("Dükan bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(server + "/mob/stores/delete/" + id)
            .then((resp) => {
                this.setData();
                window.history.back();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        this.setState({ isLoading: true });

        if (document.getElementById("name").value.length === 0) {
            alert("Adyny hökman girizmeli");
            return null;
        }

        if (this.state.location_id === undefined) {
            alert("Ýerleşýän ýerini görkeziň");
            return null;
        }

        var formdata = new FormData();
        formdata.append("name", document.getElementById("name").value);
        formdata.append("body_tm", document.getElementById("body_tm").value);

        if (document.getElementById("delivery").checked) {
            formdata.append("has_delivery", true);
        } else {
            formdata.append("has_delivery", false);
        }

        formdata.append("category", document.getElementById("category").value);
        formdata.append(
            "center",
            document.getElementById("trade_center").value
        );
        formdata.append("body_tm", document.getElementById("body_tm").value);
        formdata.append("location", this.state.location_id);

        axios
            .put(server + "/mob/stores/" + this.state.id, formdata)
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    addPhone() {
        var fdata = new FormData();
        fdata.append("phone", document.getElementById("new_contact").value);

        axios
            .put(server + "/mob/stores/" + this.state.id, fdata)
            .then((resp) => {
                this.setData();
            });
    }

    deletePhone(phone) {
        let name = "";
        if (phone.name != null) {
            name = phone.name;
        }
        let result = window.confirm(
            name +
                " " +
                phone.phone +
                " - telefon belgini bozmaga ynamyňyz barmy"
        );
        if (result === true) {
            axios
                .post(server + "/mob/stores/phone/delete/" + phone.id)
                .then((resp) => {
                    this.setData();
                });
        }
    }

    render() {
        var default_img_url = "/default.png";
        var main_img = server + this.state.img;

        if (this.state.img === "") {
            main_img = default_img_url;
        }

        if (this.state.isLoading) return <Loader open={true}></Loader>;

        return (
            <div className="stores_edit p-[10px] text-[14px]">
                <div className="preview flex m-[10px]">
                    <img
                        alt=""
                        className="rounded-lg shadow-md  object-cover w-[100px] h-[100px]"
                        src={main_img}
                    ></img>
                    <div className="grid h-max mx-[10px]">
                        <label className="sm:text-[17px] font-bold">
                            {this.state.name}
                        </label>
                        <label className="flex items-center">
                            {" "}
                            <BiMap></BiMap> {this.state.location.name}
                        </label>
                        <div className="flex items-center sm:text-[12px]">
                            <label className="my-[10px] flex items-center mr-[10px]">
                                {" "}
                                <FiEye></FiEye> {this.state.viewed}{" "}
                            </label>
                            <label className="my-[10px] flex items-center mr-[10px]">
                                {" "}
                                <BiTime></BiTime> {this.state.created_at}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1">
                    <div className="">
                        {/* images */}
                        <div className="flex flex-wrap">
                            {this.state.images.map((item) => {
                                var img = server + item.img_s;
                                if (item.img_m === "") {
                                    img = default_img_url;
                                }

                                return (
                                    <div
                                        className="relative m-[5px]"
                                        key={item.id}
                                    >
                                        <img
                                            alt=""
                                            className="h-[100px] w-[100px] object-cover rounded-md"
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
                            <button
                                className="p-[5px] text-white  bg-sky-600"
                                onClick={() => {
                                    document
                                        .getElementById("imgselector")
                                        .click();
                                }}
                            >
                                Surat goş
                            </button>
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
                        </div>
                    </div>

                    <div className="inputFields grid max-w-[400px] text-[13px]">
                        <label className="field_name m-5px ">Ady</label>
                        <input
                            className="field hover:border-sky-500 border"
                            id="name"
                            defaultValue={this.state.name}
                        ></input>

                        <label className="field_name">Kategoriýasy</label>
                        <select className="field" id="category">
                            <option value={""}>{this.state.category}</option>
                            {this.state.categories.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name_tm}
                                    </option>
                                );
                            })}
                        </select>

                        <label className="field_name">Ýerleşýän ýeri</label>
                        <div className="location border rounded-[5px] p-[10px] m-5px flex items-center">
                            <BiMap
                                size={25}
                                className="hover:bg-slate-200 rounded-md p-[2px]"
                                onClick={() => {
                                    this.setState({
                                        locationSelectorOpen: true,
                                    });
                                }}
                            ></BiMap>
                            <label>{this.state.location_name}</label>
                            {this.state.location_name !== "" && (
                                <MdClose
                                    size={25}
                                    className="border rounded-circle hover:bg-slate-400 rounded-md"
                                    onClick={() => {
                                        this.setState({ location_name: "" });
                                        this.setState({ location_id: "" });
                                    }}
                                ></MdClose>
                            )}
                        </div>

                        <label className="field_name">
                            Ýerleşýän söwda merkezi
                        </label>
                        <select className="field" id="trade_center">
                            <option value={""}>
                                {this.state.trade_center}
                            </option>
                            {this.state.trade_centers.map((item) => {
                                return (
                                    <option id={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>

                        {this.state.locationSelectorOpen && (
                            <LocationSelector parent={this}></LocationSelector>
                        )}

                        <div className="flex items-center border rounded-md p-[10px] m-[5px]">
                            {this.state.delivery === "True" && (
                                <input
                                    defaultChecked
                                    id="delivery"
                                    type="checkbox"
                                ></input>
                            )}
                            {this.state.delivery === "False" && (
                                <input id="delivery" type="checkbox"></input>
                            )}
                            <label>Eltip bermek hyzmaty</label>
                        </div>

                        <label className="field_name">
                            Giňişleýin maglumat
                        </label>
                        <textarea
                            className="field"
                            id="body_tm"
                            defaultValue={this.state.detail_text}
                        ></textarea>

                        <div className="flex">
                            <input
                                placeholder="Telefon belgisi "
                                className="field"
                                id="new_contact"
                            ></input>
                            <button
                                className="bg-sky-700 text-white px-[20px] m-[5px]"
                                onClick={() => {
                                    this.addPhone();
                                }}
                            >
                                Goş
                            </button>
                        </div>

                        <div className="phone_list">
                            {this.state.phones.map((item) => {
                                return (
                                    <div className="border p-[5px] m-[5px] w-max rounded">
                                        <BiPhone size={20}></BiPhone>
                                        <label>
                                            {item.phone} {item.name}{" "}
                                        </label>
                                        <MdClose
                                            size={25}
                                            onClick={() => {
                                                this.deletePhone(item);
                                            }}
                                            c
                                            lassName="close duration-300"
                                        ></MdClose>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex">
                            <button
                                onClick={() => {
                                    this.save();
                                }}
                                className="bg-green-700 text-white w-max p-[10px]"
                            >
                                Ýatda sakla
                            </button>
                            <button
                                onClick={() => {
                                    this.deleteStore(this.state.id);
                                }}
                                className="bg-red-700 text-white w-max p-[10px]"
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

export default StoreEdit;
