import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";

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
        window.scrollTo(0, 0);

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

        document.title = resp.data.name;

        this.setState({
            name: resp.data.name,
            location: resp.data.location,
            viewed: resp.data.viewed,
            detail_text: resp.data.body_tm,
            img: resp.data.img,
            id: resp.data.id,
            price: resp.data.price,
            created_at: resp.data.created_at,
            images: resp.data.images,
            category_name: resp.data.category.name,
            category_id: resp.data.category.id,
            address: resp.data.address,
            phone: resp.data.phone,
            made_in: resp.data.made_in,
            store: resp.data.store,
            swap: resp.data.swap,
            amount: resp.data.amount,
            credit: resp.data.credit,
            none_cash_pay: resp.data.none_cash_pay,
            store_id: resp.data.store.id,
            store_name: resp.data.store.name,
            store_logo: resp.data.store.logo,

            isLoading: false,
        });
    }

    render() {
        let date = this.state.created_at.split(" ")[0];

        const responsive = {
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
            <div className="product_detail grid grid-cols-2 sm:grid-cols-1 p-2">
                <div className="grid">
                    <Carousel responsive={responsive}>
                        {this.state.images.map((item) => {
                            return (
                                <img
                                    alt=""
                                    className="h-[500px] sm:h-[300px] object-contain w-full overflow-hidden border rounded-lg"
                                    src={server + item.img_m}
                                ></img>
                            );
                        })}
                    </Carousel>
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

                    <div className="py-4">
                        {this.state.detail_text !== "" && (
                            <p>{this.state.detail_text}</p>
                        )}
                    </div>

                    {this.state.store !== "" && (
                        <Link
                            className="py-[5px] flex my-[2px] duration-200 border-y"
                            to={"/stores/" + this.state.store_id}
                        >
                            <img
                                alt="store-logo"
                                className="w-[60px] border h-[60px] rounded-lg object-cover mx-2 "
                                src={server + this.state.store_logo}
                            ></img>
                            <div className="grid my-auto h-max">
                                <label className="text-[12px]">Dükan</label>
                                <label className="font-bold">
                                    {this.state.store_name}
                                </label>
                            </div>
                        </Link>
                    )}

                    {this.state.phone !== "" ||
                        (this.state.phone == undefined && (
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
                        ))}

                    <div className="flex py-4">
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
