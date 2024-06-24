import axios from "axios";
import React, { createElement, createRef, useRef } from "react";
import { server } from "../../static";
import ReactDOM from "react-dom";
import ImageViewer from "../components/ImageViewer";

class StoreImages extends React.Component {
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
            sliderImages: [],
            imgViewer: false,
        };

        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/stores/" + id).then((resp) => {
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

            const sliderImages = [];
            resp.data.images.map((item) => {
                sliderImages.push(server + item.img_m);
            });
            this.setState({ sliderImages: sliderImages });
        });

        axios.get(server + "/mob/cars?store=" + id).then((resp) => {
            this.setState({ cars: resp.data.data });
        });

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

    actions() {
        if (localStorage.getItem("logged_in") !== "true") {
            return null;
        }
    }

    deleteStore() {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(server + "/mob/stores/delete/" + this.state.id)
            .then((resp) => {
                window.history.back();
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

    render() {
        return (
            <div className="">
                <ImageViewer
                    show={this.state.imgViewer}
                    parent={this}
                    index={0}
                    src={this.state.imgViewerSrc}
                    images={this.state.sliderImages}
                ></ImageViewer>
                <div className="grid grid-cols-3 sm:grid-cols-2">
                    {this.state.images.map((item) => {
                        var img = server + item.img_m;

                        return (
                            <div className="m-1">
                                <img
                                    onClick={() => {
                                        this.setState({
                                            imgViewerSrc: server + item.img_m,
                                            imgViewer: true,
                                        });
                                    }}
                                    className="max-h-[300px] border w-full object-contain rounded-md overflow-hidden"
                                    key={item.id}
                                    alt=""
                                    src={img}
                                ></img>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default StoreImages;
