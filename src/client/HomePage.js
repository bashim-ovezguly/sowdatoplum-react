import axios from "axios";
import React from "react";
import { server } from "../static";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MotionAnimate } from "react-motion-animate";
import WriteToUs from "./WriteToUs";

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            stores: [],
            cars: [],
            products: [],
            user: [],
            news: [],

            slider1: [],
            slider2: [],
            slider3: [],
        };

        document.title = "Baş sahypa";

        this.setData();
        this.setNews();
    }

    async getDeviceID() {
        if (localStorage.getItem("device_id") == undefined) {
            await axios.get(server + "/device_id").then((resp) => {
                //set device id
                localStorage.setItem("device_id", resp.data.device_id);
                //set client ip address
                localStorage.setItem("ip", resp.data.ip);
            });
        }
    }

    setNews() {
        axios.get(server + "/news").then((resp) => {
            var t = resp.data.data;

            const news_count = 6;
            t = t.splice(0, news_count);
            this.setState({ news: t });
        });
    }

    async setData() {
        await this.getDeviceID();

        var appHeaders = {
            platform: "web",
            "device-id": localStorage.getItem("device_id"),
            "api-key": "sowda_toplum_client",
        };

        await axios
            .get(server + "/homepage", { headers: appHeaders })
            .then((resp) => {
                this.setState({ slider1: resp.data.data.slider1 });
                this.setState({ slider2: resp.data.data.slider2 });
                this.setState({ slider3: resp.data.data.slider3 });
                this.setState({ cars: resp.data.data.cars });
                this.setState({ products: resp.data.data.products });
                this.setState({ stores: resp.data.data.stores });
            });

        await axios.get(server + "/apk").then((resp) => {
            this.setState({ apk: resp.data["apk"], isLoading: false });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center m-2 p-2">
                    <CircularProgress></CircularProgress>
                </div>
            );
        }

        const responsive = {
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 1,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 1,
            },
            mobile: {
                breakpoint: { max: 400, min: 0 },
                items: 1,
            },
        };

        return (
            <div className="home_page w-full">
                <MotionAnimate>
                    <div className="grid sm:grid-cols-1 grid-cols-[70%_auto] ">
                        <Carousel
                            autoPlay={true}
                            autoPlaySpeed={3000}
                            swipeable={true}
                            showDots={true}
                            arrows={true}
                            draggable={true}
                            infinite={true}
                            responsive={responsive}
                        >
                            {this.state.slider1.map((item) => {
                                return (
                                    <div className="overflow-hidden mt-2 mb-6">
                                        <img
                                            className="object-cover aspect-video border overflow-hidden rounded-lg w-full"
                                            alt=""
                                            src={server + item.img}
                                        ></img>
                                        <label className="font-bold text-[22px] sm:text-[16px] py-4">
                                            {item.title}
                                        </label>
                                    </div>
                                );
                            })}
                        </Carousel>
                        <div className="grid my-2 h-max p-2 overflow-y-auto">
                            {this.state.news.map((item) => {
                                return (
                                    <Link
                                        to={"/news/" + item.id}
                                        className="mb-2 ml-1  flex duration-200 
                                    rounded-lg overflow-hidden  hover:bg-slate-200 bg-slate-100 shadow-md"
                                    >
                                        <img
                                            className="w-[80px] h-[80px] object-cover rounded-md m-1"
                                            alt=""
                                            src={server + item.img}
                                        ></img>
                                        <div className="grid m-2 h-max">
                                            <label className="text-[12px]">
                                                {item.created_at}
                                            </label>
                                            <label className="text-[12px]  font-bold line-clamp-2">
                                                {String(
                                                    item.title_tm
                                                ).substring(0, 80)}
                                            </label>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <a
                        className="flex justify-center h-[100px]  items-center rounded-lg my-2 p-2 relative 
                         bg-slate-100"
                        href={server + this.state.apk}
                    >
                        <img className=" h-full" alt="" src="/mobile.png"></img>
                        <label className="mx-2 text-[30px] sm:text-[20px] text-center text-appColor font-bold">
                            Mobil görnüşini ýükläp alyň!
                        </label>
                    </a>

                    <div className="grid  rounded-lg">
                        <h1 className="text-[15px] sm:text-xl my-1 p-3  text-appColor border-b font-bold">
                            <Link to={"/stores"}>Dükanlar</Link>
                        </h1>
                        <div className="flex flex-wrap justify-center">
                            {this.state.stores.map((item) => {
                                return (
                                    <Link
                                        to={"/stores/" + item.id + "/"}
                                        key={item.id}
                                        className="w-[180px] sm:w-[100px] m-2 grid justify-center rounded-lg hover:shadow-2xl
                                        duration-200 text-[12px] overflow-hidden  h-max shadow-md border"
                                    >
                                        <img
                                            className="h-[180px] w-[180px]  duration-200 sm:h-[100px] 
                                            object-cover "
                                            alt=""
                                            src={server + item.logo}
                                        ></img>
                                        <label className="text-[14px] font-bold m-1 text-center sm:text-[10px] line-clamp-1">
                                            {item.name}
                                        </label>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="  rounded-lg mt-2 grid">
                        <Link
                            to={"/cars"}
                            className="text-[15px] border-b sm:text-xl my-2 p-3 text-appColor font-bold"
                        >
                            Awtoulaglar
                        </Link>
                        <div className="flex flex-wrap justify-center sm:grid-cols-2 grid-cols-3">
                            {this.state.cars.map((item) => {
                                return (
                                    <Link
                                        to={"/cars/" + item.id}
                                        key={item.id}
                                        className="w-[180px] sm:w-[120px] m-2 grid grid-rows-[max-content_max-content] hover:shadow-2xl
                                    rounded-lg border bg-white shadow-md overflow-hidden duration-200 sm:text-[10px] text-[12px] "
                                    >
                                        <img
                                            className="duration-200 h-[180px] w-full sm:h-[150px] object-cover border"
                                            alt=""
                                            src={server + item.img}
                                        ></img>

                                        <div className="text grid content-start h-max p-2">
                                            <label
                                                className=""
                                                onClick={() => {
                                                    this.item_click(item.id);
                                                }}
                                            >
                                                {item.mark} {item.model}{" "}
                                                {item.year}
                                            </label>

                                            <label className="w-max rounded-md text-appColor ">
                                                {item.price} TMT
                                            </label>

                                            <label className="">
                                                {
                                                    String(
                                                        item.created_at
                                                    ).split(" ")[0]
                                                }
                                            </label>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-b p-2 rounded-lg mt-2">
                        <Link
                            to={"/products"}
                            className="text-[15px] w-full sm:text-xl my-[10px] text-appColor font-bold"
                        >
                            Harytlar
                        </Link>
                        <div className="flex flex-wrap justify-center sm:grid-cols-2 border-t">
                            {this.state.products.map((item) => {
                                return (
                                    <Link
                                        to={"/products/" + item.id}
                                        className="m-1  w-[180px] sm:w-[150px] grid overflow-hidden rounded-lg text-[12px] sm:text-[10px]
                                    border hover:shadow-2xl shadow-md  duration-200"
                                    >
                                        <img
                                            className="w-full h-[180px] sm:h-[150px] object-cover border"
                                            alt=""
                                            src={server + item.img}
                                        ></img>

                                        <div className="grid m-2">
                                            <label className=" content-start">
                                                {item.name}
                                            </label>
                                            <label className=" w-max rounded-md text-appColor">
                                                {item.price} TMT
                                            </label>

                                            <label className="">
                                                {
                                                    String(
                                                        item.created_at
                                                    ).split(" ")[0]
                                                }
                                            </label>
                                            <label
                                                className="rounded-full line-clamp-1 top-[135px] sm:top-[95px] left-1 text-white 
                                drop-shadow-2xl bg-yellow-600 w-max px-2"
                                            >
                                                {item.store_name}
                                            </label>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <WriteToUs></WriteToUs>
                </MotionAnimate>
            </div>
        );
    }
}

export default HomePage;
