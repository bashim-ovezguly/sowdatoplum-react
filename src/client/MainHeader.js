import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Products from "./products/Products";
import StoreProfile from "./stores/StoresProfile";
import {
    MdCall,
    MdHome,
    MdLogin,
    MdMail,
    MdPhone,
    MdReceipt,
    MdStore,
    MdSupport,
} from "react-icons/md";
import { BsArrowUp } from "react-icons/bs";
import Register from "./Register";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import axios from "axios";
import { server } from "../static";

import Stores from "./stores/Stores";
import ProductDetail from "./products/ProductDetail";
import Cars from "./cars/Cars";
import CarDetail from "./cars/CarDetail";
import StoreEdit from "./stores/StoreEdit";
import CarEdit from "./cars/CarEdit";
import Restore from "./Restore";
import NewPassword from "./NewPassword";
import ProductEdit from "./products/ProductEdit";
import AboutUs from "./AboutUs";
import Rules from "./Rules";
import { BiUserCircle } from "react-icons/bi";
import Lenta from "./aksiya/Aksiya";
import LentaDetail from "./aksiya/AksiyaDetail";
import AddProduct from "./add/AddProduct";
import AddCar from "./add/AddCar";
import MyProfile from "./profile/Profile";
import CategorySelector from "./categorySelector/CategorySelector";
import AddLenta from "./add/AddAksiya";
import LentaEdit from "./aksiya/AksiyaEdit";
import News from "./news/News";
import NewsDetail from "./news/NewsDetail";
import Videos from "./videos/Videos";
import VideoDetail from "./videos/VideoDetail";
import TradeCenters from "./tradeCenters/TradeCenters";
import TradeCenterDetail from "./tradeCenters/TradeCentersDetail";
import OrderDetail from "./profile/OrderDetail";
import WriteToUs from "./WriteToUs";
import Verification from "./Verification";
import { user_is_authenticated } from "../App";

class MainHeader extends React.Component {
    constructor(props) {
        super(props);

        this.notif_ref = React.createRef();
        this.spinner_ref = React.createRef();

        this.state = {
            phone: localStorage.getItem("user_phone"),
            name: localStorage.getItem("user_name"),
            postTypeSelectorShow: false,
        };

        this.setData();

        window.addEventListener("scroll", () => {
            if (window.scrollY < 500) {
                document.getElementById("goToTop").style.display = "none";
            } else {
                document.getElementById("goToTop").style.display = "block";
            }
        });
    }

    setData() {
        axios.get(server + "/mob/apk").then((resp) => {
            this.setState({ apk: resp.data["apk"], isLoading: false });
        });
    }

    checkLogin() {
        if (localStorage.getItem("user_id") === null) {
            const result = window.confirm(
                "Bildiriş goşmak üçin registrasiýa hökman!"
            );
            if (result === true) {
                window.location.href = "/login";
            }
        } else {
            window.location.href = "/add";
        }
    }

    openMenu() {
        localStorage.setItem("profileMenuOpen", true);
        document.getElementById("menu").style.left = "0px";
        console.log("menu open");
    }
    closeMenu() {
        localStorage.setItem("profileMenuOpen", false);
        document.getElementById("menu").style.left = "-80%";
    }

