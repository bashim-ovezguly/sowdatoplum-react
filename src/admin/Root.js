import axios from "axios";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { server } from "../static";
import AdminCars from "./cars/Cars";
import AdminCarDetail from "./cars/CarEdit";
import AdminProductDetail from "./products/ProductEdit";
import AdminStoreDetail from "./stores/AdminStoreDetail";
import Locations from "./Locations";
import Stores from "./stores/AdminStores";
import Ads from "./sliders/Sliders";
import { MdAndroid, MdClose, MdEdit } from "react-icons/md";
import Visitors from "./Visitors";
import TradeCenters from "./tradeCenters/TradeCenters";
import TradeCentersDetail from "./tradeCenters/TradeCentersDetail";
import Stat from "./Stat";
import Orders from "./Orders";
import StoreCategories from "./stores/StoreCategories";
import {
    BiBookBookmark,
    BiBox,
    BiCar,
    BiCategory,
    BiLogOut,
    BiMap,
    BiMenu,
    BiNews,
    BiPhone,
    BiShoppingBag,
    BiStats,
    BiStore,
    BiSupport,
} from "react-icons/bi";
import LentaAdmin from "./lenta/LentaAdmin";
import AppVersions from "./AppVersions";
import Devices from "./Devices";
import DeviceChat from "./DeviceChat";
import Notifications from "./Notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPeople } from "react-icons/bs";
import { RiAdvertisementFill } from "react-icons/ri";
import AdminNews from "./news/News";
import AdminNewsDetail from "./news/NewsDetail";
import MailsToAdmin from "./MailsToAdmin";
import Log from "./Log";
import SliderDetail from "./sliders/SliderDetail";
import AdminProducts from "./products/Products";

