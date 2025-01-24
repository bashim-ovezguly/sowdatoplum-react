import axios from "axios";
import React from "react";
import { server } from "../../static";
import ImageViewer from "../components/ImageViewer";
import { MotionAnimate } from "react-motion-animate";

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

        axios.get(server + "/stores/" + id).then((resp) => {
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
                location_name: resp.data.location.name,
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
                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        var img = server + item.img_m;

                        return (
                            <div className="m-1">
                                <MotionAnimate>
                                    <img
                                        onClick={() => {
                                            this.setState({
                                                imgViewerSrc:
                                                    server + item.img_m,
                                                imgViewer: true,
                                            });
                                        }}
                                        className="h-[300px] sm:h-[150px] aspect-square border w-full object-cover rounded-md overflow-hidden"
                                        key={item.id}
                                        alt=""
                                        src={img}
                                    ></img>
                                </MotionAnimate>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default StoreImages;
