import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import { BiCalendar } from "react-icons/bi";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdCheck, MdClose, MdSave } from "react-icons/md";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import ProgressIndicator from "../../admin/ProgressIndicator";

class LentaEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",
            total_page: "",
            images: [],
            customer_photo: "",
            customer: "",
            view: "",
            created_at: "",

            token: localStorage.getItem("user_access_token"),
        };

        document.title = "Lenta";
        this.setData();
    }

    save() {
        var formdata = new FormData();
        formdata.append("text", document.getElementById("text").value);
        this.setState({ isLoading: true });
        axios
            .put(server + "/mob/lenta/" + this.state.id, formdata)
            .then((resp) => {
                alert("Ýatda saklandy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    delete() {
        this.setState({ isLoading: true });
        axios
            .post(
                server + "/mob/lenta/" + this.state.id + "/delete",
                {},
                { headers: { token: this.state.token } }
            )
            .then((resp) => {
                toast.success("Ýatda saklandy");
                window.history.back();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    setPage(pageNumber) {
        axios.get(server + "/lenta?page=" + pageNumber).then((resp) => {
            this.setState({ datalist: resp.data.data });
        });
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];

        axios.get(server + "/lenta/" + id).then((resp) => {
            this.setState({ lenta: resp.data });
            this.setState({ customer: resp.data.customer });
            this.setState({ images: resp.data.images });
            this.setState({ view: resp.data.view });
            this.setState({ created_at: resp.data.created_at });
            this.setState({ text: resp.data.text });
            this.setState({ id: resp.data.id });
            this.setState({ images: resp.data.images });
            this.setState({ isLoading: false });
        });
    }

    addSelectedImages() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        let images = document.getElementById("imgselector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("images", images[i]);
        }

        this.setState({ isLoading: true });

        axios
            .put(server + "/mob/lenta/" + this.state.id, formdata)
            .then((resp) => {
                alert("Ýatda saklandy");
                document.getElementById("imgselector").value = null;
                this.setData();
                this.setState({ isLoading: true });
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
                this.setState({ isLoading: true });
            });
    }

    removeImage(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true)
            axios
                .post(
                    server + "/mob/lenta/img/delete/" + id,
                    {},
                    { headers: { token: this.state.token } }
                )
                .then((resp) => {
                    this.setData();
                })
                .catch((err) => {
                    alert("Ýalňyşlyk ýüze çykdy");
                });
    }

    render() {
        return (
            <div className="lentaEdit grid  max-w-[600px] mx-auto p-2">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                {/* IMAGES */}
                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <div className="border m-1 rounded-2xl max-h-[200px] max-w-[200px] overflow-hidden relative">
                                <img
                                    alt=""
                                    className="h-[100px] aspect-video object-cover border"
                                    src={server + item.img}
                                ></img>

                                <div className="flex m-1 absolute top-1 left-1">
                                    <MdClose
                                        size={30}
                                        title="Bozmak"
                                        onClick={() => {
                                            this.removeImage(item.id);
                                        }}
                                        className="bg-white text-red-600  duration-300 hover:shadow-lg shadow-lg mr-1 rounded-full"
                                    ></MdClose>
                                    <MdCheck
                                        size={30}
                                        onClick={() => {
                                            this.setMainImage(item.id);
                                        }}
                                        title="Esasy surata bellemek"
                                        className="bg-white text-green-600  duration-300 hover:shadow-lg shadow-lg mr-1 rounded-full"
                                    ></MdCheck>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* IMAGES ENDS */}

                <input
                    onChange={() => {
                        this.addSelectedImages();
                    }}
                    id="imgselector"
                    multiple
                    hidden
                    className="max-w-300px"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <button
                    onClick={() => {
                        document.getElementById("imgselector").click();
                    }}
                    className="bg-appColor hover:bg-slate-600  p-1 text-white w-max text-[12px] rounded-md px-2"
                >
                    Surat goşmak
                </button>

                <textarea
                    id="text"
                    className="min-h-[200px]"
                    defaultValue={this.state.text}
                ></textarea>

                <div className="flex items-center">
                    <FiEye></FiEye>
                    <label>{this.state.view}</label>
                    <BiCalendar></BiCalendar>
                    <label>{this.state.created_at}</label>
                </div>
                <div className="grid grid-cols-2 justify-between">
                    <button
                        onClick={() => {
                            this.save();
                        }}
                        className="flex items-center justify-center hover:bg-slate-600 duration-200 
                        p-2 text-[12px] bg-sky-600 text-white rounded-md mx-1"
                    >
                        <MdSave size={20}></MdSave>
                        <label>Ýatda saklamak</label>
                    </button>
                    <button
                        onClick={() => {
                            this.delete();
                        }}
                        className="flex items-center justify-center hover:bg-slate-600 duration-200 
                        p-2 text-[12px] bg-red-600 text-white rounded-md mx-1"
                    >
                        <MdSave size={20}></MdSave>
                        <label>Bozmak</label>
                    </button>
                </div>
            </div>
        );
    }
}

export default LentaEdit;
