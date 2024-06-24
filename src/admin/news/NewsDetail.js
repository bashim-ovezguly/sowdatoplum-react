import axios from "axios";
import React from "react";
import { server } from "../../static";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdTrash } from "react-icons/io";
import { BiArrowToLeft, BiCheck } from "react-icons/bi";
import { FcCancel, FcCheckmark, FcOk } from "react-icons/fc";
import VideoThumbnail from "react-video-thumbnail";
import { MdArrowLeft, MdOutlineArrowLeft, MdVideocam } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

class AdminNewsDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            title_tm: "",
            title_ru: "",
            title_en: "",
            body_tm: "",
            body_en: "",
            body_ru: "",
            images: [],
            uploaded_images: [],
            created_at: "",
            like: "",
            view: "",
            status: "",
            categories: [],
            videos: [],

            config: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };
    }

    componentWillMount() {
        this.initState();
    }

    accept() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];
        let fdata = new FormData();
        fdata.append("status", "active");
        fdata.append("created_at", this.state.created_at);

        axios
            .put(
                server + "/api/admin/news/" + id + "/",
                fdata,
                this.state.config
            )
            .then((resp) => {
                this.initState();
                toast.success("Kabul edildi");
            })
            .catch((err) => {
                toast.error("error");
            });
    }

    cancel() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];
        let fdata = new FormData();
        fdata.append("status", "passive");
        fdata.append("created_at", this.state.created_at);

        axios
            .put(
                server + "/api/admin/news/" + id + "/",
                fdata,
                this.state.config
            )
            .then((resp) => {
                this.initState();
                toast.success("Gaýtaryldy");
            });
    }

    initState() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[3];
        this.setState({ id: id });

        axios
            .get(server + "/api/admin/news_imgs/?news=" + id, this.state.config)
            .then((resp) => {
                this.setState({ images: resp.data.data });
            });

        axios
            .get(
                server + "/api/admin/news_videos/?news=" + id,
                this.state.config
            )
            .then((resp) => {
                this.setState({ videos: resp.data.data });
            });

        axios
            .get(server + "/mob/index/news", this.state.config)
            .then((resp) => {
                this.setState({ categories: resp.data.categories });
            });

        axios
            .get(server + "/api/admin/news/" + id, this.state.config)
            .then((resp) => {
                this.setState({ newsItem: resp.data });
                this.setState({ title_tm: resp.data.title_tm });
                this.setState({ status: resp.data.status });
                this.setState({ title_ru: resp.data.title_ru });
                this.setState({ title_en: resp.data.title_en });
                this.setState({ body_tm: resp.data.body_tm });
                this.setState({ body_ru: resp.data.body_ru });
                this.setState({ body_en: resp.data.body_en });
                this.setState({ category: resp.data.category });
                this.setState({ created_at: resp.data.created_at });
                this.setState({ like: resp.data.like });
                this.setState({ view: resp.data.view });
                this.setState({ isLoading: false });
                document.title = resp.data.title_tm;
            });
    }

    addVideo() {
        let fdata = new FormData();

        fdata.append("news", this.state.id);
        fdata.append("video", document.getElementById("videoInput").files[0]);
        // fdata.append(
        //     "thumbnail",
        //     this.dataURIToBlob(this.state.thumbnail),
        //     document.getElementById("video_file").files[0].name
        // );

        this.setState({ isLoading: true });
        axios
            .post(server + "/api/admin/news_videos/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Video added");
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    deletePost(id) {
        if (window.confirm("Bozmaga ynamynyz barmy?").result === false) {
            return null;
        }

        axios
            .delete(server + "/api/admin/news/" + id, this.state.config)
            .then((resp) => {
                toast.success("Habar bozuldy");
                window.history.back();
            });
    }

    deleteImage(id) {
        axios
            .post(
                server + "/api/admin/news/img/delete/" + id,
                {},
                this.state.config
            )
            .then((resp) => {
                toast.success("Surat bozuldy");
                this.initState();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    saveImages() {
        let formdata = new FormData();
        formdata.append("news", this.state.id);

        const resolveAfter3Sec = new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        toast.promise(resolveAfter3Sec, {
            pending: "Surat yuklenyar",
            success: "Surat yuklendi 👌",
            error: "Error 🤯",
        });

        let images = document.getElementById("imgSelector").files;

        if (images.length === 0) {
            return null;
        }

        for (let i = 0; i < images.length; i++) {
            formdata.append("img_l", images[i]);
        }

        axios
            .post(server + "/api/admin/news_imgs/", formdata, this.state.config)
            .then((resp) => {
                this.initState();
                toast.promise("Suratlar yuklenyar");
            })
            .catch((err) => {
                toast.error("Surat yuklenende yalňyşlyk ýüze çykdy");
            });
    }

    updatePost() {
        let fdata = new FormData();
        fdata.append("title_tm", document.getElementById("title_tm").value);
        // fdata.append("title_ru", document.getElementById("title_ru").value);
        // fdata.append("title_en", document.getElementById("title_en").value);
        fdata.append("body_tm", document.getElementById("body_tm").value);
        // fdata.append("body_en", document.getElementById("body_en").value);
        // fdata.append("body_ru", document.getElementById("body_ru").value);
        fdata.append("category", document.getElementById("category").value);
        fdata.append("created_at", document.getElementById("created_at").value);

        axios
            .put(
                server + "/api/admin/news/" + this.state.id + "/",
                fdata,
                this.state.config
            )
            .then((resp) => {
                this.initState();
                toast.success("Updated");
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    VideoPlayer() {
        return <div className=""></div>;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center">
                    <label>Ýüklenýär...</label>
                </div>
            );
        }

        return (
            <div className="news grid max-w-[600px] mx-auto">
                <ToastContainer closeOnClick autoClose={5000} />

                <Link
                    to={"/admin/news"}
                    className="flex items-center my-2 hover:text-sky-600 w-max"
                >
                    <AiOutlineArrowLeft></AiOutlineArrowLeft>
                    <label>Habarlar</label>
                </Link>

                <div className="flex items-center text-[13px]">
                    <button
                        onClick={() => {
                            this.accept();
                        }}
                        className="flex items-center border rounded-md m-1 p-1 bg-slate-100 hover:bg-slate-200"
                    >
                        <label>Kabul etmek</label>
                        <FcOk size={25}></FcOk>
                    </button>
                    <button
                        onClick={() => {
                            this.cancel();
                        }}
                        className="flex items-center border rounded-md m-1 p-1 bg-slate-100 hover:bg-slate-200"
                    >
                        <label>Gaýtarmak</label>
                        <FcCancel size={25}></FcCancel>
                    </button>

                    <button
                        onClick={() => {
                            this.updatePost();
                        }}
                        className=" bg-sky-600 text-white m-1 p-1 w-max rounded-lg"
                    >
                        Ýatda saklamak
                    </button>
                    <button
                        onClick={() => {
                            this.deletePost(this.state.id);
                        }}
                        className=" bg-red-600 text-white m-1 p-1 w-max rounded-lg"
                    >
                        Bozmak
                    </button>
                </div>

                <div className="flex flex-wrap">
                    {this.state.images.map((item) => {
                        return (
                            <div className="grid rounded-md overflow-hidden m-2 w-max">
                                <img
                                    className="w-[150px] h-[150px] object-contain border"
                                    alt=""
                                    src={item.img_l}
                                ></img>
                                <div className="grid text-slate-600 bg-slate-100 content-center grid-cols-2">
                                    <IoMdTrash
                                        className=" mx-auto hover:text-slate-300"
                                        onClick={() => {
                                            this.deleteImage(item.id);
                                        }}
                                        size={25}
                                    ></IoMdTrash>

                                    <BiCheck
                                        className="mx-auto hover:text-slate-300 "
                                        size={25}
                                    ></BiCheck>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <label>Surat</label>
                <input
                    id="imgSelector"
                    onChange={() => {
                        this.saveImages();
                    }}
                    multiple
                    // accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>
                <label>Wideo</label>

                <input
                    onChange={() => {
                        this.addVideo();
                    }}
                    id="videoInput"
                    type="file"
                ></input>

                {this.state.status === "active" ? (
                    <label>Aktiw</label>
                ) : (
                    <label>Passiw</label>
                )}

                <select id="category">
                    {this.state.categories.map((item) => {
                        let selected = false;
                        if (item.id === this.state.category) {
                            selected = true;
                        }
                        return (
                            <option selected={selected} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>
                <input
                    id="title_tm"
                    placeholder="Ady (tm)"
                    defaultValue={this.state.title_tm}
                ></input>
                <input
                    id="title_ru"
                    placeholder="Ady (ru)"
                    defaultValue={this.state.title_ru}
                ></input>
                <input
                    id="title_en"
                    placeholder="Ady (en)"
                    defaultValue={this.state.title_en}
                ></input>

                <input
                    id="created_at"
                    defaultValue={this.state.created_at}
                    type="datetime-local"
                ></input>
                <textarea
                    id="body_tm"
                    className="min-h-[400px]"
                    placeholder="text (tm)"
                    defaultValue={this.state.body_tm}
                ></textarea>
                <textarea
                    id="body_ru"
                    className="min-h-[400px]"
                    placeholder="text (ru)"
                    defaultValue={this.state.body_ru}
                ></textarea>
                <textarea
                    id="body_en"
                    className="min-h-[400px]"
                    placeholder="text (en)"
                    defaultValue={this.state.body_en}
                ></textarea>

                <div className="flex items-center"></div>
            </div>
        );
    }
}

export default AdminNewsDetail;
