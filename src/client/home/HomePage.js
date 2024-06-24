import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./homepage.css";

// import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Grow from "@mui/material/Grow";

import { CircularProgress } from "@mui/material";

import { Link } from "react-router-dom";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Söwda toplumy - MarketPlace";
        this.setData();
    }

    getNews() {
        axios.get(server + "/mob/news").then((resp) => {
            var t = resp.data.data;
            t = t.splice(0, 4);
            this.setState({ news: t });
        });
    }

    setData() {
        this.getNews();
        axios.get(server + "/mob/stores?premium=1").then((resp) => {
            this.setState({
                stores: resp.data.data.splice(0, 5),
                isLoading: false,
            });
        });

        axios.get(server + "/mob/products").then((resp) => {
            this.setState({
                products: resp.data.data.splice(0, 5),
                isLoading: false,
            });
        });

        axios.get(server + "/mob/home_ads").then((resp) => {
            this.setState({ slider1: resp.data.data.slider1 });
            this.setState({ slider2: resp.data.data.slider2 });
            this.setState({ slider3: resp.data.data.slider3 });
        });

        axios.get(server + "/mob/cars?sort=-id").then((resp) => {
            this.setState({
                cars: resp.data.data.splice(0, 5),
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center m-5px">
                    <CircularProgress></CircularProgress>
                </div>
            );
        }

        var default_img_url = "/default.png";

        const responsive2 = {
            superLargeDesktop: {
                // the naming can be any, depends on you.
                breakpoint: { max: 4000, min: 3000 },
                items: 1,
            },
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
            <div className="home_page">
                <div className="max-w-[1200px] overflow-hidden justify-center mx-auto w-[95vw]">
                    <Carousel
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        swipeable={true}
                        showDots={true}
                        arrows={true}
                        draggable={true}
                        infinite={true}
                        responsive={responsive2}
                    >
                        {this.state.slider1.map((item) => {
                            return (
                                <div className="overflow-hidden m-2 rounded-lg">
                                    <img
                                        className="object-cover w-full h-[550px] sm:h-[250px]"
                                        alt=""
                                        src={server + item.img}
                                    ></img>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>

                <h1 className="text-2xl sm:text-xl my-1 p-3  text-sky-800 border-b">
                    Maslahat berilýän dükanlar
                </h1>
                <div className="flex flex-wrap justify-center  sm:grid-cols-3">
                    {this.state.stores.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/stores/" + item.id + "/"}
                                key={item.id}
                                className="w-[200px] sm:w-[100px] grid m-2 p-2 rounded-lg duration-200 text-[12px]"
                            >
                                <img
                                    className="h-[200px] hover:shadow-lg duration-200 sm:h-[90px] object-cover rounded-3xl 
                                    border shadow-md "
                                    alt=""
                                    src={img_url}
                                ></img>
                                <label className="text-sm sm:text-[10px] font-bold m-[2px]">
                                    {item.name}
                                </label>
                            </Link>
                        );
                    })}
                </div>

                <div className="border-b p-2">
                    <Link
                        to={"/cars"}
                        className="text-2xl w-full sm:text-xl my-[10px] text-sky-800"
                    >
                        Awtoulaglar
                    </Link>
                </div>

                <div className="flex flex-wrap my-4  justify-center">
                    {this.state.cars.map((item) => {
                        var img_url = server + item.img;
                        if (item.img === "") {
                            img_url = default_img_url;
                        }

                        return (
                            <Link
                                to={"/cars/" + item.id}
                                key={item.id}
                                className="sm:w-[150px] w-[200px] m-1 grid grid-rows-[max_content-max_content] shadow-lg bg-slate-100
                                justify-center rounded-lg border overflow-hidden hover:shadow-lg duration-200 text-[12px]"
                            >
                                <img
                                    className="hover:shadow-slate-300 duration-200 w-full h-[200px] sm:h-[150px] object-cover"
                                    alt=""
                                    src={img_url}
                                ></img>
                                <div className="text grid content-start h-max sm:text-[10px] p-2">
                                    <label
                                        className="font-bold"
                                        onClick={() => {
                                            this.item_click(item.id);
                                        }}
                                    >
                                        {item.mark} {item.model} {item.year}
                                    </label>
                                    <label className="text-sky-600 font-bold">
                                        {item.price}
                                    </label>
                                    <label className="text-[12px]">
                                        {item.created_at}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="border-b p-2">
                    <Link
                        to={"/products"}
                        className="text-2xl w-full sm:text-xl my-[10px] text-sky-800"
                    >
                        Soňky goşulan harytlar
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center ">
                    {this.state.products.map((item) => {
                        return (
                            <Link
                                to={"/products/" + item.id}
                                className="m-1 w-[200px] grid overflow-hidden rounded-lg hover:shadow-lg border shadow-lg
                            duration-200 sm:w-[150px] bg-slate-100"
                            >
                                <img
                                    className="w-full h-[180px] sm:h-[150px] object-cover "
                                    alt=""
                                    src={server + item.img}
                                ></img>
                                <div className="grid m-2">
                                    <label className="text-[12px] content-start  font-bold">
                                        {item.name}
                                    </label>

                                    <label className="text-sky-600 font-bold text-[14px]  ">
                                        {item.price}
                                    </label>
                                    <label className="text-[12px]">
                                        {item.created_at}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="border-b my-1 p-3">
                    <Link
                        to={"/news"}
                        className="text-2xl sm:text-xl  text-sky-800 "
                    >
                        Täze habarlar
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center my-2">
                    {this.state.news.map((item) => {
                        return (
                            <Link
                                to={"/news/" + item.id}
                                className="m-1 w-[250px] grid overflow-hidden rounded-lg hover:shadow-lg border shadow-lg
                            duration-200 sm:w-[150px] bg-slate-100"
                            >
                                <img
                                    className="w-full h-[200px] sm:h-[150px] object-cover"
                                    alt=""
                                    src={server + item.img}
                                ></img>
                                <div className="grid m-2">
                                    <label className="text-[12px]">
                                        {item.created_at}
                                    </label>
                                    <label className="text-[12px]  font-bold">
                                        {String(item.title_tm).substring(0, 80)}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default HomePage;
