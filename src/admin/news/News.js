import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdClose, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { BiLike, BiTime } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@mui/material/Pagination";

class AdminNews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            category: "",
            q: "",

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            iplist: [],
            urlParams: [],
            news: [],
            categories: [],

            uploaded_images: [],
            filterOpen: false,
            newStoreOpen: false,

            addFormShow: false,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Habarlar";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(server + "/api/admin/news?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ news: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    setData() {
        const params = {
            page: this.state.current_page,
            category: this.state.category,
            q: this.state.q,
        };

        const config = {
            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
            params: params,
        };

        axios
            .get(server + "/mob/index/news", { auth: this.state.auth })
            .then((resp) => {
                this.setState({ categories: resp.data.categories });
            });

        axios
            .get(server + "/api/admin/news/", config)
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ news: resp.data.data });
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    window.location.href = "/admin/login";
                }
            });
    }

    filter() {
        this.setState({ isLoading: true });
        this.setState({ q: document.getElementById("search").value });
        this.setData();
    }

    deleteItem(id) {
        if (window.confirm("Bozmaga ynamynyz barmy?").result === false) {
            return null;
        }
        axios
            .delete(server + "/api/admin/visitors/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
                toast.success("Habar bozuldy");
            });
    }

    AddModal() {
        if (this.state.addFormShow === false) {
            return null;
        }
        return (
            <div
                style={{ zIndex: 10 }}
                className="max-w-[500px] grid p-4 shadow-2xl rounded-lg mx-auto absolute bg-white left-0 right-0 border"
            >
                <div className="flex items-center justify-between">
                    <label>Täze habar</label>
                    <MdClose
                        className="hover:bg-slate-200 duration-200 rounded-full"
                        onClick={() => {
                            this.setState({ addFormShow: false });
                        }}
                        size={25}
                    ></MdClose>
                </div>
                <label className="text-sm">Kategoriýasy</label>
                <select id="category">
                    {this.state.categories.map((item) => {
                        return <option value={item.id}>{item.name_tm}</option>;
                    })}
                </select>
                <input id="title_tm" placeholder="Ady (tm)"></input>
                <input
                    id="created_at"
                    defaultValue={Date.now()}
                    type="datetime-local"
                ></input>
                <textarea
                    id="body_tm"
                    placeholder="text"
                    className="min-h-[200px]"
                ></textarea>
                <input id="imgSelector" type="file"></input>

                <div className="images">
                    {this.state.uploaded_images.map((item) => {
                        return (
                            <div className="w-max">
                                <img
                                    alt=""
                                    className="w-[100px] h-[100px]"
                                ></img>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={() => {
                        this.saveNewPost();
                    }}
                    className="bg-sky-600 text-white p-2"
                >
                    Yatda sakla
                </button>
            </div>
        );
    }

    saveImages(news_id) {
        let formdata = new FormData();
        let images = document.getElementById("imgSelector").files;

        for (let i = 0; i < images.length; i++) {
            formdata.append("img_l", images[i]);
        }

        formdata.append("news", news_id);

        axios
            .post(server + "/api/admin/news_imgs/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.promise("Suratlar yuklenyar");
            })
            .catch((err) => {
                toast.error("Surat yuklenende yalňyşlyk ýüze çykdy");
            });
    }

    saveNewPost() {
        const created_at = document.getElementById("created_at").value;

        if (
            created_at === "" ||
            created_at === undefined ||
            created_at == null
        ) {
            toast.error("Wagty hokman gorkezmeli!");
            return null;
        }

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
            .post(server + "/api/admin/news/", fdata, { auth: this.state.auth })
            .then((resp) => {
                this.saveImages(resp.data.id);
                this.setData();
                toast.success("Habar goşuldy");
                this.setState({ addFormShow: false });
            })
            .catch((err) => {
                console.log(err);
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    setCategory(id) {
        this.setState({ category: id, isLoadingCategory: true }, () => {
            this.setData();
        });
    }

    render() {
        return (
            <div className="news grid">
                <ToastContainer />
                {this.AddModal()}
                <label className="p-2 border-b font-bold text-[20px]">
                    Habarlar
                </label>

                <div className="flex items-center">
                    <input
                        onChange={() => {
                            this.filter();
                        }}
                        id="search"
                        placeholder="gozleg"
                    ></input>
                    <button className="p-1 mx-1 bg-slate-300 rounded-md">
                        <MdSearch size={25}></MdSearch>
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ addFormShow: true });
                        }}
                        className="w-max p-1 hover:text-slate-900 text-sky-600"
                    >
                        Habar goşmak
                    </button>
                </div>

                <div className="flex items-center overflow-x-auto whitespace-nowrap ">
                    <button
                        onClick={() => {
                            this.setState({ category: "" }, () => {
                                this.setData();
                            });
                        }}
                        className="mr-2 hover:text-sky-300 duration-200 px-2 py-1 text-slate-600"
                    >
                        Hemmesi
                    </button>
                    {this.state.categories.map((item) => {
                        return (
                            <button
                                onClick={() => {
                                    this.setCategory(item.id);
                                }}
                                className="mr-2 hover:text-sky-300  duration-200 px-2 py-1 text-slate-600"
                            >
                                {item.name_tm}
                            </button>
                        );
                    })}
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-center">
                    {this.state.news.map((item) => {
                        return (
                            <div
                                className="grid grid-rows-[max-content_auto]  sm:w-full  
                                overflow-hidden m-[10px] rounded-md shadow-lg border text-[14px]
                                hover:shadow-slate-500/50 duration-200 w-[250px]"
                            >
                                <Link to={"/admin/news/" + item.id}>
                                    <img
                                        alt=""
                                        className="w-full h-[150px] object-cover"
                                        src={server + item.img}
                                    ></img>
                                </Link>
                                <div className="grid p-2 h-max">
                                    <label className="name text-[12px] font-bold text-slate-600">
                                        {item.title_tm}
                                    </label>

                                    <label className="name text-[12px] text-slate-600">
                                        {String(item.body_tm).substring(0, 100)}
                                    </label>

                                    <div className="flex items-center text-slate-500 text-[12px]">
                                        <BiLike
                                            className="mr-1"
                                            size={20}
                                        ></BiLike>
                                        <label className="mr-2">
                                            {item.like_count}
                                        </label>
                                        <FaEye
                                            className="mr-1"
                                            size={20}
                                        ></FaEye>
                                        <label className="mr-2">
                                            {item.view}
                                        </label>
                                        <BiTime></BiTime>
                                        {item.created_at}
                                    </div>
                                    {item.status === "active" ? (
                                        <label className="text-green-600 font-bold">
                                            Aktiw
                                        </label>
                                    ) : (
                                        <label className="text-red-600 font-bold">
                                            Passiw
                                        </label>
                                    )}
                                    <label>{item.category_name}</label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AdminNews;
