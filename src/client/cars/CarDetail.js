import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import "./car_detail.css";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { AiFillShop } from "react-icons/ai";
import { Link } from "react-router-dom";
import ImageViewer from "../components/ImageViewer";

class CarDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            productID: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            images: [],
            store_id: "",
            customer_name: "",
            sliderImages: [],
            sliderIndex: 0,
            imgViewer: false,

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    delete() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === true) {
            axios
                .post(server + "/mob/cars/delete/" + this.state.id)
                .then((resp) => {
                    window.history.back();
                });
        }
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/cars/" + id).then((resp) => {
            document.title =
                resp.data.mark + " " + resp.data.model + " " + resp.data.year;

            this.setState({
                mark: resp.data.mark,
                model: resp.data.model,
                price: resp.data.price,
                color: resp.data.color,
                credit: resp.data.credit,
                swap: resp.data.swap,
                none_cash_pay: resp.data.none_cash_pay,
                fuel: resp.data.fuel,
                body_type: resp.data.body_type,
                id: resp.data.id,
                millage: resp.data.millage,
                on_search: resp.data.on_search,
                transmission: resp.data.transmission,
                vin: resp.data.vin,
                year: resp.data.year,
                recolored: resp.data.recolored,
                engine: resp.data.engine,
                location: resp.data.location,
                viewed: resp.data.viewed,
                detail: resp.data.detail,
                img: resp.data.img.img_m,
                created_at: resp.data.created_at,
                images: resp.data.images,
                phone: resp.data.phone,
                country: resp.data.country,
                store_id: resp.data.store.id,
                store_name: resp.data.store.name,
                customer_id: resp.data.customer.id,
                customer_name: resp.data.customer.name,
                isLoading: false,
            });
            const images = [];
            resp.data.images.map((item) => {
                images.push(server + item.img_m);
            });
            this.setState({ sliderImages: images });
        });
    }

    setSliderImg(src) {
        document.getElementById("sliderMainImg").src = server + src;
    }

    render() {
        return (
            <div className="p-4 max-w-[600px] mx-auto">
                <ImageViewer
                    parent={this}
                    src={this.state.imgViewerSrc}
                    show={this.state.imgViewer}
                    images={this.state.sliderImages}
                    index={this.state.sliderIndex}
                ></ImageViewer>

                {this.state.store_name !== undefined && (
                    <div className="store flex items-center rounded-md  duration-100 ">
                        <img alt="" className="store_img"></img>
                        <div className="grid h-max">
                            <label className="text-[11px]">Dükan</label>
                            <Link
                                to={"/stores/" + this.state.store_id}
                                className="text-[25px] hover:text-sky-300"
                            >
                                {this.state.store_name}
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex items-center flex-wrap">
                    <label className="font-bold text-[22px]">
                        {this.state.mark} {this.state.model} {this.state.year}
                    </label>
                </div>
                <label className="text-[22px] font-bold text-sky-700 py-[2] ">
                    {this.state.price}
                </label>

                <div className="flex items-center">
                    <div className="flex items-center mr-[10px]">
                        <FiEye size={20}></FiEye>
                        <label> {this.state.viewed} </label>
                    </div>
                    <div className="flex items-center mr-[10px]">
                        <BiCalendar size={20}></BiCalendar>
                        <label className="created_at">
                            {this.state.created_at}
                        </label>
                    </div>
                    <div></div>
                </div>

                <div className="mySlider grid">
                    <img
                        onClick={() => {
                            this.setState({
                                imgViewer: true,
                                sliderIndex: 0,
                            });
                        }}
                        id="sliderMainImg"
                        alt=""
                        ref={"sliderMainImg"}
                        className="mainImg w-full border my-2 sm:h-[250px] h-[400px] object-cover rounded-lg"
                        src={server + this.state.img}
                    ></img>

                    <div className="flex flex-wrap overflow-x-auto justify-center">
                        {this.state.images.map((item, index) => {
                            return (
                                <div className="" key={item.id}>
                                    <img
                                        alt=""
                                        className="max-w-none m-[2px] hover:shadow-2xl duration-200 
                                                    object-cover h-[100px] w-[100px] rounded-lg"
                                        onClick={() => {
                                            this.setState({
                                                imgViewerSrc:
                                                    server + item.img_m,
                                                imgViewer: true,
                                                sliderIndex: index,
                                            });
                                        }}
                                        src={server + item.img_s}
                                    ></img>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid text-slate-700 py-[10px] bg-slate-100 rounded-lg p-4 my-2">
                    <div>
                        <label className="key">Marka we model:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.mark} {this.state.model}
                        </label>
                    </div>
                    <div>
                        <label className="key">Bahasy:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.price}
                        </label>
                    </div>
                    <div>
                        <label className="key">Ýyly:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.year}
                        </label>
                    </div>
                    <div>
                        <label className="key">Ýangyjy:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.fuel}
                        </label>
                    </div>
                    <div>
                        <label className="key">Geçen ýoly:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.millage} km
                        </label>
                    </div>
                    <div>
                        <label className="key">Transmissiýa:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.transmission}
                        </label>
                    </div>
                    <div>
                        <label className="key">VIN kody:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.vin}
                        </label>
                    </div>
                    <div>
                        <label className="key">Ýerleşýän ýeri:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.location}
                        </label>
                    </div>

                    <div>
                        <label className="key">Reňki:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.color}
                        </label>
                    </div>
                    <div>
                        <label className="key">Kuzowyň görnüşi:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.body_type}
                        </label>
                    </div>
                    <div>
                        <label className="key">Motory:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.engine}
                        </label>
                    </div>
                    <div>
                        <label className="key">Satyjy:</label>
                        <Link
                            className="value ml-[10px] font-bold"
                            to={"/customers/" + this.state.customer_id}
                        >
                            {this.state.customer_name}
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <label className="key">Çalşyk:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.swap === true ? "Hawa" : "Ýok"}
                        </label>
                    </div>
                    <div className="flex items-center">
                        <label className="key">Kredit:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.credit === true ? "Bar" : "Ýok"}
                        </label>
                    </div>
                    <div className="flex items-center">
                        <label className="key">Nagt däl töleg:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.none_cash_pay === true ? "Bar" : "Ýok"}
                        </label>
                    </div>
                    <div className="flex items-center">
                        <label className="key">Reňki üýtgedilen:</label>
                        <label className="value ml-[10px] font-bold">
                            {this.state.recolored === true ? "Hawa" : "Ýok"}
                        </label>
                    </div>

                    {this.state.phone !== "" && (
                        <a
                            href={"tel:" + this.state.phone}
                            className="bg-green-500 p-[5px] text-white duration-100  hover:bg-green-700
                            my-[5px] flex items-center border rounded-md justify-center w-max px-2"
                        >
                            <BiPhone
                                className="mx-[2px] rounded-full p-[5px] "
                                size={30}
                            ></BiPhone>
                            <label>{this.state.phone} </label>
                        </a>
                    )}

                    {(this.state.detail !== "") |
                        (this.state.detail !== undefined) && (
                        <p>{this.state.detail}</p>
                    )}
                </div>
            </div>
        );
    }
}

export default CarDetail;
