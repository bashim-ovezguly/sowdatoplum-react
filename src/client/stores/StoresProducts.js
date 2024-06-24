import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { BiBasket } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";

class StoreProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            viewed: 0,
            center: "",
            address: "",
            customer_id: "",
            customer_name: "",
            phones: [],
            cars: [],
            materials: [],
            contacts: [],
            page_size: 20,
            products_page: "",
            products_count: "",
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

    addToBasket(id) {
        let tempArray = [];
        let exist = false;
        const product = { id: id, amount: 1 };

        if (
            (localStorage.getItem("basket") != null) &
            (localStorage.getItem("basket") !== "")
        ) {
            tempArray = JSON.parse(localStorage.getItem("basket"));
        }

        tempArray.filter((item) => {
            if (item !== "") {
                if (item.id === id) {
                    exist = true;
                }
            }
        });

        if (exist === false) {
            tempArray.push(product);
            toast.success("Sebede goşuldy");
        } else {
            toast.info("Eýýäm sebetde bar");
        }
        localStorage.setItem("basket", JSON.stringify(tempArray));
        this.setState({ basketSize: tempArray.length });
    }

    render() {
        return (
            <div className="grid">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>

                <Link
                    to={"/stores/" + this.state.id + "/basket"}
                    className="fixed bottom-14 right-10"
                >
                    <label className="bg-green-600 rounded-full px-2 absolute top--1 text-white">
                        {this.state.basketSize}
                    </label>
                    <FiShoppingCart
                        size={70}
                        className=" rounded-2xl bg-sky-600 text-white shadow-lg p-2"
                    ></FiShoppingCart>
                </Link>

                <Pagination
                    className="mx-auto"
                    onChange={(event, page) => {
                        this.setProductsPage(page);
                    }}
                    count={this.state.products_total_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="grid grid-cols-4 sm:grid-cols-2">
                    {this.state.products.map((item) => {
                        var img = server + item.img;
                        if (item.img.length === 0) {
                            img = "/default.png";
                        }
                        return (
                            <div
                                className="grid m-2 border rounded-md overflow-hidden bg-slate-100 hover:shadow-lg duration-200"
                                key={item.id}
                            >
                                <Link to={"/products/" + item.id}>
                                    <img
                                        className="w-[100%] h-[200px] object-cover"
                                        alt=""
                                        src={img}
                                    ></img>
                                </Link>
                                <div className="p-2 grid text-[14px] sm:text-[12px]">
                                    <label className="font-bold ">
                                        {item.name}
                                    </label>
                                    {item.price !== "0 TMT" && (
                                        <label className="price font-bold text-blue-700">
                                            {item.price}
                                        </label>
                                    )}
                                    <button
                                        onClick={() => {
                                            this.addToBasket(item.id);
                                        }}
                                        className="bg-green-600 text-white rounded-md p-1 hover:bg-green-400 duration-200"
                                    >
                                        Sebede goşmak
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/stores/" + id).then(
            (resp) => {
                document.title = resp.data.name_tm;
                this.setState({
                    name: resp.data.name_tm,
                    body_tm: resp.data.body_tm,
                    location: resp.data.location,
                    viewed: resp.data.viewed,
                    detail_text: resp.data.body_tm,
                    img: resp.data.img,
                    created_at: resp.data.created_at,
                    images: resp.data.images,
                    category: resp.data.category,
                    center: resp.data.center,
                    size: resp.data.size,
                    address: resp.data.address,
                    phones: resp.data.phones,
                    customer_id: resp.data.customer_id,
                    customer_phone: resp.data.customer_phone,
                    customer_name: resp.data.customer.name,
                    location_name: resp.data.location_name,
                    id: resp.data.id,
                    contacts: resp.data.contacts,
                    isLoading: false,
                });
            },
            (resp) => {}
        );

        axios
            .get(
                server +
                    "/mob/products?page_size=" +
                    String(this.state.page_size) +
                    "&store=" +
                    id
            )
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ products_count: resp.data.count });
                this.setState({ products_total_page: resp.data.total_page });
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
