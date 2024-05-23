import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./main.css";
import Products from "./products/Products";
import StoreProfile from "./stores/StoresProfile";
import { MdLanguage, MdMail, MdPhone } from "react-icons/md";
import { BsArrowUp } from "react-icons/bs";
import Register from "./registration/Register";
import HomePage from "./home/HomePage";
import LoginPage from "./loginPage/LoginPage";
import axios from "axios";
import { server } from "../static";
import Verification from "./verification/Verification";
import Stores from "./stores/Stores";
import ProductDetail from "./products/ProductDetail";
import Cars from "./cars/Cars";
import CarDetail from "./cars/CarDetail";
import StoreEdit from "./stores/StoreEdit";
import CarEdit from "./cars/CarEdit";
import SendCode from "./SendCode";
import RestorePassword from "./passwordRestore/RestorePassword";
import Pharmacies from "./Pharmacies";
import ProductEdit from "./products/ProductEdit";
import AboutUs from "./AboutUs";
import Rules from "./Rules";
import { BiPlusCircle, BiUserCircle } from "react-icons/bi";
import Lenta from "./lenta/Lenta";
import LentaDetail from "./lenta/LentaDetail";
import AddProduct from "./add/AddProduct";
import AddCar from "./add/AddCar";
import AddFlat from "./add/AddFlat";
import MyProfile from "./profile/Profile";
import Parts from "./parts/Parts";
import Flats from "./flats/Flats";
import FlatEdit from "./flats/FlatEdit";
import PartEdit from "./parts/PartEdit";
import FlatDetail from "./flats/FlatDetail";
import ShoppingCenters from "./tradeCenters/ShoppingCenters";
import ShoppingCenterDetail from "./tradeCenters/ShoppingCentersDetail";
import AddPart from "./add/AddPart";
import CategorySelector from "./categorySelector/CategorySelector";
import AddLenta from "./add/AddLenta";
import LentaEdit from "./lenta/LentaEdit";
import PartDetail from "./parts/PartDetail";
import News from "./news/News";
import NewsDetail from "./news/NewsDetail";

class MainHeader extends React.Component {
    constructor(props) {
        super(props);

        this.notif_ref = React.createRef();
        this.spinner_ref = React.createRef();

        this.state = {
            phone: localStorage.getItem("user_phone"),
            name: localStorage.getItem("user_name"),
            postTypeSelectorShow: false,

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Söwda toplumy - MarketPlace";
        this.setData();

        window.addEventListener("scroll", () => {
            if (window.scrollY < 500) {
                document.getElementById("goToTop").style.display = "none";
            } else {
                document.getElementById("goToTop").style.display = "block";
            }
        });
    }

    personIconClick() {
        if (localStorage.getItem("user_phone") === null) {
            window.location.href = "/login";
        } else {
            window.location.href = "/my_profile/";
        }
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
            <div className="home">
                <div className="header text-white">
                    <div className="px-[20px] sm:px-[10px] py-[5px] flex items-center justify-between">
                        <Link className="logo" to="/">
                            <img alt="" src="/logo_white.png"></img>
                            <div className="text">
                                <label className="company_name">
                                    Söwda toplumy
                                </label>
                                <label className="company_name_tm">
                                    Marketplace
                                </label>
                            </div>
                        </Link>

                        <div className="icons flex items-center ">
                            <button className="flex items-center p-[5px] m-[2px]">
                                <MdLanguage size={30}></MdLanguage>
                                <label className="sm:hidden">Türkmençe</label>
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({
                                        postTypeSelectorShow:
                                            !this.state.postTypeSelectorShow,
                                    });
                                }}
                                className="addPost flex relative rounded-md items-center p-[5px] m-[2px] h-max hover:bg-slate-300/20"
                            >
                                <BiPlusCircle size={30}></BiPlusCircle>
                                <label className="text-[14px] sm:hidden">
                                    Bildiriş goşmak
                                </label>

                                {this.state.postTypeSelectorShow && (
                                    <CategorySelector></CategorySelector>
                                )}
                            </button>

