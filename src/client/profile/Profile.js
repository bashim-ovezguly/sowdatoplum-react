import axios from "axios";
import React from "react";
import { server, storeUrl } from "../../static";
import { Routes, Route, Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import {
    MdCardGiftcard,
    MdCarRental,
    MdEdit,
    MdImage,
    MdPerson,
    MdSettings,
    MdShoppingCart,
} from "react-icons/md";
import AddProduct from "../add/AddProduct";
import ProfileEdit from "./ProfileEdit";
import ProfileProducts from "./ProfileProducts";
import ProfileCars from "./ProfileCars";
import AddCar from "../add/AddCar";
import ProfileLenta from "./ProfileAksiya";
import ProfileOrders from "./ProfileOrders";
import ProfileImages from "./ProfileImages";
import { user_is_authenticated } from "../../App";
import { MotionAnimate } from "react-motion-animate";
import { toast, ToastContainer } from "react-toastify";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            menuOpen: false,
            car_count: 0,
            products_count: 0,

            stores: [],
            cars: [],
            flats: [],
            parts: [],
            products: [],

            id: localStorage.getItem("user_id"),
            name: "",
            phone: "",
            email: "",
            created_at: "",
            img: "",

            active_tab: "",
            postTypeSelectorOpen: false,

            showAddStoreProduct: false,
            showAddProduct: false,
            showAddStore: false,
            showAddCar: false,
            showAddFlat: false,
            showAddPart: false,
        };

        document.title = "Profile";

        this.setData();
    }

    stores() {
        return (
            <div>
                <div>
                    <h3>Dükanlar</h3>
                </div>
                <div>
                    {this.state.stores.map((item) => {
                        return (
                            <a
                                href={"/stores/edit/" + item.id}
                                className="store_card"
                            >
                                {item.img !== "" && (
                                    <img alt="" src={server + item.img}></img>
                                )}
                                <label>{item.name}</label>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }

    setProducts(id) {
        this.setState({ isLoading: true });
        axios.get(server + "/products?store=" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                products: resp.data.data,
            });
        });
    }

    logout() {
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_phone");
        localStorage.removeItem("user_access_token");
        localStorage.removeItem("user_refresh_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_id");
        localStorage.setItem("logged_in", false);
        window.location.href = "/";
    }

    setData() {
        axios
            .get(server + "/profile", {
                headers: { token: localStorage.getItem("user_access_token") },
            })
            .then((resp) => {
                this.setState({
                    isLoading: false,
                    id: resp.data.id,
                    phone: resp.data.phone,
                    name: resp.data.name,
                    email: resp.data.email,
                    img: resp.data.img_m,
                    wallpaper: resp.data.wallpaper,
                    flat_count: resp.data.stats.flats,
                    announce_count: resp.data.stats.products,
                    image_count: resp.data.stats.images,
                    car_count: resp.data.stats.cars,
                    lenta_count: resp.data.stats.lenta,
                    created_at: resp.data.created_at,
                    orders: resp.data.stats.orders,
                    logo: resp.data.logo,
                });
            })
            .catch((err) => {
                this.logout();
            });
    }

    logout_click() {
        window.location.href = "/login";
        localStorage.removeItem("user_access_token");
    }

    postAddClick() {
        if (this.state.postTypeSelectorOpen) {
            this.setState({ postTypeSelectorOpen: false });
        } else {
            this.setState({ postTypeSelectorOpen: true });
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

    componentDidMount() {
        if (!user_is_authenticated()) {
            window.location.href = "/login";
        }
    }

    setWallpaper() {
        var formdata = new FormData();
        formdata.append(
            "wallpaper",
            document.getElementById("wallpaperFileInput").files[0]
        );

        axios
            .put(storeUrl + "/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Ýatda saklandy");
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.logout_click();
                }

                toast.error("Ýalňyşlyk ýüze çykdy");
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <MotionAnimate>
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="grid sm:grid-cols-1 grid-cols-[max-content_auto]">
                    <div className=" grid  p-2 sm:w-full w-[250px] h-max">
                        {this.state.logo != null && (
                            <img
                                alt=""
                                className="w-[120px] sm:w-[180px]  aspect-square  mx-auto
                            object-cover rounded-full border overflow-hidden "
                                src={server + this.state.logo}
                            ></img>
                        )}

                        {this.state.logo == null && (
                            <MdPerson
                                size={100}
                                className="text-slate-500 m-auto border rounded-full mx-auto "
                            ></MdPerson>
                        )}
                        <label className="text-[18px] font-bold text-center">
                            {this.state.name}
                        </label>

                        <div className="grid items-center  text-[15px] text-center">
                            <label>+993{this.state.phone}</label>
                        </div>

                        <Link
                            to="/profile/edit"
                            className="flex p-2 bg-slate-200 rounded-md hover:bg-slate-300 
                            duration-100 items-center my-1"
                        >
                            <button className="flex items-center w-max ">
                                <MdSettings size={20}></MdSettings>
                                <label className="mx-2">Sazlamalar</label>
                            </button>
                        </Link>
                        <button
                            className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 duration-100 
                            flex items-center my-1"
                            onClick={() => {
                                this.logout_click();
                            }}
                        >
                            <BiLogOut size={20}></BiLogOut>
                            <label className="mx-2">Çykmak</label>
                        </button>
                    </div>
                    <div className="w-full grid h-max">
                        <div className="grid relative h-[200px] bg-slate-100 rounded-lg p-2 ">
                            {this.state.wallpaper != null && (
                                <img
                                    alt=""
                                    className="w-full h-full absolute object-cover rounded-lg border-3 border-white"
                                    src={server + this.state.wallpaper}
                                ></img>
                            )}

                            <div className="rounded-full shadow-lg bg-white  bottom-2 right-2 absolute p-2">
                                <input
                                    id="wallpaperFileInput"
                                    hidden
                                    onChange={() => {
                                        this.setWallpaper();
                                    }}
                                    multiple={false}
                                    type="file"
                                ></input>

                                <MdImage
                                    onClick={() => {
                                        document
                                            .getElementById(
                                                "wallpaperFileInput"
                                            )
                                            .click();
                                    }}
                                    className="drop-shadow-md hover:cursor-pointer hover:text-slate-400 duration-200 text-slate-600"
                                    size={30}
                                ></MdImage>
                            </div>
                        </div>
                        <div className="flex items-center overflow-x-auto text-[14px] text-white m-2 border-b whitespace-nowrap py-1">
                            <Link
                                to="/profile/images"
                                className="flex p-1 px-3 mr-1 hover:bg-appColor hover:text-white rounded-full text-appColor 
                                            items-center duration-200"
                            >
                                <label className="">
                                    Suratlar {this.state.image_count}
                                </label>
                            </Link>
                            <Link
                                to="/profile/products"
                                className="flex p-1 px-3 mr-1 hover:bg-appColor hover:text-white rounded-full text-appColor 
                                            items-center duration-200"
                            >
                                <label className="">
                                    Harytlar {this.state.announce_count}{" "}
                                </label>
                            </Link>

                            <Link
                                to="/profile/cars"
                                className="flex p-1 px-3 mr-1 hover:bg-appColor hover:text-white rounded-full text-appColor 
                                            items-center duration-200"
                            >
                                <label className="">
                                    Awtoulaglar {this.state.car_count}
                                </label>
                            </Link>

                            <Link
                                to="/profile/lenta"
                                className="flex p-1 px-3 mr-1 hover:bg-appColor hover:text-white rounded-full text-appColor 
                                            items-center duration-200"
                            >
                                <label className="">
                                    Aksiýalar {this.state.lenta_count}
                                </label>
                            </Link>

                            <Link
                                to="/profile/orders"
                                className="flex p-1 px-3 mr-1 hover:bg-appColor hover:text-white rounded-full text-appColor 
                                            items-center duration-200"
                            >
                                <label className="">
                                    Sargytlar {this.state.orders}
                                </label>
                            </Link>
                        </div>
                        <Routes>
                            <Route
                                path="orders"
                                element={<ProfileOrders></ProfileOrders>}
                            />

                            <Route
                                path="products"
                                element={<ProfileProducts></ProfileProducts>}
                            />
                            <Route
                                path="products/add"
                                element={<AddProduct></AddProduct>}
                            />
                            <Route
                                path="edit"
                                element={<ProfileEdit></ProfileEdit>}
                            ></Route>

                            <Route
                                path="cars"
                                element={<ProfileCars></ProfileCars>}
                            ></Route>
                            <Route
                                path="cars/add"
                                element={<AddCar></AddCar>}
                            ></Route>

                            <Route
                                path="images"
                                element={<ProfileImages></ProfileImages>}
                            ></Route>
                            <Route
                                path="lenta"
                                element={<ProfileLenta></ProfileLenta>}
                            ></Route>
                        </Routes>
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default MyProfile;
