import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdClose } from "react-icons/md";

class ImageViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            images: this.props.images,
            currentIndex: 0,
            show: false,
            headers: {
                token: localStorage.getItem("access_token"),
            },
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ currentIndex: props.index });
        this.setState({ images: props.images });
        this.setState({ show: props.show });
    }

    nextClick() {
        if (this.state.currentIndex + 1 < this.state.images.length) {
            this.setState({
                currentIndex: this.state.currentIndex + 1,
            });
        }
    }

    prevClick() {
        if (this.state.currentIndex > 0) {
            this.setState({
                currentIndex: this.state.currentIndex - 1,
            });
        }
    }

    bgClick(event) {
        console.log(event.target.className);
        if (event.target.className.includes("fixed")) {
            this.setState({ show: false });
        }
    }

    render() {
        if (this.state.show === false) {
            return null;
        }

        if (this.props.images === undefined) {
            return null;
        }

        return (
            <div
                style={{ zIndex: 11 }}
                className="fixed bg-slate-800/75 w-full h-full top-0 left-0 items-center z-11"
            >
                <div className="absolute shadow-lg top-4 text-[22px] text-white left-0 right-0 justify-self-center">
                    <label>{this.state.currentIndex + 1}/</label>
                    <label>{this.state.images.length}</label>
                </div>
                <button
                    onClick={() => {
                        this.prevClick();
                    }}
                >
                    <FiArrowLeft
                        size={45}
                        className="absolute left-2 top-[50%] align-middle bg-slate-300/50 p-2 rounded-full hover:bg-slate-400 duration-200 z-10"
                    ></FiArrowLeft>
                </button>
                <button
                    onClick={() => {
                        this.nextClick();
                    }}
                >
                    <FiArrowRight
                        size={45}
                        className="absolute right-2 top-[50%] bg-slate-300/50 p-2 rounded-full 
                        hover:bg-slate-400 duration-200"
                    ></FiArrowRight>
                </button>

                <button
                    onClick={() => {
                        this.props.parent.setState({ imgViewer: false });
                    }}
                >
                    <MdClose
                        size={40}
                        className="absolute top-[10px] right-[10px] text-white bg-slate-700/80 
                                rounded-full p-[10px] hover:bg-slate-500 duration-200 z-200"
                    ></MdClose>
                </button>
                <img
                    className="w-max h-max max-w-[80%] max-h-[80%] shadow-2xl object-contain rounded-lg
                                left-0 right-0 absolute top-0 bottom-0 m-auto"
                    src={this.state.images[this.state.currentIndex]}
                    alt=""
                ></img>
            </div>
        );
    }
}

export default ImageViewer;
