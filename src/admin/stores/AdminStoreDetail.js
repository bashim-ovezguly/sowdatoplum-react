import axios from "axios";
import React from "react";
import { adminStoresUrl, server } from "../../static";
import { BiArrowBack } from "react-icons/bi";
import { MdTimer } from "react-icons/md";
import { Link, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toggle/style.css"; // for ES6 modules
import AdminStoreProducts from "./AdminStoreProducts";
import AdminStoreProfile from "./AdminStoreProfile";
import AdminStoreCars from "./AdminStoreCars";
import AdminStoreImages from "./AdminStoreImages";
import AdminStoreVideos from "./AdminStoreVideos";
import { CircularProgress } from "@mui/material";

class AdminStoreDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videoAddModalisOpen: false,
            isLoading: true,
            id: window.location.pathname.split("/")[3],
            status: "",
            category: "",
            name: "",
            phone: "",
            logo: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            phones: [],
            allLocations: [],
            contacts: [],
            centers: [],
            add_product_open: false,
            locationSelectorOpen: false,
            locationSelectorLoading: true,
            productsModalOpen: false,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },

            uploadedVideoUrl: "",
        };

        document.title = this.state.name;
        this.setData();
    }

    setLogo() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        formdata.append("logo", document.getElementById("logoInput").files[0]);
        axios
            .put(adminStoresUrl + this.state.id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((res) => {
                this.setState({ isLoading: false });
                toast.success("Logo tazelendi");
            })
            .catch((e) => {
                this.setState({ isLoading: false });
                toast.error("Error");
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center">
                    <CircularProgress></CircularProgress>
                </div>
            );
        }
        return (
            <div className="grid p-1">
                <input
                    onChange={() => {
                        this.setLogo();
                    }}
                    alt=""
                    id="logoInput"
                    hidden
                    type="file"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                ></input>

                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                ></ToastContainer>

                <div className="flex my-2">
                    <div
                        className="grid mx-2 my-auto"
                        onClick={() => {
                            document.getElementById("logoInput").click();
                        }}
                    >
                        <img
                            alt=""
                            className="w-[80px] h-[80px] object-cover rounded-full border overflow-hidden "
                            src={server + this.state.img}
                        ></img>
                    </div>
                    <div className="h-max grid my-auto">
                        <h2 className="text-[18px] font-bold">
                            {this.state.name}
                        </h2>
                        <div className="flex items-center">
                            <MdTimer></MdTimer>
                            <label>{this.state.created_at}</label>
                        </div>
                        {this.state.status == "accepted" && (
                            <label className="text-green-600 rounded-full w-max py-2 ">
                                Kabul edilen
                            </label>
                        )}
                        {this.state.status == "pending" && (
                            <label className="text-orange-600 rounded-full w-max py-2 ">
                                Private
                            </label>
                        )}
                    </div>
                </div>
                <div className="flex overflow-x-auto whitespace-nowrap py-2 items-center border-b">
                    <Link
                        to={"profile"}
                        onClick={() => {
                            this.setState({ activeTab: "profile" });
                            localStorage.setItem("store-tab", "profile");
                        }}
                        className="hover:bg-slate-300 mr-1 rounded-md px-2 py-1 font-bold bg-slate-200 duration-200 text-[12px]"
                    >
                        Profil
                    </Link>

                    <Link
                        to={"cars"}
                        onClick={() => {
                            this.setState({ activeTab: "cars" });
                            localStorage.setItem("store-tab", "cars");
                        }}
                        className="hover:bg-slate-300 mr-1 rounded-md px-2 py-1 font-bold bg-slate-200 duration-200 text-[12px]"
                    >
                        Awtoulaglar
                    </Link>
                    <Link
                        to={"videos"}
                        onClick={() => {
                            this.setState({ activeTab: "videos" });
                            localStorage.setItem("store-tab", "videos");
                        }}
                        className="hover:bg-slate-300 mr-1 rounded-md px-2 py-1 font-bold bg-slate-200 duration-200 text-[12px]"
                    >
                        Wideolar
                    </Link>
                    <Link
                        to={"products"}
                        onClick={() => {
                            this.setState({ activeTab: "posts" });
                            localStorage.setItem("store-tab", "posts");
                        }}
                        className="hover:bg-slate-300 mr-1 rounded-md px-2 py-1 font-bold bg-slate-200 duration-200 text-[12px]"
                    >
                        Harytlar
                    </Link>
                    <Link
                        to={"images"}
                        onClick={() => {
                            this.setState({ activeTab: "gallery" });
                            localStorage.setItem("store-tab", "gallery");
                        }}
                        className="hover:bg-slate-300 mr-1 rounded-md px-2 py-1 font-bold bg-slate-200 duration-200 text-[12px]"
                    >
                        Galereýa
                    </Link>
                </div>
                <Routes>
                    <Route
                        path="profile"
                        element={
                            <AdminStoreProfile
                                data={this.state.data}
                            ></AdminStoreProfile>
                        }
                    ></Route>
                    <Route
                        path="images"
                        element={
                            <AdminStoreImages
                                images={this.state.images}
                            ></AdminStoreImages>
                        }
                    ></Route>
                    <Route
                        path="products"
                        element={<AdminStoreProducts></AdminStoreProducts>}
                    ></Route>
                    <Route
                        path="cars"
                        element={<AdminStoreCars></AdminStoreCars>}
                    ></Route>
                    <Route
                        path="videos"
                        element={<AdminStoreVideos></AdminStoreVideos>}
                    ></Route>
                </Routes>
            </div>
        );
    }

    setData() {
        const pathname = window.location.pathname;
        var id = pathname.split("/")[3];

        axios
            .get(adminStoresUrl + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({
                    data: resp.data,
                    name: resp.data.name,
                    logo: resp.data.logo,
                    images: resp.data.images,
                    status: resp.data.status,
                    phone: resp.data.phone,
                    img: resp.data.logo,
                    created_at: resp.data.created_at,
                    category_name: resp.data.category.name,
                    category_id: resp.data.category.id,
                    email: resp.data.email,
                    center: resp.data.center,
                    id: resp.data.id,
                    on_slider: resp.data.on_slider,
                    premium: resp.data.premium,
                    description: resp.data.description,
                    state: resp.data.state,
                    type: resp.data.type,
                    isLoading: false,
                });

                if (resp.data.location != null) {
                    this.setState({
                        location_name: resp.data.location.name,
                        location_id: resp.data.location.id,
                    });
                }
            });
    }
}

export default AdminStoreDetail;
