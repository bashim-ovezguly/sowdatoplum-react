import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiChat, BiHeart } from "react-icons/bi";
import { MdCalendarToday } from "react-icons/md";
import { Link } from "react-router-dom";

class Videos extends React.Component {
    pageSize = 2;
    srcUrl = "/mob/videos";

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingCategory: false,
            current_page: "",
            last_page: "",
            categories: [],
            news: [],
            videos: [],
            category: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Wideolar";
        this.setData();
    }

    likeClick(id) {
        var fdata = new FormData();
        fdata.append("like", "1");
        axios.put(server + "/mob/videos/" + id, fdata).then((res) => {
            this.setData();
        });
    }

    setData() {
        axios.get(server + "/mob/index/news").then((resp) => {
            this.setState({ categories: resp.data.categories });
        });

        const params = {
            page: this.state.current_page,
            category: this.state.category,
            q: this.state.q,
        };

        axios.get(server + this.srcUrl, { params: params }).then((resp) => {
            this.setState({ videos: resp.data.data });
            this.setState({ last_page: resp.data.total_page });
            this.setState({ count: resp.data.count });
            this.setState({ total_page: resp.data.total_page });
            this.setState({ page_size: resp.data.page_size });
            this.setState({ current_page: resp.data.current_page });
            this.setState({ isLoading: false });
            this.setState({ liked: resp.data.liked });
        });
    }

    render() {
        let pageNumbers = [];
        for (let i = 0; i < this.state.total_page; i++) {
            pageNumbers.push(i + 1);
        }

        return (
            <div className="grid mx-auto p-2">
                <h3 className="text-[15px] text-appColor font-bold">
                    Wideolar
                </h3>

                <div className="grid justify-center">
                    {this.state.videos.map((item) => {
                        let date = String(item.created_at).split(" ")[0];
                        date =
                            date.split("-")[2] +
                            "." +
                            date.split("-")[1] +
                            "." +
                            date.split("-")[0];

                        return (
                            <div className="max-w-[600px] max-h-[600px] grid m-2 overflow-hidden">
                                <Link
                                    to={"/stores/" + item.store.id + "/videos"}
                                    className="flex items-start m-1"
                                >
                                    {item.logo !== undefined && (
                                        <img
                                            alt=""
                                            src={server + item.store.logo}
                                        ></img>
                                    )}
                                    <img
                                        src={server + item.store.logo}
                                        alt=""
                                        className="bg-slate-200 rounded-full w-[30px] h-[30px]"
                                    ></img>
                                    {item.store != undefined && (
                                        <label className="ml-2 hover:text-sky-600">
                                            {item.store.name}
                                        </label>
                                    )}
                                </Link>
                                <div to={"/videos/" + item.id}>
                                    <video
                                        onClick={(e) => {
                                            if (e.target.paused) {
                                                var videos =
                                                    document.getElementsByTagName(
                                                        "video"
                                                    );
                                                for (
                                                    var i = 0;
                                                    i < videos.length;
                                                    i++
                                                ) {
                                                    videos[i].pause();
                                                }
                                                e.target.play();
                                            } else {
                                                e.target.pause();
                                            }
                                        }}
                                        src={server + item.url}
                                        className="h-[500px] w-[500px] border overflow-hidden rounded-lg "
                                    ></video>
                                </div>
                                <div className="my-2 flex items-center justify-between text-slate-700">
                                    <div className="flex items-center">
                                        <BiHeart
                                            onClick={() => {
                                                this.likeClick(item.id);
                                            }}
                                            className="mr-1 hover:text-slate-500"
                                            size={25}
                                        ></BiHeart>
                                        <label>{item.like_count}</label>
                                        <Link to={"/videos/" + item.id}>
                                            <BiChat
                                                className="ml-2 hover:text-slate-500"
                                                size={25}
                                            ></BiChat>
                                        </Link>
                                    </div>
                                    <div className="flex items-center">
                                        <MdCalendarToday
                                            size={25}
                                            className="mx-1"
                                        ></MdCalendarToday>
                                        {date}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Videos;
