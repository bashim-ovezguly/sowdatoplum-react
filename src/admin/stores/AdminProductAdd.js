import axios from "axios";
import React from "react";
import { server } from "../../static";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import ProgressIndicator from "../ProgressIndicator";

export default class AdminProductAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            all_locations: [],

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
            selectedImgUrl: "",

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };
    }
    componentWillReceiveProps(props) {
        this.setState({ store_id: props.store_id });
    }

    setData() {
        axios.get(server + "/mob/index/product").then((resp) => {
            this.setState({ categories: resp.data.categories });
        });
    }
    componentDidMount() {
        this.setData();
    }

    close() {
        this.props.parent.setState({ add_product_open: false });
    }

    saveProducts() {
        var formdata = new FormData();

        this.setState({ isLoading: true });

        formdata.append("store", this.state.store_id);
        formdata.append("category", document.getElementById("category").value);
        formdata.append("price", document.getElementById("price").value);

        formdata.append(
            "name",
            document.getElementById("new_product_name").value
        );
        let images = document.getElementById("productImgSelector").files;
        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        if (document.getElementById("active").checked) {
            formdata.append("status", "accepted");
        } else {
            formdata.append("status", "pending");
        }

        axios
            .post(server + "/mob/products", formdata)
            .then((resp) => {
                this.setData();
                toast.success(images.length + " sany täze haryt goşuldy");
                this.props.parent.setData();
                this.close();
            })
            .catch((err) => {
                alert(err);
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });

        // this.props.parent.setState({ isLoading: true });

        // this.props.parent.setState({ add_product_open: false });
    }

    render() {
        if (this.props.open === false) {
            return null;
        }

        return (
            <div
                style={{ zIndex: 10 }}
                className="bg-black/40 w-full h-full fixed top-0"
            >
                <div className="grid absolute mx-auto left-0 right-0 top-[10%] max-w-[300px] bg-white shadow-lg rounded-2xl p-4 border z-10">
                    <ProgressIndicator
                        open={this.state.isLoading}
                    ></ProgressIndicator>

                    <h3 className="text-[18px] font-bold">Täze haryt</h3>

                    <div className="rounded-lg relative border h-[100px] w-[100px] min-w-[100px] overflow-hidden m-1 mx-auto">
                        {this.state.selectedImgUrl !== "" && (
                            <img
                                className=" object-cover rounded-md w-full h-full"
                                alt=""
                                onClick={() => {
                                    document
                                        .getElementById("productImgSelector")
                                        .click();
                                }}
                                src={URL.createObjectURL(
                                    this.state.selectedImgUrl
                                )}
                            ></img>
                        )}
                        {this.state.selectedImgUrl === "" && (
                            <img
                                className=" object-cover rounded-md w-full h-full"
                                alt=""
                                onClick={() => {
                                    document
                                        .getElementById("productImgSelector")
                                        .click();
                                }}
                                src={"/default.png"}
                            ></img>
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            defaultChecked
                            className="w-[25px] h-[25px]"
                            id="active"
                            type="checkbox"
                        ></input>
                        <label className="ml-2">Aktiw</label>
                    </div>
                    <label className="font-bold text-[12px]">Ady</label>
                    <input id="new_product_name" type="text"></input>
                    <label className="font-bold text-[12px]">Bahasy</label>
                    <input id="price" type="number" defaultValue={0}></input>
                    <select id="category">
                        <option value={""}>Kategoriýasy</option>
                        {this.state.categories.map((item) => {
                            return (
                                <option value={item.id}> {item.name_tm}</option>
                            );
                        })}
                    </select>
                    <input
                        hidden
                        onChange={() => {
                            this.setState({
                                selectedImgUrl:
                                    document.getElementById(
                                        "productImgSelector"
                                    ).files[0],
                            });
                        }}
                        id="productImgSelector"
                        multiple
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        type="file"
                    ></input>

                    <label>
                        Ýüklenen faýllaryň jemi göwrümi:{" "}
                        {this.state.uploadedTotalSize} KB
                    </label>
                    <div>
                        <button
                            className="text-[12px] bg-slate-600 rounded-full px-2 text-white p-1 m-1"
                            onClick={() => {
                                this.saveProducts();
                            }}
                        >
                            Ýatda sakla
                        </button>
                        <button
                            className="text-[12px] bg-slate-600 rounded-full px-2 text-white p-1 m-1"
                            onClick={() => {
                                this.close();
                            }}
                        >
                            Ýapmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
