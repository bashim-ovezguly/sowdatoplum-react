import axios from "axios";
import React from "react";
import { BiLeftArrowAlt, BiMap, BiRightArrowAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { server } from "../static";
import "./locationSelector.css";

class LocationSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            locations: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        this.setData();
    }

    onClose() {}

    setData() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ locations: resp.data }, () => {
                this.setState({ loading: false });
            });
        });
    }

    getBackLocation(id) {
        this.setState({ loadingLocation: true });
        axios
            .get(server + "/mob/index/locations/all?parent=" + id)
            .then((resp) => {
                this.setState({ locations: resp.data }, () => {
                    this.setState({ loadingLocation: false });
                    this.setState({ locationBackId: resp.data[0].back_id });
                    this.setState({
                        parentLocationName: resp.data[0].parent.name,
                    });
                });
            });
    }

    setLocation(location) {
        if (location.childs > 0) {
            this.setState({ loadingLocation: true });
            this.setState({ parentLocationName: location.name_tm });
            this.setState({ loadingLocation: true });

            axios
                .get(server + "/mob/index/locations/all?parent=" + location.id)
                .then((resp) => {
                    this.setState({ locations: resp.data }, () => {
                        this.setState({ loadingLocation: false });
                        this.setState({ locationBackId: resp.data[0].back_id });
                        this.setState({
                            parentLocationName: resp.data[0].parent.name,
                        });
                    });
                });
        }
    }

    render() {
        let loader = <label>Ýüklenýär, garaşyň...</label>;

        if (this.state.loading === false) {
            loader = null;
        }
        let list = null;

        if (this.state.loading === false) {
            list = (
                <div className="grid">
                    {this.state.locations.map((item) => {
                        return (
                            <div className="grid grid-cols-[max-content_auto] top-[5%] m-1 duration-300 text-slate-500">
                                <BiMap
                                    size={35}
                                    className=" hover:bg-slate-300 rounded-md p-[5px]"
                                    onClick={() => {
                                        this.props.parent.setState({
                                            location_id: item.id,
                                        });
                                        this.props.parent.setState({
                                            locationSelectorOpen: false,
                                        });
                                        this.props.parent.setState({
                                            location_name: item.name_tm,
                                        });
                                    }}
                                ></BiMap>
                                <div
                                    onClick={() => {
                                        this.setLocation(item);
                                    }}
                                    className="grid items-center grid-cols-[auto_max-content] hover:bg-slate-200 rounded-md px-2"
                                >
                                    <label>
                                        {item.name_tm} {item.childs}
                                    </label>
                                    <BiRightArrowAlt
                                        size={25}
                                    ></BiRightArrowAlt>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        let parentLocationName = null;
        if (this.state.parentLocationName !== undefined) {
            parentLocationName = (
                <div
                    onClick={() => {
                        this.getBackLocation(this.state.locationBackId);
                    }}
                    className="flex items-center text-[14px] bg-slate-200 my-[2px] text-slate-600 rounded-md p-[5px]"
                >
                    {/* <BiLeftArrow ></BiLeftArrow> */}
                    <BiLeftArrowAlt
                        className="p-[2px]"
                        size={25}
                    ></BiLeftArrowAlt>
                    <label>{this.state.parentLocationName}</label>
                </div>
            );
        }

        return (
            <div
                className="fixed top-[5%] z-10 mx-auto left-0 right-0 shadow-md max-w-[300px] max-h-[500px] overflow-y-auto
                                rounded-lg bg-white border border-solid border-slate-300"
            >
                <div className="m-[10px]">
                    <div className="flex justify-between items-center border-slate-300 border-b">
                        <label className="text-blue-900 font-bold text-[20px] mx-2">
                            Ýer saýlaň
                        </label>
                        <MdClose
                            size={40}
                            onClick={() => {
                                if (this.props.onClose !== undefined) {
                                    this.props.onClose();
                                }

                                this.props.parent.setState({
                                    locationSelectorOpen: false,
                                });
                            }}
                            className="rounded-full p-[10px] hover:bg-slate-200 duration-300 "
                        ></MdClose>
                    </div>
                    {parentLocationName}
                    {loader}
                    {list}
                </div>
            </div>
        );
    }
}

export default LocationSelector;
