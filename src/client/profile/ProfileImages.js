import axios from "axios";
import React from "react";
import { server } from "../../static";
import ProgressIndicator from "../../admin/ProgressIndicator";
import ImageViewer from "../components/ImageViewer";
import { MdAdd, MdClose, MdImage } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { MotionAnimate } from "react-motion-animate";

class ProfileImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            images: [],
            imgViewerSrc: "",
            sliderImages: [],
            imgViewer: false,
            currentIndexImgViewer: 0,
        };

        document.title = "Suratlar";
        this.setData();
    }

    setData() {
        let id = localStorage.getItem("user_id");
        axios
            .get(server + "/mob/stores/" + id, {
                headers: { token: localStorage.getItem("user_access_token") },
            })
            .then((resp) => {
                this.setState({ images: resp.data.images });
                const sliderImages = [];
                resp.data.images.map((item) => {
                    sliderImages.push(server + item.img_m);
                });
                this.setState({ sliderImages: sliderImages });
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    addImage() {
        let id = localStorage.getItem("user_id");
        var formData = new FormData();
        formData.append(
            "images",
            document.getElementById("img_selector").files[0]
        );
        axios
            .put(server + "/mob/stores/" + id, formData, {
                headers: { token: localStorage.getItem("user_access_token") },
            })
            .then((resp) => {
                this.setState({ images: resp.data.images });
                toast.success("Surat goşuldy");
            })
            .catch((err) => {
                toast.error("Error");
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }
    deleteImage(item) {
        var formData = new FormData();
        formData.append(
            "images",
            document.getElementById("img_selector").files[0]
        );
        axios
            .post(
                server + "/mob/stores/img/delete/" + item.id,
                {},
                {
                    headers: {
                        token: localStorage.getItem("user_access_token"),
                    },
                }
            )
            .then((resp) => {
                toast.success("Surat bozuldy");
                var images2 = this.state.images;
                images2.splice(images2.indexOf(item), 1);
            })
            .catch((err) => {
                toast.error("Error");
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="profile_flats">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>

                <ImageViewer
                    show={this.state.imgViewer}
                    parent={this}
                    index={this.state.currentIndexImgViewer}
                    src={this.state.imgViewerSrc}
                    images={this.state.sliderImages}
                ></ImageViewer>

                <button
                    onClick={() => {
                        document.getElementById("img_selector").click();
                    }}
                    className=" rounded-md flex items-center bg-appColor px-2 p-1 text-white m-1 hover:shadow-lg duration-200"
                >
                    <MdImage className="mr-1" size={20}></MdImage>
                    Surat goşmak
                </button>

                <input
                    onChange={() => {
                        this.addImage();
                    }}
                    id="img_selector"
                    hidden
                    type="file"
                ></input>

                <div className="grid grid-cols-4 sm:grid-cols-3">
                    {this.state.images.map((item, index) => {
                        var img = server + item.img_m;

                        return (
                            <MotionAnimate>
                                <div className="m-1 relative">
                                    <button
                                        onClick={() => {
                                            this.deleteImage(item);
                                        }}
                                        className="bg-red-600 hover:bg-red-500 text-white rounded-full p-1 
                                        absolute top-1 left-1 hover:shadow-xl duration-200"
                                    >
                                        <MdClose size={20}></MdClose>
                                    </button>
                                    <img
                                        onClick={() => {
                                            console.log(server + item.img_m);
                                            this.setState({
                                                imgViewerSrc:
                                                    server + item.img_m,
                                                imgViewer: true,
                                                currentIndexImgViewer: index,
                                            });
                                        }}
                                        className="h-[200px] sm:h-[140px] w-full  border object-cover rounded-md overflow-hidden"
                                        key={item.id}
                                        alt=""
                                        src={img}
                                    ></img>
                                </div>
                            </MotionAnimate>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ProfileImages;
