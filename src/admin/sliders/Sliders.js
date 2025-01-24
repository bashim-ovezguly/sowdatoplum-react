import axios from "axios";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import { server } from "../../static";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { CircularProgress } from "@mui/material";
import ProgressIndicator from "../ProgressIndicator";

class Sliders extends React.Component {
    advUrl = "/api/adm/ads";
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            statuses: [],
            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            addOpen: false,
            selectedImages: [],

            ads: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Söwda nokatlary";
        this.setData();
    }

    setPage(pageNumber) {
        this.setState({ isLoading: true });
        axios
            .get(
                server +
                    this.advUrl +
                    "?page_size=" +
                    this.state.page_size +
                    "&page=" +
                    pageNumber,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ ads: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    setData() {
        axios
            .get(server + "/api/adm/ads/?page=" + this.state.current_page, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ locations: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ ads: resp.data.data });
            });
    }

    onImgSelect() {
        var files = document.getElementById("imgselector").files;
        var t = [];

        for (let i = 0; i < this.state.selectedImages.length; i++) {
            t.push(this.state.selectedImages[i]);
        }

        for (let i = 0; i < files.length; i++) {
            if (t.find((x) => x.name == files[i].name) == undefined) {
                t.push(files[i]);
            }
        }

        this.setState({ selectedImages: t });
    }

    addModal() {
        if (this.state.addOpen === false) {
            return null;
        }

        return (
            <div className="wrapper absolute shadow-lg rounded-md p-2 bg-white grid z-10 border">
                <label className="font-bold text-lg">Täze Slider</label>
                <input id="advName" placeholder="ady"></input>

                <div className="text-[12px] grid grid-cols-2">
                    <button
                        className="p-1 rounded-md m-1 bg-sky-600 hover:shadow-md text-white"
                        onClick={() => {
                            this.addNewAdv();
                        }}
                    >
                        Goşmak
                    </button>
                    <button
                        className="p-1 rounded-md m-1 bg-sky-600 hover:shadow-md text-white"
                        onClick={() => {
                            this.setState({ addOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    addNewAdv() {
        var formdata = new FormData();

        formdata.append("title_tm", document.getElementById("advName").value);

        this.setState({ isLoading: true });
        axios
            .post(server + "/api/adm/ads/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                let newAdvId = resp.data.id;
                alert("Biliriş goşuldy");
                window.location.href = "/superuser/advs/" + newAdvId;
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center">
                    <CircularProgress></CircularProgress>
                </div>
            );
        }
        return (
            <div className="grid p-2">
                <div className="flex items-center flex-wrap text-[12px]">
                    <h3 className="font-bold text-lg">
                        Bildirişler ({this.state.total} sany)
                        <ProgressIndicator
                            open={this.state.isLoading}
                        ></ProgressIndicator>
                    </h3>
                    <button
                        onClick={() => {
                            this.setState({ addOpen: true });
                        }}
                        className="flex items-center rounded-lg bg-slate-200 p-1 m-1"
                    >
                        <BiPlus size={20}></BiPlus>
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="flex items-center rounded-lg bg-slate-200 p-1 m-1"
                    >
                        <MdRefresh size={20}></MdRefresh>
                    </button>
                </div>

                {this.addModal()}
                {/* {this.filter_modal()} */}

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-center ">
                    {this.state.ads.map((item, index) => {
                        let img = "";
                        if (item.img === "") {
                            img = "/default.png";
                        } else {
                            img = server + item.img;
                        }
                        return (
                            <Link
                                to={"/superuser/advs/" + item.id}
                                key={item.id}
                                className="overflow-hidden grid m-2 sm:w-[150px] w-[200px] grid-rows-[max-content_max-content] 
                                rounded-lg border shadow-md text-[12px] sm:text-[10px] hover:bg-slate-200"
                            >
                                <img
                                    className="h-[200px] sm:h-[150px] w-full object-cover"
                                    alt=""
                                    src={img}
                                ></img>
                                <div className="grid m-2 content-start align-top">
                                    <label className="font-bold">
                                        {item.title_tm}
                                    </label>

                                    <label>
                                        Tertip belgisi: {item.sort_order}
                                    </label>
                                    <label>{item.type.name}</label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Sliders;
