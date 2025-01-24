import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar, BiMap, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
// import { Carousel } from "react-responsive-carousel";

class CarDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: [],
            sliderImages: [],
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
                resp.data.mark.name +
                " " +
                resp.data.model.name +
                " " +
                resp.data.year;

            this.setState({
                id: resp.data.id,
                mark: resp.data.mark.name,
                model: resp.data.model.name,
                price: resp.data.price,
                color: resp.data.color.name,
                credit: resp.data.credit,
                swap: resp.data.swap,
                none_cash_pay: resp.data.none_cash_pay,
                fuel: resp.data.fuel.name,
                body_type: resp.data.body_type.name,
                millage: resp.data.millage,
                transmission: resp.data.transmission.name,
                vin: resp.data.vin,
                year: resp.data.year,
                recolored: resp.data.recolored,
                engine: resp.data.engine,
                location: resp.data.location.name,
                viewed: resp.data.viewed,
                detail: resp.data.detail,
                img: resp.data.img.img_m,
                created_at: resp.data.created_at,
                images: resp.data.images,
                phone: resp.data.phone,
                store_name: resp.data.store.name,
                store_id: resp.data.store.id,
                store_logo: resp.data.store.logo,
                isLoading: false,
            });

            try {
                this.setState({ wd: resp.data.wd.name });
            } catch (error) {}

            const images = [];
            resp.data.images.map((item) => {
                images.push(server + item.img_m);
            });
            this.setState({ sliderImages: images });
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
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
            <div className=" grid-cols-2 grid sm:grid-cols-1 not-sm:p-2">
                <div className="grid h-max m-2 p-2">
                    <Carousel className="border" responsive={responsive}>
                        {this.state.images.map((item) => {
                            return (
                                <img
                                    alt=""
                                    className="h-[500px] sm:h-[300px] object-cover w-full overflow-hidden"
                                    src={server + item.img_m}
                                ></img>
                            );
                        })}
                    </Carousel>
                </div>

                <div className="grid h-max text-slate-700 py-[10px] p-4  text-[14px] max-w-[400px]">
                    <div className="flex items-center flex-wrap">
                        <label className="font-bold text-[22px]">
                            {this.state.mark} {this.state.model}{" "}
                            {this.state.year}
                        </label>
                    </div>

                    <label className="text-[22px] font-bold text-sky-600 py-[2] ">
                        {this.state.price} TMT
                    </label>

                    <div className="flex justify-start items-center">
                        <BiMap size={20}></BiMap>
                        <label>{this.state.location}</label>
                    </div>

                    <div className="flex items-center mr-[10px]">
                        <FiEye size={20}></FiEye>
                        <label className="mx-1"> {this.state.viewed} </label>
                    </div>
                    <div className="flex items-center mr-[10px]">
                        <BiCalendar size={20}></BiCalendar>
                        <label id="created_at" className="mx-1">
                            {this.state.created_at}
                        </label>
                    </div>

                    {(this.state.detail !== "") |
                        (this.state.detail !== undefined) && (
                        <p>{this.state.detail}</p>
                    )}

                    {this.state.store_name !== undefined && (
                        <Link
                            to={"/stores/" + this.state.store_id + "/cars"}
                            className="store flex items-center border my-2 duration-100 text-[16px] hover:shadow-xl"
                        >
                            <img
                                alt=""
                                src={server + this.state.store_logo}
                                className="store_img w-[50px] h-[50px] overflow-hidden rounded-2xl m-1"
                            ></img>
                            <div className="grid h-max">
                                <label className="text-[13px]">Dükan</label>
                                <div className="">{this.state.store_name}</div>
                            </div>
                        </Link>
                    )}

                    {this.state.phone !== "" && (
                        <a
                            href={"tel:" + this.state.phone}
                            className="bg-green-600 rounded-lg my-2 text-white p-2 flex items-center 
                            justify-center text-[16px] duration-300 hover:bg-sky-600"
                        >
                            <BiPhone
                                className="mx-[2px] rounded-full p-[5px] "
                                size={30}
                            ></BiPhone>
                            <label>{this.state.phone} </label>
                        </a>
                    )}

                    <div className="my-3 shadow-md rounded-lg border p-4">
                        <label className="font-bold text-sky-600">
                            Häsiýetnamasy
                        </label>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Marka we model:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.mark} {this.state.model}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýyly:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.year}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Bahasy:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.price} TMT
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýangyjy:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.fuel}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Geçen ýoly:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.millage} km
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Transmissiýa:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.transmission}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýerleşýän ýeri:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.location}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Reňki:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.color}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Kuzowyň görnüşi:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.body_type}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Ýörediji görnüşi:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.wd}
                            </label>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <label className="key">Motory:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.engine}
                            </label>
                        </div>

                        <div className="flex justify-between border-b py-2">
                            <label className="key">Obmen:</label>
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
                            <label className="key">VIN kody:</label>
                            <label className="value ml-[10px] font-bold">
                                {this.state.vin}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CarDetail;
