import axios from "axios";
import React from "react";
import { server } from "../../static";
import { Link } from "react-router-dom";
import ProgressIndicator from "../ProgressIndicator";

class AdminStoreCars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            cars: [],
            current_page: 1,
            last_page: 1,
            total: 0,
            stores: [],
            url_params: [],
            filterOpen: false,
            newStoreOpen: false,
            categories: [],
            sizes: [],
            trade_centers: [],
            page_size: 50,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };
        this.getCars();
    }

    getCars() {
        const pathname = window.location.pathname;
        var id = pathname.split("/")[3];
        axios
            .get(server + "/api/adm/cars?store=" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ cars: resp.data.data });
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="grid">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <div className="flex  flex-wrap sm:justify-center ">
                    {this.state.cars.map((item) => {
                        return (
                            <Link
                                to={"/superuser/cars/" + item.id}
                                className="grid  overflow-hidden m-2 border text-[12px] w-[150px] rounded-xl shadow-md relative "
                            >
                                <img
                                    alt=""
                                    className="object-cover w-full h-[150px]"
                                    defaultValue={"/default.png"}
                                    src={server + item.img.img_s}
                                ></img>
                                <div className=" grid p-1">
                                    {item.status === "accepted" && (
                                        <label className="text-[10px] bg-green-600 text-white rounded-full px-1 w-max">
                                            Kabul edilen
                                        </label>
                                    )}
                                    {item.status === "pending" && (
                                        <label className="text-[10px] bg-orange-600 text-white rounded-full px-1 w-max">
                                            Barlagda
                                        </label>
                                    )}
                                    <label className="font-bold">
                                        {item.mark.name} {item.model.name}{" "}
                                        {item.year}{" "}
                                    </label>
                                    <label className="bg-sky-600 text-white rounded-md px-1 font-bold absolute top-1 left-1">
                                        {item.price} TMT
                                    </label>
                                    <label>{item.created_at}</label>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="imageCard">
                    <input
                        onChange={() => {
                            this.addSelectedImages();
                        }}
                        id="imgselector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        hidden
                        type="file"
                    ></input>
                </div>
            </div>
        );
    }
}

export default AdminStoreCars;
