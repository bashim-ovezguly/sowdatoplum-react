import axios from "axios";
import React from "react";
import { server } from "../../static";
import { CircularProgress, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import StoreBasket from "./StoreBasket";
import { MdShoppingCart } from "react-icons/md";
import ProgressIndicator from "../../admin/ProgressIndicator";
import { MotionAnimate } from "react-motion-animate";

class StoreProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: [],
            products: [],
            page_size: 20,
            products_page: "",
            products_count: "",
            basket_items: [],
            id: window.location.pathname.split("/")[2],
        };

        this.setData();
    }

    componentDidMount() {
        if (localStorage.getItem("basket") != undefined) {
            this.setState({
                basketSize: JSON.parse(localStorage.getItem("basket")).length,
            });
        }
    }

    add_new_item_to_basket(item) {
        let tempArray = this.state.basket_items;

        const product = {
            id: item.id,
            name: item.name,
            img: item.img,
            price: item.price,
            amount: 1,
        };

        const result = tempArray.filter((item) => item.id === product.id);
        if (result.length === 0) {
            tempArray.push(product);
        }

        this.setState({ basket_items: tempArray });
    }

    render() {
        return (
            <MotionAnimate>
                <div className="grid">
                    <ProgressIndicator
                        open={this.state.isLoading}
                    ></ProgressIndicator>
                    <button
                        onClick={() => {
                            this.setState({ showBasket: true });
                        }}
                        to={"/stores/" + this.state.id + "/basket"}
                        className="fixed bottom-14 right-0"
                    >
                        <label className="bg-green-600 rounded-full text-[22px] px-2 absolute top-0 right-0 text-white">
                            {this.state.basket_items.length}
                        </label>
                        <MdShoppingCart
                            size={60}
                            className=" rounded-lg bg-appColor text-white shadow-lg p-2 m-2"
                        ></MdShoppingCart>
                    </button>

                    {this.state.showBasket && (
                        <StoreBasket
                            store={localStorage.getItem("user_id")}
                            parent={this}
                            sender={localStorage.getItem("user_id")}
                            accepter={this.state.id}
                            items={this.state.basket_items}
                        ></StoreBasket>
                    )}
                    <Pagination
                        className="m-2"
                        onChange={(event, page) => {
                            this.setProductsPage(page);
                        }}
                        count={this.state.products_total_page}
                        variant="outlined"
                        shape="rounded"
                    />

                    <div className="flex flex-wrap ">
                        {this.state.products.map((item) => {
                            var img = server + item.img;
                            if (item.img.length === 0) {
                                img = "/default.png";
                            }
                            return (
                                <div
                                    className="grid m-2 w-[200px]  sm:w-[150px] h-max bg-white rounded-md 
                                    text-[11px] shadow-lg border duration-200 sm:mx-auto p-2"
                                    key={item.id}
                                >
                                    <Link to={"/products/" + item.id}>
                                        <img
                                            className="w-full aspect-square border object-cover rounded-md"
                                            alt=""
                                            src={img}
                                        ></img>
                                    </Link>

                                    <div className="grid text-[14px] sm:text-[14px]">
                                        <label className=" font-bold line-clamp-1">
                                            {item.name}
                                        </label>
                                        <label className="font-bold rounded-md  text-appColor">
                                            {item.price} TMT
                                        </label>

                                        <button
                                            onClick={() => {
                                                this.add_new_item_to_basket(
                                                    item
                                                );
                                            }}
                                            className="bg-green-600 text-white rounded-md p-1 hover:bg-green-400 duration-200 
                                        flex items-center justify-center text-center"
                                        >
                                            <label>Sebede goşmak</label>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </MotionAnimate>
        );
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios
            .get(
                server +
                    "/mob/products?page_size=" +
                    String(this.state.page_size) +
                    "&store=" +
                    id
            )
            .then((resp) => {
                this.setState({
                    id: id,
                    products: resp.data.data,
                    products_count: resp.data.count,
                    products_total_page: resp.data.total_page,
                    isLoading: false,
                });
            });
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
}

export default StoreProducts;
