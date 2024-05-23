import axios from "axios";
import React, { useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";

// import { initLightboxJS } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox } from "lightbox.js-react";

class ProductDetail extends React.Component {
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

            sliderCurrentImage: 0,
        };

        // document.title = 'Dükanlar';
    }

    componentDidMount() {
        this.setData();
        // var elem = document.getElementById("og:title");
        // elem.setAttribute("content", this.state.name);
        // console.log(elem, this.state.name);
    }

    async setData() {
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const id = urlParams.get('id')

        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        const resp = await axios.get(server + "/mob/products/" + id);

        document.title = resp.data.name_tm;

        this.setState({
            name: resp.data.name_tm,
            location: resp.data.location,
            viewed: resp.data.viewed,
            detail_text: resp.data.body_tm,
            img: resp.data.img,
            id: resp.data.id,
            price: resp.data.price,
            created_at: resp.data.created_at,
            images: resp.data.images,
            category: resp.data.category,
            address: resp.data.address,
            phone: resp.data.phone,
            made_in: resp.data.made_in,
            store: resp.data.store,
            swap: resp.data.swap,
            amount: resp.data.amount,
            credit: resp.data.credit,
            none_cash_pay: resp.data.none_cash_pay,
            customerID: resp.data.customer.id,
            customer_name: resp.data.customer_name,
            unit: resp.data.unit,
            factory: resp.data.factory,
            customer_id: resp.data.customer_id,
            store_id: resp.data.store_id,
            store_name: resp.data.store_name,
            brand: resp.data.brand,
            store_logo: resp.data.store_logo,
            customer_photo: resp.data.customer_photo,
            isLoading: false,
        });
    }

    render() {
        var default_img_url = "/default.png";
        var main_img = server + this.state.img;

        if (this.state.img === "") {
            main_img = default_img_url;
        }

        let date = this.state.created_at.split(" ")[0];

        return (
            <div className="product_detail grid grid-cols-2 sm:grid-cols-1 p-[20px]">
                <div className="grid">
                    {/* <SlideshowLightbox
                        open={true}
                        className="container grid grid-cols-3 gap-2 mx-auto"
                    >
                        {this.state.images.map((item) => {
                            console.log(server + item.img_m);
                            return (
                                <img
                                    className="rounded-md border w-[100px] h-[100px] m-[5px]"
                                    alt=""
                                    src={server + item.img_m}
                                ></img>
                            );
                        })}
                    </SlideshowLightbox> */}

                    <img
                        alt=""
                        className="h-[400px] mx-auto w-full border object-contain "
                        src={main_img}
                    ></img>

                    <div className="flex flex-wrap my-[10px]">
                        {this.state.images.map((item) => {
                            return (
                                <a href={server + item.img_m} key={item.id}>
                                    <img
                                        className="rounded-md border w-[100px] h-[100px] m-[5px]"
                                        alt=""
                                        src={server + item.img_s}
                                    ></img>
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="grid h-max px-[10px]">
                    <div className="grid mx-[5px]">
                        <label className="font-bold text-[25px] ">
                            {}
                            {this.state.name}{" "}
                        </label>
                        {this.state.category !== "" && (
                            <label className="text-12px">
                                {this.state.category}{" "}
                            </label>
                        )}
                    </div>

                    <label className="font-bold text-sky-600 text-[22px] py-[10px]">
                        {this.state.price} TMT
                    </label>

                    <div className="py-[10px]">
                        {this.state.detail_text !== "" && (
                            <p>{this.state.detail_text}</p>
                        )}
                    </div>

                    {this.state.store !== "" && (
                        <Link
                            className="py-[5px] flex my-[2px] border-y hover:bg-slate-200 duration-200"
                            to={"/stores/" + this.state.store_id}
                        >
                            <img
                                alt="store-logo"
                                className="w-[60px] border h-[60px] rounded-full object-cover mx-[5px] "
                                src={server + this.state.store_logo}
                            ></img>
                            <div className="grid">
                                <label className="text-[10px]">Dükan</label>
                                <label className="font-bold">
                                    {this.state.store}
                                </label>
                            </div>
                        </Link>
                    )}

                    {this.state.phone !== "" && (
                        <a
                            href={"tel:" + this.state.phone}
                            className="flex border-y items-center py-[10px] text-green-600 "
                        >
                            <BiPhone
                                className="rounded-full border-green-600 border p-[5px]"
                                size={30}
                            ></BiPhone>
                            <label className="mx-[5px]">
                                {this.state.phone}{" "}
                            </label>
                        </a>
                    )}

                    <div className="flex py-[10px]">
                        <div className="flex items-center mx-2">
                            <FiEye size={20}></FiEye>
                            <label> {this.state.viewed} </label>
                        </div>
                        <div className="flex items-center mx-2">
                            <BiCalendar size={20}></BiCalendar>
                            <label className="created_at">{date}</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDetail;
