import axios from "axios";
import React from "react";
import { BiMap } from "react-icons/bi";
import { server, storeUrl } from "../../static";
import { MdCalendarToday, MdCall, MdLayers } from "react-icons/md";
import { Routes, Route, Link } from "react-router-dom";
import StoreProducts from "./StoresProducts";
import StoreCars from "./StoreCars";
import StoreVideos from "./StoresVideos";
import StoreImages from "./StoresImages";
import { BsEye } from "react-icons/bs";
import ProgressIndicator from "../../admin/ProgressIndicator";

class StoreProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: [],
            products: [],
            viewed: 0,
            address: "",
            phones: [],
            page_size: 20,
            showContacts: false,
            description: "",
        };

        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(storeUrl + "/" + id).then((resp) => {
            document.title = resp.data.name;

            this.setState({
                id: resp.data.id,
                name: resp.data.name,
                body_tm: resp.data.body_tm,
                viewed: resp.data.viewed,
                detail: resp.data.detail,
                logo: resp.data.logo,
                wallpaper: resp.data.wallpaper,
                created_at: resp.data.created_at,
                images: resp.data.images,
                center: resp.data.center,
                address: resp.data.address,
                cars: resp.data.stats.cars,
                flats: resp.data.stats.flats,
                products: resp.data.stats.products,
                videos: resp.data.stats.videos,
                parts: resp.data.stats.parts,
                lenta: resp.data.stats.lenta,
                images_count: resp.data.stats.images,
                phones: resp.data.phones,
                delivery_price: resp.data.delivery_price,
                description: resp.data.description,
                location: resp.data.location,
                category_name: resp.data.category.name,
                category_id: resp.data.category.id,
                isLoading: false,
            });
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = this.state.name;
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
        if (this.state.name != undefined) {
            document
                .getElementById("og:title")
                .setAttribute("content", this.state.name);
        }

        if (this.state.isLoading) {
            return (
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
            );
        }
        return (
            <div className="overflow-hidden grid px-1 w-full mx-auto bg-white ">
                <div className="grid w-full sm:grid-cols-1 grid-cols-[max-content_auto] my-1 h-max  rounded-xl p-2 ">
                    <div id="menu" className="grid h-max sm:w-full w-[300px]">
                        <img
                            alt="Logo"
                            className="sm:w-[150px] w-[150px] mx-auto rounded-full aspect-square object-cover border "
                            src={server + this.state.logo}
                        ></img>
                        <div className="grid text-[14px] sm:text-[14px] mx-4 h-max my-auto  ">
                            <label className="store_name text-[25px] sm:text-[20px] font-bold text-center ">
                                {this.state.name}{" "}
                            </label>
                            <Link
                                to={"about"}
                                className="store_name hover:bg-slate-100 rounded-lg text-[12px] sm:text-[10px] font-bold text-slate-600 
                            line-clamp-4 "
                            >
                                {"  "} {this.state.description}
                            </Link>
                            <div className="grid sm:flex sm:flex-wrap sm:justify-center">
                                {this.state.category_name != undefined && (
                                    <div className="flex items-center my-1">
                                        <MdLayers size={18}></MdLayers>
                                        <label className="mx-1">
                                            {this.state.category_name}
                                        </label>
                                    </div>
                                )}
                                {this.state.location != undefined && (
                                    <div className="flex items-center my-1 ">
                                        <BiMap size={18}></BiMap>
                                        <label className="mx-1">
                                            {this.state.location.name}
                                        </label>
                                    </div>
                                )}
                                <div className="flex items-center my-1">
                                    <MdCalendarToday
                                        size={18}
                                    ></MdCalendarToday>
                                    <label className="mx-1">
                                        {this.state.created_at}
                                    </label>
                                </div>
                                <div className="flex items-center my-1 ">
                                    <BsEye size={18}></BsEye>
                                    <label className="mx-1">
                                        {this.state.viewed}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="grid my-1">
                            {this.state.phones.map((item) => {
                                return (
                                    <a
                                        href={"tel:" + item.phone}
                                        className="flex items-center duration-200 text-[15px] justify-center
                                    p-2 rounded-md border-appColor m-1 text-sky-600 hover:shadow-md hover:bg-slate-100 border"
                                    >
                                        <MdCall size={18}></MdCall>
                                        <label>{item.phone}</label>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div id="content" className="grid h-max ">
                        {this.state.wallpaper != null && (
                            <img
                                alt=""
                                className="w-full h-[200px] object-cover rounded-lg border-3 border-white"
                                src={server + this.state.wallpaper}
                            ></img>
                        )}
                        <div className="flex my-4 h-max  overflow-x-auto whitespace-nowrap w-full text-[16px] border-b ">
                            {this.state.images.length > 0 && (
                                <Link
                                    to={"images"}
                                    className="flex text-appColor hover:bg-appColor hover:text-white items-center justify-between m-1 
                           duration-200 rounded-md px-2 p-1 w-max"
                                >
                                    Suratlar
                                    <label className="mx-1">
                                        {this.state.images_count}
                                    </label>
                                </Link>
                            )}

                            {this.state.videos > 0 && (
                                <Link
                                    to={"videos"}
                                    className="flex text-appColor hover:bg-appColor hover:text-white items-center justify-between m-1 
                           duration-200 rounded-md px-2 p-1 w-max"
                                >
                                    Wideolar
                                    <label className="mx-1">
                                        {this.state.videos}
                                    </label>
                                </Link>
                            )}
                            {this.state.products > 0 && (
                                <Link
                                    to={"products"}
                                    className="flex text-appColor hover:bg-appColor hover:text-white items-center justify-between m-1 
                           duration-200 rounded-md px-2 p-1 w-max"
                                >
                                    Harytlar
                                    <label className="mx-1">
                                        {this.state.products}
                                    </label>
                                </Link>
                            )}

                            {this.state.cars > 0 && (
                                <Link
                                    to={"cars"}
                                    className="flex text-appColor hover:bg-appColor hover:text-white items-center justify-between m-1 
                           duration-200 rounded-md px-2 p-1 w-max"
                                >
                                    Awtoulaglar
                                    <label className="mx-1">
                                        {this.state.cars}
                                    </label>
                                </Link>
                            )}

                            <Link
                                to={"about"}
                                className="flex text-appColor hover:bg-appColor hover:text-white items-center justify-between m-1 
                        duration-200 rounded-md px-2 p-1 w-max"
                            >
                                Dükan barada
                            </Link>
                        </div>

                        <div className="min-h-[500px]">
                            <Routes>
                                <Route
                                    path="products"
                                    element={<StoreProducts></StoreProducts>}
                                ></Route>
                                <Route
                                    path=""
                                    element={<StoreProducts></StoreProducts>}
                                ></Route>
                                <Route
                                    path="cars"
                                    element={<StoreCars></StoreCars>}
                                ></Route>
                                <Route
                                    path="videos"
                                    element={<StoreVideos></StoreVideos>}
                                ></Route>
                                <Route
                                    path="images"
                                    element={<StoreImages></StoreImages>}
                                ></Route>
                                <Route
                                    path="about"
                                    element={
                                        <div className="p-2 whitespace-pre-line">
                                            {this.state.description}
                                        </div>
                                    }
                                ></Route>
                            </Routes>
                        </div>
                    </div>
                </div>

                {/* </motion.div> */}
            </div>
        );
    }
}

export default StoreProfile;
