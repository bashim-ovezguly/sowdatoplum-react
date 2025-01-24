import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";
import ImageViewer from "../components/ImageViewer";

class FlatDetail extends React.Component {
    apiUrl = server + "/mob/flats/";
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
        };

        this.setData();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(this.apiUrl + id).then((resp) => {
            document.title = resp.data.name;

            this.setState({
                name: resp.data.name,
                price: resp.data.price,
                id: resp.data.id,
                floor: resp.data.floor,
                room_count: resp.data.room_count,
                at_floor: resp.data.at_floor,
                category_name: resp.data.category.name,
                location_name: resp.data.location.name,
                location_id: resp.data.location.id,
                viewed: resp.data.viewed,
                description: resp.data.description,
                img: resp.data.img,
                created_at: resp.data.created_at,
                images: resp.data.images,
                phone: resp.data.phone,
                store_id: resp.data.store.id,
                store_name: resp.data.store.name,
                store_logo: resp.data.store.logo,
                isLoading: false,
            });

            const images = [];
            resp.data.images.map((item) => {
                images.push(server + item.img);
            });
            this.setState({ sliderImages: images });
        });
    }

    setSliderImg(src) {
        document.getElementById("sliderMainImg").src = server + src;
    }

    render() {
        return (
            <div className="p-4 grid-cols-2 grid sm:grid-cols-1">
                <div className="grid h-max">
                    <ImageViewer
                        parent={this}
                        src={this.state.imgViewerSrc}
                        show={this.state.imgViewer}
                        images={this.state.sliderImages}
                        index={this.state.sliderIndex}
                    ></ImageViewer>

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
                        className="mainImg w-full border my-2 sm:h-[250px] h-[400px] object-cover 
                            overflow-hidden rounded-lg"
                        src={server + this.state.img}
                    ></img>

                    <div className="grid grid-cols-3 sm:grid-cols-2 h-max">
                        {this.state.images.map((item, index) => {
                            return (
                                <div className="m-2" key={item.id}>
                                    <img
                                        alt=""
                                        className="max-w-none overflow-hidden hover:shadow-2xl duration-200 
                                                    object-cover h-[150px] w-full rounded-lg"
                                        onClick={() => {
                                            this.setState({
                                                imgViewerSrc:
                                                    server + item.img_m,
                                                imgViewer: true,
                                                sliderIndex: index,
                                            });
                                        }}
                                        src={server + item.img}
                                    ></img>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid m-2 h-max text-slate-700 py-[10px] shadow-md border rounded-lg p-2 ">
                    <div className="flex items-center flex-wrap">
                        <label className="font-bold text-[22px]">
                            {this.state.name}
                        </label>
                    </div>

                    {this.price > 0 && (
                        <label className="text-[22px] font-bold text-sky-400 py-[2] ">
                            {this.state.price} TMT
                        </label>
                    )}

                    {(this.state.detail !== "") |
                        (this.state.detail !== undefined) && (
                        <p>{this.state.detail}</p>
                    )}

                    {this.state.store_name !== undefined && (
                        <Link
                            to={"/stores/" + this.state.store_id}
                            className="store flex items-center rounded-md border my-2 duration-100 text-[16px] hover:bg-slate-100"
                        >
                            <img
                                alt=""
                                src={server + this.state.store_logo}
                                className="store_img w-[50px] h-[50px] overflow-hidden rounded-full m-1"
                            ></img>
                            <div className="grid h-max">
                                <div className="hover:text-sky-300">
                                    {this.state.store_name}
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="view flex items-center justify-end">
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
                    </div>

                    <div className="my-3 ">
                        <label className="text-sky-600">Häsiýetnamasy</label>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Bahasy:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.price}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Kategoriýasy:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.category_name}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýerleşýän ýeri:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.location_name}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýerleşýän gaty:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.floor}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Bina gaty:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.at_floor}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Otag sany:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.room_count}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Çalşyk:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.swap === true ? "Hawa" : "Ýok"}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Kredit:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.credit === true ? "Bar" : "Ýok"}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Nagt däl töleg:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.none_cash_pay === true
                                    ? "Bar"
                                    : "Ýok"}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Reňki üýtgedilen:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.recolored === true ? "Hawa" : "Ýok"}
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-b py-2">
                            <label>Telefon belgisi:</label>
                            {this.state.phone !== "" && (
                                <a
                                    href={"tel:" + this.state.phone}
                                    className="text-green-500 font-bold duration-100  hover:text-green-700
                                            my-1 flex items-center border rounded-md justify-center w-max px-2"
                                >
                                    <BiPhone
                                        className="mx-[2px] rounded-full p-[5px] "
                                        size={30}
                                    ></BiPhone>
                                    <label>{this.state.phone} </label>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FlatDetail;