                            <div
                                onClick={() => {
                                    this.personIconClick();
                                }}
                                className="flex rounded-md items-center p-[5px] m-[2px] h-max hover:bg-slate-300/20"
                            >
                                <BiUserCircle size={30}></BiUserCircle>
                                <div className="flex items-center">
                                    <label className="text-[14px] sm:hidden">
                                        {this.state.name}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-slate-100 text-sky-600 flex justify-center sm:justify-start
                    overflow-x-auto whitespace-nowrap shadow-md  z-10"
                >
                    <Link to="/">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Baş sahypa
                        </button>
                    </Link>
                    <Link to="/news">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Habarlar
                        </button>
                    </Link>
                    <Link to="/stores">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Dükanlar
                        </button>
                    </Link>
                    <Link to="/products">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Harytlar
                        </button>
                    </Link>
                    <Link to="/cars">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Awtoulaglar
                        </button>
                    </Link>
                    <Link to="/parts">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Awtoşaýlar
                        </button>
                    </Link>
                    <Link to="/flats">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Gozgalmaýan emläkler
                        </button>
                    </Link>
                    <Link to="/shopping_centers">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Söwda merkezler
                        </button>
                    </Link>
                    <Link to="/lenta">
                        <button className="p-2 hover:text-slate-800 hover:bg-slate-300 rounded-lg duration-200">
                            Lenta
                        </button>
                    </Link>
                </div>

                <div className="content mx-auto max-w-[1200px] m-2 bg-white">
                    <Routes>
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
                            path="/cars/*"
                            element={<CarDetail></CarDetail>}
                        />
                        <Route
                            path="/cars/edit/*"
                            element={<CarEdit></CarEdit>}
                        />
                        <Route
                            path="/my_profile/*"
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
                            element={<SendCode></SendCode>}
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
                            element={<RestorePassword></RestorePassword>}
                        />
                        <Route
                            path="/pharmacies"
                            element={<Pharmacies></Pharmacies>}
                        />
                        <Route path="/lenta" element={<Lenta></Lenta>} />
                        <Route
                            path="/lenta/*"
                            element={<LentaDetail></LentaDetail>}
                        />
                        <Route
                            path="/lenta/edit/*"
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
                        <Route path="/parts" element={<Parts></Parts>} />
                        <Route
                            path="/parts/*"
                            element={<PartDetail></PartDetail>}
                        />
                        <Route
                            path="/parts/edit/*"
                            element={<PartEdit></PartEdit>}
                        />
                        <Route
                            path="/parts/add"
                            element={<AddPart></AddPart>}
                        />
                        <Route
                            path="/flats/add"
                            element={<AddFlat></AddFlat>}
                        />
                        <Route path="/flats" element={<Flats></Flats>} />
                        <Route
                            path="/flats/*"
                            element={<FlatDetail></FlatDetail>}
                        />
                        <Route
                            path="/flats/edit/*"
                            element={<FlatEdit></FlatEdit>}
                        />
                        <Route
                            path="/shopping_centers"
                            element={<ShoppingCenters></ShoppingCenters>}
                        />
                        <Route
                            path="/shopping_centers/*"
                            element={
                                <ShoppingCenterDetail></ShoppingCenterDetail>
                            }
                        />
                        <Route
                            path="/add"
                            element={<CategorySelector></CategorySelector>}
                        />

                        <Route path="/" element={<HomePage></HomePage>} />

                        <Route path="/news" element={<News></News>} />
                        <Route
                            path="/news/*"
                            element={<NewsDetail></NewsDetail>}
                        />
                    </Routes>
                </div>

                <div className="footer">
                    <div className="links">
                        <Link to="/about_us">Saýt barada</Link>
                        <Link to="offers">Teklipler</Link>
                        <Link to="rules">Düzgünler</Link>
                    </div>

                    <div className="mobile_apps">
                        <label className="name">Mobil wersiýalar</label>

                        <a
                            href={
                                "https://play.google.com/store/apps/details?id=com.sowdatoplumy.sowdatoplumy"
                            }
                        >
                            <img
                                alt=""
                                className="google-play"
                                src={"/google-play.png"}
                            ></img>
                        </a>

                        <a className="apk" href={server + this.state.apk}>
                            <img src="/apk.png"></img>
                            <label>APK ýükläp al</label>
                        </a>
                    </div>

                    <div className="contacts">
                        <div className="name">
                            <label>Habarlaşmak üçin</label>
                        </div>
                        <div className="items">
                            <div>
                                <MdMail size={20}></MdMail>
                                <label> sowdatoplum@mail.ru</label>
                            </div>
                            <div>
                                <MdPhone className="icon"></MdPhone>
                                <label>+99361 324577</label>
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
                    className="fixed right-[10px] bottom-[10px] bg-cyan-800 p-[10px] text-white shadow-md hidden rounded-lg"
                >
                    <BsArrowUp size={25}></BsArrowUp>
                </button>
            </div>
        );
    }
}

export default MainHeader;
