import axios from "axios";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { server } from "../../static";
import "./flatDetail.css";
import { BiCalendar, BiPhone, BiStore, BiTime } from "react-icons/bi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { BsLayers, BsPerson, BsShop } from "react-icons/bs";

class FlatDetail extends React.Component {
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
            detail_text: "",
            images: [],
            viewed: 0,
            address: "",
            customerID: "",
            StoreID: "",
            customer_name: "",
        };

        this.setData();
    }

    setData() {
        const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const id = urlParams.get('id')

        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/flats/" + id).then((resp) => {
            document.title = resp.data.name + " " + resp.data.price;
            this.setState({
                name: resp.data["name_tm"],
                location: resp.data["location"],
                viewed: resp.data["viewed"],
                detail_text: resp.data["body_tm"],
                img: resp.data["img"],
                id: resp.data["id"],
                price: resp.data["price"],
                created_at: resp.data["created_at"],
                images: resp.data["images"],
                category: resp.data["category"],
                phone: resp.data["phone"],
                store: resp.data["store"],
                swap: resp.data["swap"],
                credit: resp.data["credit"],
                none_cash_pay: resp.data["none_cash_pay"],
                customerID: resp.data["customer"].id,
                customer_name: resp.data.customer_name,
                customer_id: resp.data.customer_id,
                store_id: resp.data.store_id,
                store_name: resp.data.store_name,
                store_logo: resp.data.store_logo,
                customer_photo: resp.data.customer_photo,
                name: resp.data.name,
                at_floor: resp.data.at_floor,
                floor: resp.data.floor,
                square: resp.data.square,
                room_count: resp.data.room_count,
                description: resp.data.description,
                isLoading: false,
            });
        });
    }

    actions() {
        if (
            String(localStorage.getItem("id")) == String(this.state.customer_id)
        ) {
            return (
                <div className="actions">
                    <a href={"/products/edit/" + this.state.id}>Düzetmek</a>
                    <button
                        onClick={() => {
                            this.deleteProduct();
                        }}
                    >
                        Bozmak
                    </button>
                </div>
            );
        }
    }

    setSliderImg(src) {
        document.getElementById("sliderMainImg").src = server + src;
    }

    render() {
        const customer_page = "/customer/" + this.state.customer_id + "/";
        var default_img_url = "/default.png";
        var main_img = server + this.state.img;

        if (this.state.img === "") {
            main_img = default_img_url;
        }

        let date = this.state.created_at.split(" ")[0];

        return (
            <div className="flat_detail">
                <div className="detailSlider">
                    <a href={main_img} target="_blank">
                        <img
                            id="sliderMainImg"
                            className="w-full h-[400px] border object-contain"
                            src={main_img}
                        ></img>
                    </a>
                    <div className="images">
                        {this.state.images.map((item) => {
                            var img = server + item.img;
                            if (item.img_m === "") {
                                img = default_img_url;
                            }

                            return (
                                <img
                                    onClick={() => {
                                        this.setSliderImg(item.img);
                                    }}
                                    src={img}
                                ></img>
                            );
                        })}
                    </div>
                </div>

                <div className="rows">
                    <label className="name">{this.state.name} </label>
                    {this.state.price !== "" && (
                        <label className="font-bold text-sky-700 text-[22px]">
                            {this.state.price}
                        </label>
                    )}
                    <label>Kategoriýasy: {this.state.category}</label>
                    <label className="">
                        Binadaky gat sany: {this.state.floor}
                    </label>
                    <label className="">
                        Ýerleşýän gaty: {this.state.at_floor}
                    </label>
                    <label className="">
                        Otag sany: {this.state.room_count}
                    </label>
                    <label className="">
                        Meýdany: {this.state.square} m.kw.
                    </label>
                    <label className="">
                        Kredit: {this.state.credit === true ? "Bar" : "Ýok"}
                    </label>
                    <label className="">
                        Nagt däl töleg:{" "}
                        {this.state.none_cash_pay === true ? "Bar" : "Ýok"}
                    </label>
                    <label className="">
                        Çalşyk: {this.state.swap === true ? "Bar" : "Ýok"}
                    </label>

                    <label>{this.state.description}</label>

                    {this.state.store !== "" && (
                        <a
                            className="store action"
                            href={"/stores/" + this.state.store_id}
                        >
                            <img
                                className="store_logo"
                                src={server + this.state.store_logo}
                            ></img>
                            <label>{this.state.store}</label>
                        </a>
                    )}

                    {this.state.phone !== "" && (
                        <a
                            href={"tel:" + this.state.phone}
                            className=" text-green-600 rounded-md w-max hover:bg-slate-200 duration-300"
                        >
                            <BiPhone
                                className="border border-green-600 rounded-full p-[5px] "
                                size={30}
                            ></BiPhone>
                            <label className="ml-[5px] ">
                                {this.state.phone}{" "}
                            </label>
                        </a>
                    )}

                    <div className="view">
                        <BiCalendar size={20}></BiCalendar>
                        <label className="created_at">{date}</label>
                        <FiEye size={20}></FiEye>
                        <label> {this.state.viewed} </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default FlatDetail;
