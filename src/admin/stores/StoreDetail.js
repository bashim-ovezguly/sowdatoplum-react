import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiArrowBack, BiMap, BiPlus } from "react-icons/bi";
import {
    MdCall,
    MdCheck,
    MdClose,
    MdDelete,
    MdPlayCircle,
    MdSave,
    MdSort,
    MdTimer,
    MdWarning,
} from "react-icons/md";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import LocationSelector from "../LocationSelector";
import { IoMdEye, IoMdTrash } from "react-icons/io";
import { CircularProgress, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcCancel, FcCheckmark, FcUp } from "react-icons/fc";
import VideoThumbnail from "react-video-thumbnail";

import "react-toggle/style.css"; // for ES6 modules

class AdminStoreDetail extends React.Component {
    storesUrl = "/api/admin/stores/";
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        this.state = {
            videoAddModalisOpen: false,
            isLoading: true,
            activeTab: localStorage.getItem("store-tab"),

            id: id,
            status: "",
            category: "",
            name: "",
            phone: "",
            img: "./default.png",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            center: "",
            customers: [],
            phones: [],
            allLocations: [],
            categories: [],
            centers: [],
            sizes: [],
            street: "",
            allStreets: [],
            brands: [],
            units: [],
            countries: [],
            selected_images: [],
            selected_product_images: [],

            contacts: [],
            cars: [],
            videos: [],
            add_product_open: false,

            videoPlayerIsOpen: false,

            locationSelectorOpen: false,
            locationSelectorLoading: true,

            productsModalOpen: false,

            uploadedTotalSize: 0,

            location_id: "",
            location_name: "",

            products_last_page: "",
            total_products: "",
            products_current_page: "",

            product_ctgs: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },

            uploadedVideoUrl: "",
        };

        document.title = "Store giňişleýin";
        this.setData();
    }

    render() {
        return (
            <div className="grid">
                {this.VideoAddModal()}
                {this.ProductAddForm()}

                <div>
                    <Link
                        to={"/admin/stores"}
                        className="flex items-center hover:text-sky-600 font-bold w-max"
                    >
                        <BiArrowBack className="mx-1"></BiArrowBack>
                        <label>Stores</label>
                    </Link>
                </div>
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <Link
                    className="hover:text-sky-600 duration-200"
                    to={"/admin/stores"}
                ></Link>
                <div className="loading">
                    {this.state.isLoading && (
                        <CircularProgress> </CircularProgress>
                    )}
                </div>
                <div className="flex my-[10px]">
                    <div className="grid mx-[10px]">
                        <img
                            alt=""
                            className="w-[150px] h-[150px] object-cover rounded-full border overflow-hidden"
                            src={server + this.state.img}
                        ></img>
                    </div>
                    <div className="h-max grid">
                        <h2 className="text-[30px]">{this.state.name}</h2>
                        <div className="flex items-center">
                            <MdTimer></MdTimer>
                            <label>{this.state.created_at}</label>
                        </div>

                        <div className="flex items-center">
                            <label>Status: {this.state.status} </label>
                        </div>

                        <div className="flex items-center">
                            <label>Premium</label>

                            {this.state.premium === "True" ? (
                                <input
                                    id="premium"
                                    type="checkbox"
                                    defaultChecked
                                ></input>
                            ) : (
                                <input id="premium" type="checkbox"></input>
                            )}
                        </div>

                        <div>
                            <label>Slaýderde</label>
                            {this.state.on_slider === "True" ? (
                                <input
                                    id="on_slider"
                                    type="checkbox"
                                    defaultChecked
                                ></input>
                            ) : (
                                <input id="on_slider" type="checkbox"></input>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center border-b p-2">
                    <button
                        onClick={() => {
                            this.setState({ activeTab: "profile" });
                            localStorage.setItem("store-tab", "profile");
                        }}
                        className="mx-2 hover:text-sky-600 font-bold duration-200 drop-shadow-lg text-[14px]"
                    >
                        Profil
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ activeTab: "cars" });
                            localStorage.setItem("store-tab", "cars");
                        }}
                        className="mx-2 hover:text-sky-600 font-bold duration-200 drop-shadow-lg text-[14px]"
                    >
                        Awtoulaglar
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ activeTab: "videos" });
                            localStorage.setItem("store-tab", "videos");
                        }}
                        className="mx-2 hover:text-sky-600 font-bold duration-200 drop-shadow-lg text-[14px]"
                    >
                        Wideolar
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ activeTab: "posts" });
                            localStorage.setItem("store-tab", "posts");
                        }}
                        className="mx-2 hover:text-sky-600 font-bold duration-200 drop-shadow-lg text-[14px]"
                    >
                        Bildirişler
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ activeTab: "gallery" });
                            localStorage.setItem("store-tab", "gallery");
                        }}
                        className="mx-2 hover:text-sky-600 font-bold duration-200 drop-shadow-lg text-[14px]"
                    >
                        Galereýa
                    </button>
                </div>
                {this.state.activeTab === "videos" && this.VideosTab()}
                {this.state.activeTab === "posts" && this.ProductsTab()}
                {this.state.activeTab === "profile" && this.ProfileTab()}
                {this.state.activeTab === "gallery" && this.GalleryTab()}
                {this.state.activeTab === "cars" && this.Cars()}
                <div></div>
            </div>
        );
    }

    deleteVideo(id) {
        const r = window.confirm("Bozmaga ynamynyz barmy?");
        if (r === false) {
            return null;
        }

        axios
            .delete(server + "/api/admin/store_videos/" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Video deleted");
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    addVideo() {
        let fdata = new FormData();

        if (document.getElementById("thumbnail").files.length > 0) {
            fdata.append(
                "thumbnail",
                document.getElementById("thumbnail").files[0]
            );
        }

        fdata.append("store", this.state.id);
        fdata.append("video", document.getElementById("videoFile").files[0]);

        this.setState({ videoIsUploading: true });
        axios
            .post(server + "/api/admin/store_videos/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Video added");
                this.setState({ videoIsUploading: true });
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    VideoAddModal() {
        if (this.state.videoAddModalisOpen === false) {
            return null;
        }
        return (
            <div className="grid shadow-lg rounded-md p-2 mx-auto left-0 right-0 absolute z-10 bg-white max-w-[300px]">
                <img
                    src={this.state.thumbnail}
                    alt=""
                    id="preload"
                    className="h-[200px] w-full object-cover rounded-md border"
                ></img>
                <label>Video (MP4)</label>
                <input id="videoFile" type="file" accept="video/mp4"></input>

                <label>Thumbnail (JPG, PNG)</label>
                <input
                    accept="image/png, image/jpeg"
                    onChange={() => {
                        const file =
                            document.getElementById("thumbnail").files[0];
                        let objectUrl = URL.createObjectURL(file);
                        document.getElementById("preload").src = objectUrl;
                    }}
                    id="thumbnail"
                    type="file"
                ></input>

                <button
                    onClick={() => {
                        this.addVideo();
                    }}
                    className="bg-green-600 text-white text-[14px] p-2"
                >
                    Ýatda sakla
                </button>
                <button
                    onClick={() => {
                        this.setState({ videoAddModalisOpen: false });
                    }}
                    className="bg-slate-600 text-white text-[14px] p-2"
                >
                    Goý bolsun etmek
                </button>

                {this.state.videoIsUploading === true && (
                    <label>Downloading...</label>
                )}
            </div>
        );
    }

    getVideos() {
        axios
            .get(server + "/api/admin/store_videos?store=" + this.state.id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ videos: resp.data.data });
            });
    }

    videoPlayer() {
        if (this.state.videoPlayerIsOpen === false) {
            return null;
        }
        return (
            <div className="grid m-auto absolute p-2 rounded-md shadow-lg border z-10 left-0 right-0 w-max overflow-hidden bg-white">
                <video className="max-w-[400px] max-h-[400px]" controls>
                    <source
                        src={this.state.videoPlayerUrl}
                        type="video/mp4"
                    ></source>
                </video>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            this.setState({ videoPlayerIsOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    VideosTab() {
        return (
            <div className="grid">
                {this.videoPlayer()}
                <div className="flex items">
                    <button
                        onClick={() => {
                            this.setState({ videoAddModalisOpen: true });
                        }}
                        className="flex mx-2 items-center hover:text-sky-600"
                    >
                        <BiPlus></BiPlus>
                        <label>Goşmak</label>
                    </button>
                    <button className="flex mx-2 items-center hover:text-sky-600">
                        <MdSort></MdSort>
                        <label>Tertibi</label>
                    </button>
                </div>
                <div className="flex flex-wrap justify-center">
                    {this.state.videos.map((item) => {
                        return (
                            <div className="m-2 grid">
                                <div
                                    onClick={() => {
                                        this.setState({
                                            videoPlayerIsOpen: true,
                                            videoPlayerUrl: item.video,
                                        });
                                    }}
                                    className="relative w-[150px] h-[150px] bg-slate-200 rounded-lg  overflow-hidden flex items-center justify-center
                            text-slate-600 hover:bg-slate-300 duration-300 border"
                                >
                                    <img
                                        className="absolute w-full h-full z-0 object-cover"
                                        src={item.thumbnail}
                                        alt=""
                                    ></img>

                                    <MdPlayCircle
                                        className="z-1 text-white drop-shadow-sm hover:text-slate-400 duration-300"
                                        size={80}
                                    ></MdPlayCircle>
                                </div>
                                <div className="flex items-center">
                                    <IoMdTrash
                                        className="hover:text-slate-600"
                                        onClick={() => {
                                            this.deleteVideo(item.id);
                                        }}
                                        size={20}
                                    ></IoMdTrash>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    GalleryTab() {
        return (
            <div className="grid">
                <label>Surat {this.state.images.length}</label>
                <button
                    className="flex items-center w-max border rounded-md hover:bg-slate-200 m-1 p-1 text-[14px]"
                    onClick={() => {
                        document.getElementById("imgselector").click();
                    }}
                >
                    <BiPlus className="" size={35}></BiPlus>
                    <label>Goşmak</label>
                </button>
                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <div className="grid m-2">
                                <a href={server + item.img_m} target="_blank">
                                    <img
                                        alt=""
                                        className="object-cover w-[200px] h-[200px] rounded-lg border"
                                        defaultValue={"/default.png"}
                                        src={server + item.img_s}
                                    ></img>
                                </a>
                                <div className="flex w-full items-center">
                                    <AiFillDelete
                                        size={25}
                                        className="text-slate-600 hover:text-slate-700 mr-2"
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                    ></AiFillDelete>
                                    <AiFillCheckCircle
                                        className="text-slate-600 hover:text-slate-700 mr-2"
                                        size={25}
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                    ></AiFillCheckCircle>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="imageCard">
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
        );
    }

    getCars() {
        axios
            .get(server + "/api/admin/cars?store=" + this.state.id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ cars: resp.data.data });
            });
    }

    Cars() {
        return (
            <div className="grid">
                {/* <button
                    className="flex items-center w-max border rounded-md hover:bg-slate-200 m-1 p-1 text-[14px]"
                    onClick={() => {
                        document.getElementById("imgselector").click();
                    }}
                >
                    <BiPlus className="" size={35}></BiPlus>
                    <label>Goşmak</label>
                </button> */}
                <div className="flex  flex-wrap ">
                    {this.state.cars.map((item) => {
                        return (
                            <Link
                                to={"/admin/cars/" + item.id}
                                className="grid  overflow-hidden rounded-lg m-2 border text-[12px] w-[200px]"
                            >
                                <img
                                    alt=""
                                    className="object-cover w-full h-[150px]"
                                    defaultValue={"/default.png"}
                                    src={server + item.img.img_s}
                                ></img>
                                <div className=" grid p-1">
                                    <label>
                                        {item.mark} {item.model} {item.year}{" "}
                                    </label>
                                    <label>{item.price}</label>
                                    <label>{item.created_at}</label>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="imageCard">
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
        );
    }

    ProfileTab() {
        return (
            <div className="grid max-w-[400px] text-[14px]">
                {/* BUTTONS */}
                <div className="flex flex-wrap text-slate-600">
                    <button
                        onClick={() => {
                            this.changeStatus("accepted");
                        }}
                        className="accept "
                    >
                        <FcCheckmark
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></FcCheckmark>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("canceled");
                        }}
                        className="cancel"
                    >
                        <FcCancel
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></FcCancel>
                    </button>
                    <button
                        onClick={() => {
                            this.changeStatus("pending");
                        }}
                        className="onCheck"
                    >
                        <MdWarning
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdWarning>
                    </button>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                    >
                        <MdSave
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></MdSave>
                    </button>
                    <button
                        onClick={() => {
                            this.deleteStore();
                        }}
                    >
                        <IoMdTrash
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></IoMdTrash>
                    </button>

                    <button
                        onClick={() => {
                            this.moveUp();
                        }}
                    >
                        <FcUp
                            className="border rounded-md hover:bg-slate-200 m-1 p-2"
                            size={35}
                        ></FcUp>
                    </button>
                </div>
                <label>Ady</label>
                <input id="name" defaultValue={this.state.name}></input>

                <label>Ýerleşýän ýeri</label>
                <div className="location border rounded-[5px] p-[10px] my-[5px] flex items-center">
                    <BiMap
                        size={25}
                        className="hover:bg-slate-200 rounded-md p-[2px]"
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                    ></BiMap>
                    <label>{this.state.location_name}</label>
                    {this.state.location_name !== "" && (
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

                <label>Söwda merkezi</label>
                <select id="tradeCenter">
                    <option value={this.state.trade_center_id}>
                        {this.state.trade_center_name}
                    </option>
                    <option value={""}>(Saylanmadyk)</option>
                    {this.state.centers.map((item) => {
                        if (this.state.center === item.name) {
                            return (
                                <option selected value={item.id}>
                                    {item.name}
                                </option>
                            );
                        } else {
                            return <option value={item.id}>{item.name}</option>;
                        }
                    })}
                </select>

                <label>Kategoriýasy</label>

                <select id="category">
                    <option value={""}>(Saylanmadyk)</option>

                    {this.state.categories.map((item) => {
                        if (this.state.category === item.name_tm) {
                            return (
                                <option selected value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        } else {
                            return (
                                <option value={item.id}>{item.name_tm}</option>
                            );
                        }
                    })}
                </select>

                {this.state.locationSelectorOpen === true && (
                    <LocationSelector
                        parent={this}
                        open={this.state.locationSelectorOpen}
                    ></LocationSelector>
                )}

                <label>Goşmaça maglumat</label>
                <textarea
                    id="description"
                    defaultValue={this.state.description}
                ></textarea>

                <div className="grid">
                    <label>Kontakt</label>
                    <div className="flex items-center">
                        <input type="text" id="contact-value"></input>
                        <select id="contact-type">
                            <option value={"phone"}>CALL</option>
                            <option value={"imo"}>IMO</option>
                            <option value={"mail"}>MAIL</option>
                        </select>
                        <button
                            onClick={() => {
                                this.addContact();
                            }}
                            className="bg-slate-500 rounded-lg p-2 m-1 text-white hover:bg-slate-400"
                        >
                            Goşmak
                        </button>
                    </div>
                </div>
                <div className="grid">
                    {this.state.contacts.map((item) => {
                        return (
                            <div className="grid grid-cols-[auto_max-content] border rounded-md p-2 items-center">
                                <label>{item.value}</label>
                                <IoMdTrash
                                    onClick={() => {
                                        this.deletePhone(item);
                                    }}
                                    className="text-slate-600 hover:text-slate-700"
                                    size={25}
                                ></IoMdTrash>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    ProductsTab() {
        return (
            <div className="grid">
                <div className="flex items-center">
                    <button
                        className="flex items-center hover:text-sky-600"
                        onClick={() => {
                            this.setState({ add_product_open: true });
                        }}
                    >
                        <BiPlus className=" mr-1 " size={35}></BiPlus>
                        <label>Goşmak</label>
                    </button>

                    <button
                        className="flex items-center hover:text-sky-600"
                        onClick={() => {
                            this.setState({ add_product_open: true });
                        }}
                    >
                        <MdSort className=" mr-1 " size={35}></MdSort>
                        <label>Tertibi</label>
                    </button>
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setProductsPage(page);
                    }}
                    count={this.state.products_last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className=" bg-white p-2 overflow-y-auto text-[12px] flex flex-wrap justify-center">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/admin/products/"}
                                className="w-[200px] grid border m-2 rounded-lg "
                            >
                                <img
                                    className="w-full h-[200px] object-cover border"
                                    alt=""
                                    defaultValue={"/default.png"}
                                    src={server + item.img}
                                ></img>
                                <div className="grid px-2">
                                    <label className="font-bold">
                                        {item.name_tm}
                                    </label>
                                    <label>{item.price} TMT</label>
                                    {item.status === "accepted" && (
                                        <label>Kabul edilen</label>
                                    )}
                                    {item.status === "canceled" && (
                                        <label>Gaýtarlan</label>
                                    )}
                                    {item.status === "pending" && (
                                        <label>Garaşylýar</label>
                                    )}
                                    <div className="grid grid-cols-2 items-center text-slate-700">
                                        <button
                                            className="flex items-center px-2 hover:text-sky-700 font-bold m-1 hover:bg-slate-200 justify-center border rounded-lg"
                                            onClick={() => {
                                                this.deleteProduct(item.id);
                                            }}
                                        >
                                            <MdDelete size={20}></MdDelete>
                                        </button>
                                        <button className="flex items-center px-2 hover:text-sky-700 font-bold m-1 hover:bg-slate-200 justify-center border rounded-lg">
                                            <MdCheck size={20}></MdCheck>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    ProductAddForm() {
        if (this.state.add_product_open === false) {
            return null;
        }

        return (
            <div className="grid absolute mx-auto left-0 right-0 max-w-[500px] bg-white shadow-lg rounded-md p-2 border z-10">
                <h3>Täze bildiriş</h3>
                <div>
                    <input id="active" type="checkbox"></input>
                    <label>Aktiw</label>
                </div>

                <label>Ady</label>
                <input id="new_product_name" type="text"></input>

                <select id="category">
                    {this.state.product_ctgs.map((item) => {
                        return <option value={item.id}> {item.name_tm}</option>;
                    })}
                </select>
                <input
                    onChange={() => {
                        this.onSelectNewProductImages();
                    }}
                    id="productImgSelector"
                    multiple
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>
                <label>
                    Ýüklenen faýllaryň jemi göwrümi:{" "}
                    {this.state.uploadedTotalSize} KB
                </label>

                <div>
                    <button
                        className="text-[12px] bg-slate-600 text-white p-1 m-1"
                        onClick={() => {
                            this.saveProducts();
                        }}
                    >
                        Ýatda sakla
                    </button>
                    <button
                        className="text-[12px] bg-slate-600 text-white p-1 m-1"
                        onClick={() => {
                            this.setState({ add_product_open: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    onSelectNewProductImages() {
        var files = document.getElementById("productImgSelector").files;
        let totalSize = 0;

        for (let i = 0; i < files.length; i++) {
            totalSize = totalSize + Math.floor(files[i].size / 1024);
        }
        this.setState({ uploadedTotalSize: totalSize });
    }

    setData() {
        this.getVideos();
        this.getCars();

        axios
            .get(server + "/api/admin/products?store=" + this.state.id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ total_products: resp.data.total });
                this.setState({ products_last_page: resp.data.last_page });
            });

        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });

        axios.get(server + "/mob/index/store").then((resp) => {
            this.setState({
                categories: resp.data.categories,
                centers: resp.data.trade_centers,
            });
        });

        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({ product_ctgs: resp.data.categories });
        });

        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios
            .get(server + "/api/admin/products?store=" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ products: resp.data.data });
            });

        axios
            .get(server + "/api/admin/store_contacts?store=" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ contacts: resp.data.data });
            });

        axios
            .get(server + this.storesUrl + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({
                    name: resp.data.name,
                    images: resp.data.images,
                    status: resp.data.status,
                    phone: resp.data.phone,
                    img: resp.data.img,
                    created_at: resp.data.created_at,
                    category: resp.data.category,
                    center: resp.data.center,
                    id: resp.data.id,
                    on_slider: resp.data.on_slider,
                    premium: resp.data.premium,
                    description: resp.data.description,
                    state: resp.data.state,
                    isLoading: false,
                });

                if (resp.data.location != null) {
                    this.setState({
                        location_name: resp.data.location.name,
                        location_id: resp.data.location.id,
                    });
                }

                if (resp.data.category != null) {
                    this.setState({
                        category_name: resp.data.category.name,
                        category_id: resp.data.category.id,
                    });
                }

                if (resp.data["status"] === "pending") {
                    this.setState({ status: "Barlagda" });
                }
                if (resp.data["status"] === "accepted") {
                    this.setState({ status: "Kabul edilen" });
                }
                if (resp.data["status"] === "canceled") {
                    this.setState({ status: "Gaýtarlan" });
                }
            });
    }

    deletePhone(contact) {
        let result = window.confirm(
            contact.type + " " + contact.value + " - bozmaga ynamyňyz barmy"
        );
        if (result === true) {
            axios
                .delete(server + "/api/admin/customer_contacts/" + contact.id, {
                    auth: this.state.auth,
                })
                .then((resp) => {
                    this.setData();
                    toast.success("Kontact bozuldy");
                });
        }
    }

    addContact() {
        var formdata = new FormData();
        const type = document.getElementById("contact-type").value;
        const value = document.getElementById("contact-value").value;

        if (value !== "") {
            formdata.append("value", value);
            formdata.append("type", type);
            formdata.append("store", this.state.id);
        }

        axios
            .post(server + "/api/admin/store_contacts/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kontakt goshuldy");
            });
    }

    deleteStore() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(
                server + "/api/admin/stores/delete/" + this.state.id,
                {},
                { auth: this.state.auth }
            )
            .then((resp) => {
                window.history.back();
            });
    }

    changeStatus(statusValue) {
        var fdata = new FormData();
        this.setData({
            optionsOpen: !this.state.optionsOpen,
            isLoading: true,
        });

        fdata.append("status", statusValue);

        axios
            .put(server + "/api/admin/stores/" + this.state.id + "/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kabul edildi");
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

    addSelectedImages() {
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }
        this.setData({ isLoading: true });
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

    save() {
        var formdata = new FormData();
        if (this.state.location_id === "") {
            toast.error("Ýerleşýän ýerinini görkezmeli");
            return null;
        }

        formdata.append("name_tm", document.getElementById("name").value);
        formdata.append("name", document.getElementById("name").value);
        formdata.append(
            "description",
            document.getElementById("description").value
        );

        if (document.getElementById("premium").checked === true) {
            formdata.append("premium", "True");
        } else {
            formdata.append("premium", "False");
        }

        if (document.getElementById("on_slider").checked === true) {
            formdata.append("on_slider", "True");
        } else {
            formdata.append("on_slider", "False");
        }

        formdata.append("category", document.getElementById("category").value);
        formdata.append("center", document.getElementById("tradeCenter").value);
        formdata.append("location", this.state.location_id);

        axios
            .put(server + this.storesUrl + this.state.id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    removeSelectedImage(file) {
        var temp = this.state.selected_images;
        temp.splice(temp.indexOf(file), 1);
        this.setState({ selected_images: temp });
    }

    moveUp() {
        var formdata = new FormData();

        formdata.append("moveUp", "True");
        axios
            .put(
                server + "/mob/stores/" + this.state.id,
                formdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
                toast.success("Moved up");
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });

        this.setState({ isLoading: true });
    }

    saveProducts() {
        var formdata = new FormData();

        formdata.append("store", this.state.id);
        formdata.append("category", document.getElementById("category").value);

        formdata.append(
            "name_tm",
            document.getElementById("new_product_name").value
        );
        let images = document.getElementById("productImgSelector").files;
        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        if (document.getElementById("active").checked) {
            formdata.append("status", "accepted");
        } else {
            formdata.append("status", "pending");
        }

        axios
            .post(server + "/mob/products", formdata)
            .then((resp) => {
                this.setData();
                toast.success(images.length + " sany täze haryt goşuldy");
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });

        this.setState({ isLoading: true });
        this.setState({ add_product_open: false });
    }

    deleteProduct(id) {
        let result = window.confirm("Bozmaga ynamyňyz barmy");
        if (result === true) {
            axios
                .post(
                    server + "/mob/products/delete/" + id,
                    {},
                    { auth: this.state.auth }
                )
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
        }
    }

    setProductsPage(pageNumber) {
        axios
            .get(
                server +
                    "/api/admin/products?store=" +
                    this.state.id +
                    "&page=" +
                    pageNumber,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ products_last_page: resp.data.last_page });
            });
    }
}

export default AdminStoreDetail;