export const storesUrl = server + "/api/adm/stores";

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            car: null,
            user: [],
            menuOpen: false,

            profilEditOpen: false,
            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Dolandyryş";
    }

    logout() {
        localStorage.removeItem("admin_username");
        localStorage.removeItem("admin_password");
        window.location.href = "/superuser/login";
    }

    saveProfil() {
        var formdata = new FormData();

        this.setState({ isLoading: true });
        this.setState({ profilEditOpen: false });

        formdata.append("username", document.getElementById("username").value);
        formdata.append(
            "password",
            document.getElementById("new_password").value
        );
        formdata.append(
            "first_name",
            document.getElementById("first_name").value
        );
        formdata.append("is_active", true);

        let new_password = document.getElementById("new_password").value;

        let user_id = localStorage.getItem("admin_id");
        axios
            .put(
                server + "/api/superuser/users/" + user_id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                localStorage.setItem("admin_password", new_password);
                toast.success("Ustunlikli yatda saklandy");
            })
            .catch((err) => {
                alert(err);
            });
    }

    profil_edit_modal() {
        if (this.state.profilEditOpen === false) {
            return null;
        }

        return (
            <div
                className="absolute max-w-[300px] text-[13px] text-slate-600 p-5 border z-20
            rounded-lg shadow-lg left-0 right-0 m-auto bg-white"
            >
                <div className="grid">
                    <div className="flex justify-between items-center border-b p-2">
                        <label className="text-[20px] font-bold">Düzediş</label>
                        <MdClose
                            onClick={() => {
                                this.setState({ profilEditOpen: false });
                            }}
                            className="rounded-full bg-slate-100"
                            size={25}
                        ></MdClose>
                    </div>

                    <label>Username</label>
                    <input
                        id="username"
                        defaultValue={localStorage.getItem("admin_username")}
                    ></input>

                    <label>Parol</label>
                    <input
                        id="new_password"
                        type="password"
                        defaultValue={localStorage.getItem("admin_password")}
                    ></input>

                    <label>Ady</label>
                    <input
                        id="first_name"
                        defaultValue={localStorage.getItem("admin_first_name")}
                    ></input>

                    <div>
                        <button
                            className="bg-sky-700  w-full text-white p-1 hover:bg-sky-600 duration-300"
                            onClick={() => {
                                this.saveProfil();
                            }}
                        >
                            Ýatda saklamak
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (
            localStorage.getItem("admin_username") == undefined ||
            localStorage.getItem("admin_username") == null
        ) {
            window.location.href = "/superuser/login";
        }

        if (localStorage.getItem("menuOpen") === "true") {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        this.setState({ menuOpen: true });
        document.getElementById("menu").style.width = "250px";
        localStorage.setItem("menuOpen", true);
    }
    closeMenu() {
        this.setState({ menuOpen: false });
        document.getElementById("menu").style.width = "0px";
        localStorage.setItem("menuOpen", false);
    }

    menuClick() {
        if (this.state.menuOpen === true) {
            this.setState({ menuOpen: false }, () => {});
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    render() {
        return (
            <div className="admin h-full overflow-y-auto grid grid-rows-[max-content_auto] ">
                <div className="hidden">
                    <ToastContainer
                        className="hidden"
                        autoClose={3000}
                        closeOnClick={true}
                    ></ToastContainer>
                </div>

                {/* header */}
                <div
                    className="bg-white grid sticky top-0 shadow-lg
                        grid-cols-[max-content_auto_max-content] items-center text p-1"
                >
                    <BiMenu
                        className="hover:text-slate-400"
                        size={40}
                        onClick={() => {
                            this.menuClick();
                        }}
                    ></BiMenu>
                    <div className="grid text-[12px]">
                        <label>ADMIN PAGE</label>
                        <label className="">
                            {localStorage.getItem("admin_username")}
                        </label>
                    </div>

                    <div className="flex justify-self-end ">
                        <MdEdit
                            size={25}
                            onClick={() => {
                                this.setState({ profilEditOpen: true });
                            }}
                            className="hover:bg-slate-400  rounded-md m-[5px]"
                        ></MdEdit>
                        <BiLogOut
                            size={25}
                            className="hover:bg-slate-400  rounded-md m-[5px]"
                            onClick={() => {
                                this.logout();
                            }}
                        ></BiLogOut>
                    </div>
                </div>

                <div className="grid grid-cols-[max-content_auto] h-full overflow-y-auto">
                    {/* MENU */}
                    <div
                        id="menu"
                        className="grid bg-slate-600 text-white h-full scrollbar-none py-2
                        overflow-y-auto shadow-lg duration-500  overflow-hidden text-[14px] "
                    >
                        <div className="grid h-max">
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/stores"
                            >
                                <BiStore size={20} className="mr-2"></BiStore>
                                Akkauntlar
                            </Link>

                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/news"
                            >
                                <BiNews size={20} className="mr-2"></BiNews>
                                Habarlar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/cars"
                            >
                                <BiCar size={20} className="mr-2"></BiCar>
                                Awtoulaglar
                            </Link>

                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/products"
                            >
                                <BiBox size={20} className="mr-2"></BiBox>
                                Harytlar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/orders"
                            >
                                <BiShoppingBag
                                    size={20}
                                    className="mr-2"
                                ></BiShoppingBag>
                                Sargytlar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/trade_centers"
                            >
                                <BiStore size={20} className="mr-2"></BiStore>
                                Söwda merkezler
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/advs"
                            >
                                <RiAdvertisementFill
                                    size={20}
                                    className="mr-2"
                                ></RiAdvertisementFill>
                                Slaýderler
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/locations"
                            >
                                <BiMap size={20} className="mr-2"></BiMap>
                                Ýerleşýän ýerler
                            </Link>

                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/visitors"
                            >
                                <BsPeople size={20} className="mr-2"></BsPeople>
                                Myhmanlar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/stat"
                            >
                                <BiStats size={20} className="mr-2"></BiStats>
                                Statistika
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/store_categories"
                            >
                                <BiCategory
                                    size={20}
                                    className="mr-2"
                                ></BiCategory>
                                Dükan Kategoriýalar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/store_categories"
                            >
                                <BiCategory
                                    size={20}
                                    className="mr-2"
                                ></BiCategory>
                                Haryt kategoriýalar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/lenta"
                            >
                                <BiBookBookmark
                                    size={20}
                                    className="mr-2"
                                ></BiBookBookmark>
                                Aksiýalar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/app/versions"
                            >
                                <MdAndroid
                                    size={20}
                                    className="mr-2"
                                ></MdAndroid>
                                Android wersiýalar
                            </Link>
                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/devices"
                            >
                                <BiPhone size={20} className="mr-2"></BiPhone>
                                Enjamlar
                            </Link>

                            <Link
                                className="flex items-center hover:bg-slate-50/20 duration-200 px-3 p-1"
                                to="/superuser/mails"
                            >
                                <BiSupport
                                    size={20}
                                    className="mr-2"
                                ></BiSupport>
                                Admine hatlar
                            </Link>
                        </div>
                    </div>

                    <div className="content p-2 overflow-y-auto">
                        {this.profil_edit_modal()}

                        <Routes>
                            <Route
                                path="/locations/"
                                element={<Locations></Locations>}
                            />
                            <Route path="/stores" element={<Stores></Stores>} />
                            <Route
                                path="/products"
                                element={<AdminProducts></AdminProducts>}
                            />
                            <Route
                                path="/products/*"
                                element={
                                    <AdminProductDetail></AdminProductDetail>
                                }
                            />
                            <Route
                                path="/stores/:id/*"
                                element={<AdminStoreDetail></AdminStoreDetail>}
                            />
                            <Route
                                path="/cars"
                                element={<AdminCars></AdminCars>}
                            />
                            <Route
                                path="/cars/*"
                                element={<AdminCarDetail></AdminCarDetail>}
                            />
                            <Route path="/advs/" element={<Ads></Ads>} />
                            <Route
                                path="/advs/*"
                                element={<SliderDetail></SliderDetail>}
                            />

                            <Route
                                path="/visitors"
                                element={<Visitors></Visitors>}
                            />
                            <Route path="/stat" element={<Stat></Stat>} />
                            <Route path="/orders" element={<Orders></Orders>} />
                            <Route
                                path="/trade_centers"
                                element={<TradeCenters></TradeCenters>}
                            />
                            <Route
                                path="/trade_centers/*"
                                element={
                                    <TradeCentersDetail></TradeCentersDetail>
                                }
                            />

                            <Route
                                path="/store_categories"
                                element={<StoreCategories></StoreCategories>}
                            />
                            <Route
                                path="/lenta"
                                element={<LentaAdmin></LentaAdmin>}
                            />

                            <Route
                                path="/devices"
                                element={<Devices></Devices>}
                            />
                            <Route
                                path="/devices/*"
                                element={<DeviceChat></DeviceChat>}
                            />
                            <Route
                                path="/app/versions"
                                element={<AppVersions></AppVersions>}
                            />
                            <Route
                                path="/notifications"
                                element={<Notifications></Notifications>}
                            />
                            <Route
                                path="/news"
                                element={<AdminNews></AdminNews>}
                            />
                            <Route
                                path="/news/*"
                                element={<AdminNewsDetail></AdminNewsDetail>}
                            />

                            <Route
                                path="/mails/*"
                                element={<MailsToAdmin></MailsToAdmin>}
                            />

                            <Route path="/logs" element={<Log></Log>} />
                            <Route path="" element={<Stores></Stores>} />
                        </Routes>
                    </div>
                </div>
            </div>
        );
    }
}

export default Root;
