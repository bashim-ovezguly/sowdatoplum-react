import axios from "axios";
import React from "react";
import { BiMap } from "react-icons/bi";
import { server } from "../../static";
import LocationSelector from "../../admin/LocationSelector";
import { toast, ToastContainer } from "react-toastify";
import { Switch } from "@mui/material";

class TradeCentersDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            all_locations: [],

            locationSelectorOpen: false,
            location_id: "",
            locations__name: "",

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Söwda merkezler";
    }

    componentWillMount() {
        this.setData();
    }

    setData() {
        let id = window.location.pathname.split("/")[3];

        axios
            .get(server + "/api/adm/trade_centers/" + id, this.state.auth)
            .then((resp) => {
                if (resp.data.active === true) {
                    document.getElementById("acttive").defaultChecked = true;
                }

                this.setState({
                    name_tm: resp.data.name_tm,
                    id: resp.data.id,
                    location_name: resp.data.location,
                    location_id: resp.data.location_id,
                    img: resp.data.img_m,
                    sort_order: resp.data.sort_order,
                    isLoading: false,
                });

                if (resp.data.active === "true") {
                    this.setState({ active: true }, () => {
                        console.log(this.state.active);
                    });
                } else {
                    this.setState({ active: false }, () => {
                        console.log(this.state.active);
                    });
                }
            });
    }

    changeImage() {
        let id = window.location.pathname.split("/")[3];
        var fdata = new FormData();
        fdata.append("img_l", document.getElementById("imgselector").files[0]);

        axios
            .put(
                server + "/api/adm/trade_centers/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            });
    }

    save() {
        let id = window.location.pathname.split("/")[3];
        this.setState({ isLoading: true });
        var fdata = new FormData();
        fdata.append("name_tm", document.getElementById("name_tm").value);
        fdata.append("sort_order", document.getElementById("sort_order").value);
        fdata.append("location", this.state.location_id);

        if (document.getElementById("active").checked) {
            fdata.append("active", "true");
        } else {
            fdata.append("active", "false");
        }

        axios
            .put(
                server + "/api/adm/trade_centers/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                toast.success("Ýatda saklandy");
                this.setData();
            });
    }

    delete(id) {
        var result = window.confirm("Bozmaga ynamyňyz barmy?");

        if (result === true) {
            axios
                .post(
                    server + "/api/adm/trade_centers/delete/" + id,
                    {},
                    this.state.auth
                )
                .then((resp) => {
                    window.history.back();
                });
        }
    }

    render() {
        return (
            <div className="max-w-[600px] m-auto">
                <ToastContainer
                    autoClose={3000}
                    closeOnClick={true}
                ></ToastContainer>

                <h3>{this.state.name_tm} </h3>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}
                {this.state.isLoading && <h3>Ýüklenýär...</h3>}

                <div className="flex items-center ">
                    {this.state.active === true && (
                        <Switch id="active" defaultChecked></Switch>
                    )}
                    {this.state.active === false && (
                        <Switch id="active"></Switch>
                    )}

                    <label>Aktiw</label>
                </div>

                <input
                    id="imgselector"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                    onChange={() => {
                        this.changeImage();
                    }}
                ></input>

                <div className="grid">
                    <img
                        className="rounded-md w-full object-contain border max-h-[300px]"
                        alt=""
                        src={this.state.img}
                    ></img>

                    <label className="text-[12px]">Ady</label>
                    <input
                        id="name_tm"
                        defaultValue={this.state.name_tm}
                        placeholder="Ady"
                    ></input>
                    <label className="text-[12px]"> Tertibi</label>

                    <input
                        id="sort_order"
                        defaultValue={this.state.sort_order}
                        placeholder="Tertip belgisi"
                    ></input>
                    <label className="text-[12px]">Ýerleşýän ýeri</label>

                    <button
                        className="border rounded-md  flex items-center p-2"
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                    >
                        <BiMap className=" mr-2 hover:bg-slate-300"></BiMap>
                        <label>{this.state.location_name}</label>
                    </button>
                    <div className="flex items-center text-[13px]">
                        <button
                            className="rounded-md p-2 mx-1 bg-green-600 text-white w-max"
                            onClick={() => {
                                this.save();
                            }}
                        >
                            Ýatda saklamak
                        </button>
                        <button
                            className="rounded-md p-2 mx-1 bg-red-600 text-white w-max"
                            onClick={() => {
                                this.delete(this.state.id);
                            }}
                        >
                            Bozmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TradeCentersDetail;
