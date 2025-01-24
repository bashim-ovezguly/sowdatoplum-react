import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdClose, MdPlayCircle } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { toast } from "react-toastify";

class AdminStoreVideos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            videos: [],
            current_page: 1,
            last_page: 1,
            total: 0,
            page_size: 50,
            videoPlayerIsOpen: false,
            videoAddModalisOpen: false,

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };
    }

    VideoAddModal() {
        if (this.state.videoAddModalisOpen === false) {
            return null;
        }
        return (
            <div className="grid shadow-lg rounded-md p-2 mx-auto left-0 right-0 absolute z-10 bg-white max-w-[300px]">
                <img
                    src={this.state.thumbnail}
                    alt=""
                    id="preload"
                    className="h-[200px] w-full object-cover rounded-md border"
                ></img>
                <label>Video (MP4)</label>
                <input id="videoFile" type="file" accept="video/mp4"></input>

                <label>Thumbnail (JPG, PNG)</label>
                <input
                    accept="image/png, image/jpeg"
                    onChange={() => {
                        const file =
                            document.getElementById("thumbnail").files[0];
                        let objectUrl = URL.createObjectURL(file);
                        document.getElementById("preload").src = objectUrl;
                    }}
                    id="thumbnail"
                    type="file"
                ></input>

                <button
                    onClick={() => {
                        this.addVideo();
                    }}
                    className="bg-green-600 text-white text-[14px] p-2"
                >
                    Ýatda sakla
                </button>
                <button
                    onClick={() => {
                        this.setState({ videoAddModalisOpen: false });
                    }}
                    className="bg-slate-600 text-white text-[14px] p-2"
                >
                    Goý bolsun etmek
                </button>

                {this.state.videoIsUploading === true && (
                    <label>Downloading...</label>
                )}
            </div>
        );
    }

    videoPlayer() {
        if (this.state.videoPlayerIsOpen === false) {
            return null;
        }
        return (
            <div className="grid m-auto absolute p-4 rounded-md shadow-2xl w-max border z-10 left-0 right-0  overflow-hidden bg-white">
                <div className="flex justify-end">
                    <MdClose
                        className="m-2 hover:text-slate-600 duration-200"
                        onClick={() => {
                            this.setState({ videoPlayerIsOpen: false });
                        }}
                        size={30}
                    ></MdClose>
                </div>
                <video className="max-w-[400px] h-[400px]" controls>
                    <source
                        src={this.state.videoPlayerUrl}
                        type="video/mp4"
                    ></source>
                </video>
            </div>
        );
    }

    getVideos() {
        axios
            .get(server + "/api/adm/videos?store=" + this.state.id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ videos: resp.data.data });
            });
    }

    deleteVideo(id) {
        const r = window.confirm("Bozmaga ynamynyz barmy?");
        if (r === false) {
            return null;
        }

        axios
            .post(server + "/api/adm/videos/delete/" + id, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Video deleted");
                this.setData();
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    addVideo() {
        let fdata = new FormData();

        if (document.getElementById("thumbnail").files.length > 0) {
            fdata.append(
                "thumbnail",
                document.getElementById("thumbnail").files[0]
            );
        }

        fdata.append("store", this.state.id);
        fdata.append("video", document.getElementById("videoFile").files[0]);

        this.setState({ videoIsUploading: true });
        axios
            .post(server + "/api/adm/videos/", fdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                toast.success("Video added");
                this.setState({
                    videoIsUploading: false,
                    videoAddModalisOpen: false,
                });
                this.setData();
            })
            .catch((err) => {
                toast.error("Error");
            });
    }

    render() {
        return (
            <div className="grid">
                {this.state.videoAddModalisOpen == true && this.VideoAddModal()}
                <div className="flex items">
                    <button
                        onClick={() => {
                            this.setState({ videoAddModalisOpen: true });
                        }}
                        className="flex mx-2 items-center hover:text-sky-600 bg-slate-200 p-1 rounded-md"
                    >
                        <BiPlus></BiPlus>
                        <label>Goşmak</label>
                    </button>
                    {/* <button className="flex mx-2 items-center hover:text-sky-600">
                <MdSort></MdSort>
                <label>Tertibi</label>
            </button> */}
                </div>
                <div className="flex flex-wrap justify-center">
                    {this.state.videos.map((item) => {
                        return (
                            <div className="m-2 grid">
                                <div
                                    onClick={() => {
                                        this.setState({
                                            videoPlayerIsOpen: true,
                                            videoPlayerUrl: item.video,
                                        });
                                    }}
                                    className="relative w-[150px] h-[150px] bg-slate-200 rounded-lg  overflow-hidden flex items-center justify-center
                                            text-slate-600 hover:bg-slate-300 duration-300 border"
                                >
                                    {/* <img
                                className="absolute w-full h-full z-0 object-cover"
                                src={item.thumbnail}
                                alt=""
                            ></img> */}
                                    <video src={item.video}></video>

                                    <MdPlayCircle
                                        className="z-1 text-white drop-shadow-sm hover:text-slate-400 duration-300"
                                        size={80}
                                    ></MdPlayCircle>
                                </div>
                                <div className="flex items-center">
                                    <IoMdTrash
                                        className="hover:text-slate-600"
                                        onClick={() => {
                                            this.deleteVideo(item.id);
                                        }}
                                        size={20}
                                    ></IoMdTrash>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AdminStoreVideos;