    render() {
        return (
            <div className="home grid max-w-[1400px] mx-auto">
                <div className=" text-appColor bg-slate-100 rounded-lg">
                    <div className="sm:p-0 flex items-center justify-between rounded-md border-appColor p-1">
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[70px] h-[70px] sm:w-[50px] sm:h-[50px] m-2"
                                alt=""
                                src="/logo.png"
                            ></img>
                            <div className="grid">
                                <label className="font-bold sm:text-[12px] text-[28px]">
                                    Söwda toplumy
                                </label>
                                <label className="text-[16px] font-bold sm:text-[10px]">
                                    Marketplace
                                </label>
                            </div>
                        </Link>

                        <div className="icons flex items-center ">
                            <a
                                href="tel: +99361324577"
                                className="grid items-center grid-cols-[max-content_max-content]  
                            w-max rounded-lg p-2 hover:bg-slate-200 duration-200"
                            >
                                <MdCall size={30}></MdCall>

                                <div className="grid sm:hidden">
                                    <label>Tehniki goldaw</label>
                                    <label>+99361324577</label>
                                </div>
                            </a>
                            {user_is_authenticated() == false && (
                                <Link
                                    className="flex rounded-md items-center p-2 h-max hover:bg-slate-200 duration-200"
                                    to={"/signup"}
                                >
                                    <MdStore
                                        size={30}
                                        className="mr-2"
                                    ></MdStore>
                                    <label className="text-[14px] sm:hidden ">
                                        Hasap açmak
                                    </label>
                                </Link>
                            )}

                            {!user_is_authenticated() && (
                                <Link
                                    className="flex items-center uration-200  rounded-md  p-2 h-max 
                                hover:bg-slate-200"
                                    to={"/login"}
                                >
                                    <MdLogin
                                        size={30}
                                        className="mr-2"
                                    ></MdLogin>
                                    <label className="text-[14px] sm:hidden ">
                                        Hasaba girmek
                                    </label>
                                </Link>
                            )}

                            {user_is_authenticated() && (
                                <Link
                                    className="flex rounded-md items-center p-[5px] m-[2px] h-max hover:bg-slate-200 duration-200"
                                    to={"/profile"}
                                >
                                    <BiUserCircle size={30}></BiUserCircle>
                                    <label className="text-[14px] sm:hidden font-bold">
                                        {this.state.name}
                                    </label>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className=" flex font-bold mx-auto text-[15px]  text-appColor w-full z-10 
                        top-0 whitespace-nowrap sticky overflow-x-auto bg-white backdrop-blur-md"
                >
                    <Link to="/">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200 flex items-center">
                            <MdHome size={20}></MdHome>
                            Baş sahypa
                        </button>
                    </Link>
                    <Link to="/stores">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Dükanlar
                        </button>
                    </Link>
                    <Link to="/news">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Täzelikler
                        </button>
                    </Link>

                    <Link to="/products">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Harytlar
                        </button>
                    </Link>
                    <Link to="/lenta">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Aksiýalar
                        </button>
                    </Link>
                    <Link to="/cars">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Awtoulaglar
                        </button>
                    </Link>

                    <Link to="/trade_centers">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Söwda merkezler
                        </button>
                    </Link>

                    <Link to="/videos">
                        <button className="p-1 hover:text-slate-400 m-1 duration-200">
                            Wideolar
                        </button>
                    </Link>
                </div>

                <div className="content mx-auto max-w-[1400px] w-full min-h-[600px]">
                    <Routes>
                        <Route path="/" element={<HomePage></HomePage>} />

                        <Route
                            path="/login"
                            element={<LoginPage></LoginPage>}
                        />

                        <Route path="/about_us" element={<AboutUs></AboutUs>} />
                        <Route path="/rules" element={<Rules></Rules>} />
                        <Route
                            path="/products"
                            element={<Products></Products>}
                        />
                        <Route path="/cars" element={<Cars></Cars>} />
                        <Route
                            path="/cars/:id"
                            element={<CarDetail></CarDetail>}
                        />
                        <Route
                            path="/cars/edit/:id"
                            element={<CarEdit></CarEdit>}
                        />
                        <Route
                            path="/profile/*"
                            element={<MyProfile></MyProfile>}
                        />
                        <Route
                            path="/stores/edit/*"
                            element={<StoreEdit></StoreEdit>}
                        />
                        <Route path="/stores" element={<Stores></Stores>} />
                        <Route
                            path="/stores/:id/*"
                            element={<StoreProfile></StoreProfile>}
                        />
                        <Route
                            path="/send_code"
                            element={<Restore></Restore>}
                        />
                        <Route path="/signup" element={<Register></Register>} />
                        <Route
                            path="/verification"
                            element={<Verification></Verification>}
                        />
                        <Route
                            path="/products/*"
                            element={<ProductDetail></ProductDetail>}
                        />
                        <Route
                            path="/products/edit/*"
                            element={<ProductEdit></ProductEdit>}
                        />
                        <Route
                            path="/restore/password"
                            element={<NewPassword></NewPassword>}
                        />

                        <Route path="/lenta" element={<Lenta></Lenta>} />
                        <Route
                            path="/lenta/:id"
                            element={<LentaDetail></LentaDetail>}
                        />
                        <Route
                            path="/lenta/edit/:id"
                            element={<LentaEdit></LentaEdit>}
                        />

                        <Route
                            path="/products/add"
                            element={<AddProduct></AddProduct>}
                        />
                        <Route path="/cars/add" element={<AddCar></AddCar>} />
                        <Route
                            path="/lenta/add"
                            element={<AddLenta></AddLenta>}
                        />

                        <Route
                            path="/trade_centers"
                            element={<TradeCenters></TradeCenters>}
                        />

                        <Route
                            path="/trade_centers/*"
                            element={<TradeCenterDetail></TradeCenterDetail>}
                        />

                        <Route
                            path="/add"
                            element={<CategorySelector></CategorySelector>}
                        />

                        <Route path="/news" element={<News></News>} />
                        <Route
                            path="/news/*"
                            element={<NewsDetail></NewsDetail>}
                        />

                        <Route path="/videos" element={<Videos></Videos>} />
                        <Route
                            path="/videos/*"
                            element={<VideoDetail></VideoDetail>}
                        />

                        <Route
                            path="/orders/:id"
                            element={<OrderDetail></OrderDetail>}
                        />
                    </Routes>
                </div>

                <div className="flex flex-wrap justify-center bg-slate-200 rounded-md my-2 text-appColor p-1">
                    <div className="max-w-[1400px] flex flex-wrap justify-between w-full">
                        {/* LINKS */}
                        <div className="grid m-2 h-max font-bold">
                            <Link
                                className="hover:bg-slate-100/10 rounded-md p-2"
                                to="/about_us"
                            >
                                Saýt barada
                            </Link>

                            <Link
                                className="hover:bg-slate-100/10 rounded-md p-2"
                                to="rules"
                            >
                                Düzgünler
                            </Link>
                            <Link
                                className="hover:bg-slate-100/10 rounded-md p-2"
                                to="products"
                            >
                                Harytlar
                            </Link>
                            <Link
                                className="hover:bg-slate-100/10 rounded-md p-2"
                                to="cars"
                            >
                                Awtoulaglar
                            </Link>
                            <Link
                                className="hover:bg-slate-100/10 rounded-md p-2"
                                to="cars"
                            >
                                Söwda merkezler
                            </Link>
                        </div>
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[120px] h-[120px] m-2  border overflow-hidden rounded-full"
                                alt=""
                                src="/logo.png"
                            ></img>
                            <div className="grid">
                                <label className="font-bold sm:text-[16px] text-[22px] line-clamp-1">
                                    Söwda toplumy
                                </label>
                                <label className="text-[18px] line-clamp-1">
                                    Marketplace
                                </label>
                            </div>
                        </Link>

                        <div className="m-2 grid h-max">
                            <div className="">
                                <label>Habarlaşmak üçin</label>
                            </div>
                            <div className="items">
                                <div className="flex items-center">
                                    <MdMail
                                        className="mr-2 my-2"
                                        size={20}
                                    ></MdMail>
                                    <label> sowdatoplum@mail.ru</label>
                                </div>
                                <a
                                    href="tel: +993 61 324577"
                                    className="flex items-center"
                                >
                                    <MdPhone
                                        size={20}
                                        className="mr-2 my-2"
                                    ></MdPhone>
                                    <label>+993 61 324577</label>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    ref="goToTop"
                    id="goToTop"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="fixed right-[10px] bottom-[10px] bg-appColor p-[10px] text-white shadow-md hidden rounded-lg"
                >
                    <BsArrowUp size={25}></BsArrowUp>
                </button>
            </div>
        );
    }
}

export default MainHeader;
