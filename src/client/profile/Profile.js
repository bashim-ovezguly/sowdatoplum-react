import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Routes, Route, Link } from "react-router-dom";
import {
    BiCar,
    BiGift,
    BiHome,
    BiLogOut,
    BiNews,
    BiShoppingBag,
} from "react-icons/bi";
import { MdMail, MdMenu, MdPhone, MdSettings } from "react-icons/md";
import AddProduct from "../add/AddProduct";
import ProfileEdit from "./ProfileEdit";
import ProfileOrdersIn from "./ProfileOrdersIn";
import ProfileProducts from "./ProfileProducts";
import ProfileCars from "./ProfileCars";
import AddCar from "../add/AddCar";
import ProfileFlats from "./ProfileFlats";
import ProfileParts from "./ProfileParts";
import AddPart from "../add/AddPart";
import { BsArrowDown, BsArrowUp, BsShop, BsTools } from "react-icons/bs";
import ProfileLenta from "./ProfileLenta";
import ProfileOrdersOut from "./ProfileOrdersOut";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            menuOpen: false,

            store_count: 0,
            car_count: 0,
            flat_count: 0,
            factory_count: 0,
            part_count: 0,
            service_count: 0,
            material_count: 0,
            products_count: 0,

            stores: [],
            cars: [],
            flats: [],
            parts: [],
            products: [],

            id: "",
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

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
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

    setStores() {
        let id = localStorage.getItem("id");
        this.setState({ isLoading: true });
        axios.get(server + "/mob/stores?customer=" + id).then((resp) => {
            this.setState({ isLoading: false, stores: resp.data.data });
        });
    }

    setCars(id) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/cars?customer=" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                cars: resp.data.data,
            });
        });
    }

    setParts(id) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/parts?customer=" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                parts: resp.data.data,
            });
        });
    }

    setFlats(id) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/flats?customer=" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                flats: resp.data.data,
            });
        });
    }

    setProducts(id) {
        this.setState({ isLoading: true });
        axios.get(server + "/mob/products?customer=" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                products: resp.data.data,
            });
        });
    }

    setData() {
        const id = localStorage.getItem("user_id");
        axios
            .get(server + "/mob/customer/" + id)
            .then((resp) => {
                this.setState({
                    user: resp.data,
                    isLoading: false,
                    id: resp.data.data.id,
                    phone: resp.data.data.phone,
                    name: resp.data.data.name,
                    email: resp.data.data.email,
                    img: resp.data.data.img_m,
                    service_count: resp.data.data.room.services,
                    material_count: resp.data.data.room.materials,
                    store_count: resp.data.data.room.store,
                    flat_count: resp.data.data.room.flats,
                    announce_count: resp.data.data.room.products,
                    factory_count: resp.data.data.room.factories,
                    part_count: resp.data.data.room.parts,
                    car_count: resp.data.data.room.cars,
                    lenta_count: resp.data.data.room.lenta,
                    created_at: resp.data.data.created_at,
                    orders_in: resp.data.data.orders_in,
                    orders_out: resp.data.data.orders_out,
                });
            })
            .catch((err) => {
                alert("error loading");
            });
    }

    logout_click() {
        localStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
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
        if (localStorage.getItem("profileMenuOpen") === "true") {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    render() {
        return (
            <div className="grid max-w-[1200px] mx-auto ">
                <div className="hidden sm:flex flex-wrap items-center border-b">
                    <MdMenu
                        onClick={() => {
                            this.openMenu();
                        }}
                        className="m-[5px] p-[5px] hover:bg-slate-300 rounded-md border"
                        size={45}
                    ></MdMenu>
                    <img
                        alt=""
                        className="w-[30px] h-[30px] object-cover rounded-full mx-[10px]"
                        src={server + this.state.img}
                    ></img>
                    <label className="mr-[10px]">{this.state.name} </label>
                </div>

                <div className="grid grid-cols-[max-content_auto] sm:grid-cols-1">
                    <div
                        id="menu"
                        onClick={() => {
                            this.closeMenu();
                        }}
                        className="profileMenu duration-300 sm:top-[0px] sm:fixed bg-white 
                                grid m-2 h-max rounded-md border p-2 shadow-md"
                    >
                        <label className="text-[20px] font-bold text-center">
                            Şahsy otag
                        </label>

                        <img
                            alt=""
                            className="w-[100px] h-[100px] object-cover rounded-full mx-auto"
                            src={server + this.state.img}
                        ></img>

                        <label className="text-[16px] font-bold text-center">
                            {this.state.name}
                        </label>
                        <div className="grid items-center text-[12px]">
                            <div className="flex items-center justify-center">
                                <label>+993{this.state.phone}</label>
                            </div>
                        </div>

                        <div className="grid items-center text-[15px] text-slate-600 ">
                            <Link
                                to="/my_profile/edit"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <button className="flex items-center w-max ">
                                    <MdSettings
                                        className="m-2"
                                        size={20}
                                    ></MdSettings>
                                    <label className="">Profil</label>
                                </button>
                            </Link>
                            <Link
                                to="/my_profile/announces"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiGift className="m-2" size={20}></BiGift>
                                <label className="">
                                    Harytlar {this.state.announce_count}{" "}
                                </label>
                            </Link>

                            <Link
                                to="/my_profile/cars"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiCar className="m-2" size={20}></BiCar>
                                <label className="">
                                    Awtoulaglar {this.state.car_count}
                                </label>
                            </Link>

                            <Link
                                to="/my_profile/parts"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BsTools className="m-2" size={20}></BsTools>
                                <label className="">
                                    Awtoşaýlar {this.state.part_count}
                                </label>
                            </Link>

                            <Link
                                to="flats"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiHome className="m-2" size={20}></BiHome>
                                <label className="">
                                    Gozgalmaýan emläkler {this.state.flat_count}
                                </label>
                            </Link>

                            <Link
                                to="lenta"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiNews className="m-2" size={20}></BiNews>
                                <label className="">
                                    Lenta {this.state.lenta_count}
                                </label>
                            </Link>

                            <Link
                                to="/my_profile/orders_in"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiShoppingBag
                                    className="m-2"
                                    size={20}
                                ></BiShoppingBag>
                                <BsArrowDown></BsArrowDown>
                                <label className="">
                                    Gelen sargytlar {this.state.orders_in}
                                </label>
                            </Link>

                            <Link
                                to="/my_profile/orders_out"
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                            >
                                <BiShoppingBag
                                    className="m-2"
                                    size={20}
                                ></BiShoppingBag>
                                <BsArrowUp></BsArrowUp>
                                <label className="">
                                    {" "}
                                    Giden sargytlar {this.state.orders_out}{" "}
                                </label>
                            </Link>

                            <button
                                className="flex p-1/2 border-white hover:bg-slate-200 rounded-md items-center"
                                onClick={() => {
                                    this.logout_click();
                                }}
                            >
                                <BiLogOut className="m-2" size={20}></BiLogOut>
                                <label className=" flex items-center">
                                    Çykmak
                                </label>
                            </button>
                        </div>
                    </div>
                    <div className="menuContent p-4 border shadow-md m-2 rounded-md">
                        <Routes>
                            <Route
                                path="orders_in"
                                element={<ProfileOrdersIn></ProfileOrdersIn>}
                            />
                            <Route
                                path="orders_out"
                                element={<ProfileOrdersOut></ProfileOrdersOut>}
                            />
                            <Route
                                path="announces"
                                element={<ProfileProducts></ProfileProducts>}
                            />
                            <Route
                                path="announces/add"
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
                                path="flats"
                                element={<ProfileFlats></ProfileFlats>}
                            ></Route>
                            <Route
                                path="parts"
                                element={<ProfileParts></ProfileParts>}
                            ></Route>
                            <Route
                                path="lenta"
                                element={<ProfileLenta></ProfileLenta>}
                            ></Route>
                            <Route
                                path="/parts/add"
                                element={<AddPart></AddPart>}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyProfile;
