import axios from "axios";
import React, { createElement, createRef, useRef } from "react";
import { server } from "../../static";
import ReactDOM from "react-dom";
import ImageViewer from "../components/ImageViewer";
import { BiMinus, BiPlus } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

class StoreBasket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            total: 0,
        };

        this.setData();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    setData() {
        let basket = JSON.parse(localStorage.getItem("basket"));
        if (basket === undefined || basket == null) {
            return null;
        }

        basket.map((item) => {
            if (item !== "") {
                let tempArray = this.state.products;
                const fetch = async () => {
                    const resp = await axios.get(
                        server + "/mob/products/" + item.id
                    );
                    tempArray.push({
                        id: resp.data.id,
                        img: resp.data.img,
                        name: resp.data.name,
                    });
                    this.setState({ products: tempArray });
                };
                fetch();
            }
        });
    }
    removeItem(index) {
        let products = this.state.products;
        products.splice(index, 1);
        this.setState({ products: products });
        localStorage.setItem("basket", JSON.stringify(products));
    }

    clear() {
        localStorage.removeItem("basket");
        this.setState({ products: [] });
    }

    render() {
        return (
            <div className="">
                <label>Sebet</label>
                <div className="flex items-center">
                    <label>{this.state.total} TMT</label>
                </div>
                <div className="grid">
                    {this.state.products.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-[max-content_auto] bg-slate-100  overflow-hidden m-2 
                            rounded-lg border text-[12px] shadow-md"
                            >
                                <img
                                    alt=""
                                    className="w-[120px]  h-[120px] object-cover"
                                    src={server + item.img}
                                ></img>
                                <div className="grid p-2 sm:text-[11px] content-start h-max">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>

                                    <label>{item.price} TMT </label>

                                    <div className="flex items-center">
                                        <BiMinus
                                            onClick={() => {
                                                this.decrement(
                                                    item.id,
                                                    item.amount
                                                );
                                            }}
                                            className="bg-yellow-600 text-white p-1 rounded-lg m-1 hover:bg-slate-400"
                                            size={25}
                                        ></BiMinus>
                                        <label className="mx-1 text-center">
                                            {item.amount} sany
                                        </label>
                                        <BiPlus
                                            onClick={() => {
                                                this.increment(
                                                    item.id,
                                                    item.amount
                                                );
                                            }}
                                            className="bg-yellow-600 text-white p-1 rounded-lg m-1 hover:bg-slate-400"
                                            size={25}
                                        ></BiPlus>

                                        <label className="mx-2"> </label>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => {
                                                this.removeItem(index);
                                            }}
                                            className="border rounded-lg m-1 flex items-center p-1 hover:bg-slate-200 w-max float-end"
                                        >
                                            <BsTrash></BsTrash>
                                            <label>Bozmak</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center text-[14px] justify-end">
                    <button className="rounded-md p-1 bg-green-600 text-white hover:bg-slate-400 duration-200 m-1">
                        Tassyklamak
                    </button>

                    <button
                        onClick={() => {
                            this.clear();
                        }}
                        className="rounded-md p-1 bg-orange-600 text-white hover:bg-slate-400 duration-200 m-1"
                    >
                        Arassalamak
                    </button>
                </div>
            </div>
        );
    }
}

export default StoreBasket;
