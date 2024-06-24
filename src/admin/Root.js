import axios from "axios";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { server } from "../static";
import "./admin.css";
import AdminCars from "./cars/Cars";
import AdminCarDetail from "./cars/CarEdit";
import AdminProductDetail from "./products/ProductEdit";
import AdminStoreDetail from "./stores/StoreDetail";
import Locations from "./Locations";
import Stores from "./stores/Stores";
import Products from "./products/Products";
import Ads from "./banners/Advs";
import AdvsDetail from "./banners/AdvDetail";
import Customers from "./customers/Customers";
import Admins from "./Admins";
import CustomersEdit from "./customers/CustomersEdit";
import AdminDetail from "./AdminDetail";
import {
    MdAdminPanelSettings,
    MdAndroid,
    MdClose,
    MdEdit,
} from "react-icons/md";
import Visitors from "./Visitors";
import TradeCenters from "./tradeCenters/TradeCenters";
import TradeCentersDetail from "./tradeCenters/TradeCentersDetail";
import Stat from "./Stat";
import Orders from "./Orders";
import Flats from "./flats/Flats";
import FlatDetail from "./flats/FlatDetail";
import StoreCategories from "./StoreCategories";
import {
    BiBookBookmark,
    BiBox,
    BiCar,
    BiCategory,
    BiHome,
    BiLogOut,
    BiMap,
    BiMenu,
    BiNews,
    BiNotification,
    BiPhone,
    BiShoppingBag,
    BiStats,
    BiStore,
    BiSupport,
} from "react-icons/bi";
import LentaAdmin from "./lenta/LentaAdmin";
import AdminCarParts from "./parts/Parts";
import AdminCarPartDetail from "./parts/PartDetail";
import AppVersions from "./AppVersions";
import Devices from "./Devices";
import DeviceChat from "./DeviceChat";
import Notifications from "./Notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPeople, BsPerson, BsTools } from "react-icons/bs";
import { RiAdvertisementFill } from "react-icons/ri";
import AdminNews from "./news/News";
import AdminNewsDetail from "./news/NewsDetail";
import MailsToAdmin from "./MailsToAdmin";

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
        localStorage.clear();
        window.location.href = "/admin/login";
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
                server + "/api/admin/users/" + user_id + "/",
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
        if (localStorage.getItem("menuOpen") === "true") {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        this.setState({ menuOpen: true });
        document.getElementById("menu").style.left = "0px";
        document.getElementById("menu").style.padding = "10px";
        localStorage.setItem("menuOpen", true);
    }
    closeMenu() {
        this.setState({ menuOpen: false });
        document.getElementById("menu").style.left = "-200%";
        document.getElementById("menu").style.padding = "0px";
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
            <div className="admin">
                <div
                    className="bg-slate-700 text-white grid sticky top-0
                        grid-cols-[max-content_auto_max-content] items-center text p-1 z-100"
                >
                    <BiMenu
                        className="hover:text-slate-600"
                        size={40}
                        onClick={() => {
                            this.menuClick();
                        }}
                    ></BiMenu>
                    <div className="grid text-[12px]">
                        <label>AdminPage</label>
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

                {/* MENU */}
                <div
                    id="menu"
                    onClick={() => {
                        this.closeMenu();
                    }}
                    className="grid z-100 bg-slate-700 text-white max-h-[90%] scrollbar-none
                        overflow-y-auto fixed shadow-lg duration-200  overflow-hidden"
                >
                    <div className="grid h-max">
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/stores"
                        >
                            <BiStore size={20} className="mr-2"></BiStore>
                            Stores
                        </Link>

                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/news"
                        >
                            <BiNews size={20} className="mr-2"></BiNews>
                            News
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/cars"
                        >
                            <BiCar size={20} className="mr-2"></BiCar>
                            Cars
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/parts"
                        >
                            <BsTools size={20} className="mr-2"></BsTools>
                            Auto-Parts
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/flats"
                        >
                            <BiHome size={20} className="mr-2"></BiHome>
                            Gozgalmaýan emläkler
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/products"
                        >
                            <BiBox size={20} className="mr-2"></BiBox>
                            Products
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/orders"
                        >
                            <BiShoppingBag
                                size={20}
                                className="mr-2"
                            ></BiShoppingBag>
                            Sargytlar
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/trade_centers"
                        >
                            <BiStore size={20} className="mr-2"></BiStore>
                            Trade Centers
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/advs"
                        >
                            <RiAdvertisementFill
                                size={20}
                                className="mr-2"
                            ></RiAdvertisementFill>
                            Bannerler
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/locations"
                        >
                            <BiMap size={20} className="mr-2"></BiMap>
                            Locations
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/admins"
                        >
                            <MdAdminPanelSettings
                                size={20}
                                className="mr-2"
                            ></MdAdminPanelSettings>
                            Admins
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/customers"
                        >
                            <BsPerson size={20} className="mr-2"></BsPerson>
                            Customers
                        </Link>

                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/visitors"
                        >
                            <BsPeople size={20} className="mr-2"></BsPeople>
                            Visitors
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/stat"
                        >
                            <BiStats size={20} className="mr-2"></BiStats>
                            Statistics
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/store_categories"
                        >
                            <BiCategory size={20} className="mr-2"></BiCategory>
                            Store Categories
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/store_categories"
                        >
                            <BiCategory size={20} className="mr-2"></BiCategory>
                            Product Categories
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/lenta"
                        >
                            <BiBookBookmark
                                size={20}
                                className="mr-2"
                            ></BiBookBookmark>
                            Lenta
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/app/versions"
                        >
                            <MdAndroid size={20} className="mr-2"></MdAndroid>
                            App Versions
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/devices"
                        >
                            <BiPhone size={20} className="mr-2"></BiPhone>
                            Devices
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/notifications"
                        >
                            <BiNotification
                                size={20}
                                className="mr-2"
                            ></BiNotification>
                            Notifications
                        </Link>
                        <Link
                            className="hover:text-slate-400 flex items-center hover:bg-slate-50/20 duration-200 p-2 rounded-md"
                            to="/admin/mails"
                        >
                            <BiSupport size={20} className="mr-2"></BiSupport>
                            Mail to Admin
                        </Link>
                    </div>
                </div>

                <div className="content">
                    {this.profil_edit_modal()}

                    <Routes>
                        <Route
                            path="/locations/"
                            element={<Locations></Locations>}
                        />
                        <Route path="/stores" element={<Stores></Stores>} />
                        <Route
                            path="/products"
                            element={<Products></Products>}
                        />
                        <Route
                            path="/products/*"
                            element={<AdminProductDetail></AdminProductDetail>}
                        />
                        <Route
                            path="/stores/*"
                            element={<AdminStoreDetail></AdminStoreDetail>}
                        />
                        <Route path="/cars" element={<AdminCars></AdminCars>} />
                        <Route
                            path="/cars/*"
                            element={<AdminCarDetail></AdminCarDetail>}
                        />
                        <Route path="/advs/" element={<Ads></Ads>} />
                        <Route
                            path="/advs/*"
                            element={<AdvsDetail></AdvsDetail>}
                        />
                        <Route
                            path="/customers"
                            element={<Customers></Customers>}
                        />
                        <Route path="/admins" element={<Admins></Admins>} />
                        <Route
                            path="/admins/*"
                            element={<AdminDetail></AdminDetail>}
                        />
                        <Route
                            path="/customers/*"
                            element={<CustomersEdit></CustomersEdit>}
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
                            element={<TradeCentersDetail></TradeCentersDetail>}
                        />
                        <Route path="/flats" element={<Flats></Flats>} />
                        <Route
                            path="/flats/*"
                            element={<FlatDetail></FlatDetail>}
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
                            path="/parts"
                            element={<AdminCarParts></AdminCarParts>}
                        />
                        <Route
                            path="/parts/*"
                            element={<AdminCarPartDetail></AdminCarPartDetail>}
                        />
                        <Route path="/devices" element={<Devices></Devices>} />
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
                        <Route path="/news" element={<AdminNews></AdminNews>} />
                        <Route
                            path="/news/*"
                            element={<AdminNewsDetail></AdminNewsDetail>}
                        />

                        <Route
                            path="/mails/*"
                            element={<MailsToAdmin></MailsToAdmin>}
                        />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default Root;
