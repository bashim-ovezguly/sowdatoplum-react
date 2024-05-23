import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./storesDetail.css";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";

class StoreProducts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            id: "",
            workStart: "",
            workEnd: "",
            category: "",
            name: "",
            location: "",
            img: "",
            created_at: "",
            detail_text: "",
            images: [],
            products: [],
            viewed: 0,
            size: "",
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

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    render() {
        return (
            <div className="grid">
                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setProductsPage(page);
                    }}
                    count={this.state.products_total_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-between">
                    {this.state.products.map((item) => {
                        var img = server + item.img;
                        if (item.img.length === 0) {
                            img = "/default.png";
                        }
                        return (
                            <Link
                                to={"/products/" + item.id}
                                className="grid w-[150px] m-[10px] border rounded-md overflow-hidden"
                                key={item.id}
                            >
                                <img
                                    className="w-[100%] h-[150px] object-cover"
                                    alt=""
                                    src={img}
                                ></img>
                                <label className="name text-[12px] m-[5px]">
                                    {item.name}
                                </label>
                                {this.state.price !== "0 TMT" && (
                                    <label className="price text-[14px] m-[5px] font-bold text-blue-700">
                                        {item.price}
                                    </label>
                                )}
                            </Link>
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
