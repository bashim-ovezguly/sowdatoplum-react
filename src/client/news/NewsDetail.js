import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiLike, BiSearch, BiTime } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

class NewsDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            images: [],

            title_tm: "",
            title_ru: "",
            title_en: "",
            body_tm: "",
            body_en: "",
            body_ru: "",
            created_at: "",
            like: "",
            view: "",
            source: "",

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };
    }

    componentWillMount() {
        this.setData();

        window.scrollTo(0, 0);
    }

    likeClick() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];
        this.setData({ id: id });

        var fdata = new FormData();
        fdata.append("like", 1);
        axios.put(server + "/news/" + id, fdata).then((res) => {
            this.setData();
        });
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];
        this.setState({ id: id });

        axios.get(server + "/news/" + id).then((resp) => {
            this.setState({ title_tm: resp.data.title_tm });
            this.setState({ title_ru: resp.data.title_ru });
            this.setState({ title_en: resp.data.title_en });
            this.setState({ body_tm: resp.data.body_tm });
            this.setState({ body_ru: resp.data.body_ru });
            this.setState({ body_en: resp.data.body_en });
            this.setState({ category: resp.data.category });
            this.setState({ created_at: resp.data.created_at });
            this.setState({ like_count: resp.data.like_count });
            // this.setState({ liked: resp.data.liked });
            this.setState({ view: resp.data.view });
            this.setState({ images: resp.data.images });
            this.setState({ isLoading: false });

            document.title = resp.data.title_tm;
        });
    }

    render() {
        return (
            <div className="grid p-5 sm:p-4 max-w-[900px] mx-auto">
                <div className="flex flex-wrap justify-center">
                    {this.state.images.map((item) => {
                        return (
                            <img
                                className="max-h-[300px] max-w-[400px] border w-full m-2 object-cover rounded-lg overflow-hidden"
                                alt=""
                                src={server + item.img}
                            ></img>
                        );
                    })}
                </div>
                <label className="text-[20px] font-bold my-2">
                    {this.state.title_tm}
                </label>
                <label className="text-[13px] whitespace-pre-line">
                    {this.state.body_tm}
                </label>

                <div className="flex text-[18px] text-slate-600 items-center my-5">
                    <button
                        onClick={() => {
                            this.likeClick();
                        }}
                        className="flex items-center hover:bg-slate-200 rounded-md px-2 mx-2"
                    >
                        {this.state.liked === true ? (
                            <AiFillLike className="mr-2" size={20}></AiFillLike>
                        ) : (
                            <AiOutlineLike
                                className="mr-2"
                                size={20}
                            ></AiOutlineLike>
                        )}
                        <label className="mr-5">{this.state.like_count}</label>
                    </button>

                    <FaEye className="mr-1" size={20}></FaEye>
                    <label className="mr-5">{this.state.view}</label>
                    <BiTime className="mr-1"></BiTime>
                    {this.state.created_at}
                </div>
                {this.state.source !== "" && (
                    <div className="flex items-center justify-end bg-slate-200 rounded-full max-w-[200px] hover:bg-slate-400 duration-200 p-2">
                        <label className="">{this.state.source}</label>
                    </div>
                )}
            </div>
        );
    }
}

export default NewsDetail;
