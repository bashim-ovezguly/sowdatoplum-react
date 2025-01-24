import React from "react";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import { server } from "../../static";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import ProgressIndicator from "../ProgressIndicator";

class AdminStoreImages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: [],
            current_page: 1,
            last_page: 1,
            total: 0,
            page_size: 50,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };
        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        var id = pathname.split("/")[3];
        axios
            .get(server + "/api/adm/stores/" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({
                    images: resp.data.images,
                });
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(server + "/mob/stores/img/delete/" + id)
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
    }

    addSelectedImages() {
        this.setState({ isLoading: true });

        const pathname = window.location.pathname;
        var id = pathname.split("/")[3];
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        formdata.append("img_l", images[0]);

        formdata.append("store", id);

        axios
            .post(server + "/api/adm/store_imgs/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="grid">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <button
                    className="flex items-center w-max rounded-full bg-sky-600 hover:bg-slate-600 duration-200 text-white m-1 px-2 text-[12px]"
                    onClick={() => {
                        document.getElementById("imgselector").click();
                    }}
                >
                    <BiPlus className="" size={25}></BiPlus>
                    <label>Surat goşmak</label>
                </button>
                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <div className="grid m-1 shadow-md rounded-xl relative">
                                <a href={server + item.img_m} target="_blank">
                                    <img
                                        alt=""
                                        className="object-cover w-[150px] h-[150px] rounded-lg border"
                                        defaultValue={"/default.png"}
                                        src={server + item.img_s}
                                    ></img>
                                </a>
                                <button
                                    className=" hover:text-slate-700 bg-red-600 text-white rounded-full shadow-lg
                                 w-max m-1 absolute top-1 left-1"
                                >
                                    <MdClose
                                        size={30}
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                    ></MdClose>
                                </button>
                            </div>
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

export default AdminStoreImages;
