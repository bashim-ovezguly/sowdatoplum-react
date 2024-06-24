import axios from "axios";
import React from "react";
import { BiCar, BiMap } from "react-icons/bi";
import { IoMdShirt } from "react-icons/io";
import { server } from "../../static";
import { MdCall, MdImage, MdInfo, MdLayers } from "react-icons/md";
import { Routes, Route, Link } from "react-router-dom";
import StoreImages from "./StoresImages";
import StoreProducts from "./StoresProducts";
import StoreAbout from "./StoresAbout";
import StoreCars from "./StoresCars";
import StoreContacts from "./StoreContacts";
import StoreVideos from "./StoresVideos";
import MetaTags from "react-meta-tags";
import StoreParts from "./StoreParts";
import StoreBasket from "./StoreBasket";

class StoreProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            workStart: "",
            workEnd: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            viewed: 0,
            size: "",
            center: "",
            address: "",
            customer_id: "",
            customer_name: "",
            phones: [],
            cars: [],
            materials: [],
            contacts: [],
            page_size: 20,
            products_page: "",
            products_count: "",
            main_contact: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    basket() {
        let productIds = localStorage.getItem("basket").split(",");

        return (
            <div className="absolute m-auto rounded-lg p-2 bg-white min-w-[200px] min-h-[200px] shadow-xl">
                <label className="border-b">Sebet</label>
                {}
            </div>
        );
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/stores/" + id).then((resp) => {
            document.title = resp.data.name_tm;

            if (resp.data.contacts.length > 0) {
                this.setState({ main_contact: resp.data.contacts[0].value });
            }

            this.setState({
                name: resp.data.name_tm,
                body_tm: resp.data.body_tm,
                location: resp.data.location,
                viewed: resp.data.viewed,
                detail_text: resp.data.body_tm,
                img: resp.data.img,
                created_at: resp.data.created_at,
                images: resp.data.images,
                category: resp.data.category,
                center: resp.data.center,
                size: resp.data.size,
                address: resp.data.address,
                phones: resp.data.phones,
                customer_id: resp.data.customer_id,
                customer_phone: resp.data.customer_phone,
                customer_name: resp.data.customer.name,
                location_name: resp.data.location_name,
                id: resp.data.id,
                cars: resp.data.modules.cars,
                flats: resp.data.modules.flats,
                products: resp.data.modules.products,
                parts: resp.data.modules.parts,
                services: resp.data.modules.services,
                contacts: resp.data.contacts,
                isLoading: false,
            });
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    setProductsPage(pageNumber) {
        this.setState({ isLoading: true });

        axios
            .get(
                server +
                    "/mob/products?store=" +
                    this.state.id +
                    "&page=" +
                    pageNumber +
                    "&page_size=" +
                    this.state.page_size
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="stores_detail grid p-[10px]">
                {/* <MetaTags>
                    <title>{this.state.name}</title>
                    <meta name="description" content={this.state.category} />
                    <meta property="og:title" content={this.state.name} />
                    <meta
                        property="og:image"
                        content={server + this.state.img}
                    />
                </MetaTags> */}

                {/* {this.basket()} */}

                <div>
                    <div className="store_header flex text-blue-950">
                        <img
                            alt="Logo"
                            className="sm:w-[100px] sm:h-[100px] border-[#0a2362] p-1 rounded-full w-[150px] h-[150px] border object-cover"
                            src={server + this.state.img}
                        ></img>
                        <div className="text grid pl-[20px] my-auto">
                            <label className="store_name text-[25px] sm:text-[17px] bold">
                                {this.state.name}{" "}
                            </label>
                            {this.state.location_name !== "" && (
                                <div className="flex items-center">
                                    <BiMap></BiMap>
                                    <label>{this.state.location_name}</label>
                                </div>
                            )}

                            {this.state.category !== "" && (
                                <div className="flex items-center text-15px">
                                    <MdLayers></MdLayers>
                                    <label>{this.state.category}</label>
                                </div>
                            )}

                            {this.state.main_contact !== "" && (
                                <a
                                    href={"tel:" + this.state.main_contact}
                                    className="flex items-center w-max text-green-700
                                             duration-300 my-[2px]"
                                >
                                    <MdCall size={18} className=""></MdCall>
                                    <label className="hover:text-slate-300 duration-200">
                                        {this.state.main_contact}
                                    </label>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="tab flex p-[5px] mb-[10px] overflow-x-auto text-slate-700 border-b">
                    <Link
                        to={"images"}
                        className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                    >
                        Suratlar
                    </Link>

                    <Link
                        to={"videos"}
                        className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                    >
                        Wideolar
                    </Link>
                    {this.state.products > 0 && (
                        <Link
                            to={"products"}
                            className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                        >
                            Harytlar
                        </Link>
                    )}

                    {this.state.cars > 0 && (
                        <Link
                            to={"cars"}
                            className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                        >
                            Awtoulaglar
                        </Link>
                    )}

                    {this.state.parts > 0 && (
                        <Link
                            to={"parts"}
                            className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                        >
                            Awtoşaýlar
                        </Link>
                    )}

                    <Link
                        to={"about"}
                        className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                    >
                        Dükan barada
                    </Link>
                    <Link
                        to={"contacts"}
                        className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                    >
                        Habarlaşmak üçin
                    </Link>

                    <Link
                        to={"basket"}
                        className="text-[15px] flex items-center w-max text-nowrap rounded-lg  hover:bg-slate-100 duration-150 px-2 py-1"
                    >
                        Sebet
                    </Link>
                </div>

                <div className="tab-content">
                    <Routes>
                        <Route
                            path="/products"
                            element={<StoreProducts></StoreProducts>}
                        />
                        <Route
                            path="/videos"
                            element={<StoreVideos></StoreVideos>}
                        />
                        <Route
                            path="/images"
                            element={<StoreImages></StoreImages>}
                        />
                        <Route path="/cars" element={<StoreCars></StoreCars>} />
                        <Route
                            path="/about"
                            element={<StoreAbout></StoreAbout>}
                        />
                        <Route
                            path="/contacts"
                            element={<StoreContacts></StoreContacts>}
                        />

                        <Route
                            path="/parts"
                            element={<StoreParts></StoreParts>}
                        />
                        <Route
                            path="/*"
                            element={<StoreProducts></StoreProducts>}
                        />

                        <Route
                            path="/basket"
                            element={<StoreBasket></StoreBasket>}
                        />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default StoreProfile;
