import axios from "axios";
import React from "react";
import { server } from "../../static";
import { FaEye } from "react-icons/fa";
import { BiHeart, BiTime } from "react-icons/bi";

class VideoDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            video: "",

            coemments: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };
    }

    componentDidMount() {
        this.setData();
        window.scrollTo(0, 0);
    }

    likeClick() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];
        this.setData({ id: id });

        var fdata = new FormData();
        fdata.append("like", "1");
        axios.put(server + "/mob/videos/" + id, fdata).then((res) => {
            this.setData();
        });
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];
        this.setState({ id: id });

        axios.get(server + "/mob/videos/" + id).then((resp) => {
            this.setState({
                name: resp.data.name,
                id: resp.data.id,
                store: resp.data.store,
                video: resp.data.video,
                created_at: resp.data.created_at,
                like_count: resp.data.like_count,
                viewed: resp.data.view,
                customer: resp.data.customer,
                isLoading: false,
            });

            document.title = "Video | " + this.state.id;
        });
    }

    render() {
        return (
            <div className="grid justify-center p-5 sm:p-4">
                <video
                    src={server + this.state.video}
                    controls
                    className="h-[500px] w-[500px] border overflow-hidden rounded-lg"
                >
                    <source
                        src={server + this.state.video}
                        type="video/mp4"
                    ></source>
                </video>

                <label className="text-[20px] font-bold my-2">
                    {this.state.name}
                </label>

                <div className="flex text-[18px] text-slate-600 items-center my-5">
                    <button
                        onClick={() => {
                            this.likeClick();
                        }}
                        className="flex items-center hover:bg-slate-200 rounded-md  mr-2"
                    >
                        {this.state.liked === true ? (
                            <BiHeart className="mr-2" size={20}></BiHeart>
                        ) : (
                            <BiHeart className="mr-2" size={20}></BiHeart>
                        )}
                        <label className="mr-5">{this.state.like_count}</label>
                    </button>

                    <FaEye className="mr-1" size={20}></FaEye>
                    <label className="mr-5">{this.state.viewed}</label>

                    <BiTime className="mr-1"></BiTime>
                    {this.state.created_at}
                </div>
            </div>
        );
    }
}

export default VideoDetail;
