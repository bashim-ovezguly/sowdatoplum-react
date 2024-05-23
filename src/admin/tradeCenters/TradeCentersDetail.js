import axios from "axios";
import React from "react";
import { BiMap } from "react-icons/bi";
import { server } from "../../static";
import LocationSelector from "../../admin/LocationSelector";

class TradeCentersDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            datalist: [],
            all_locations: [],

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            customers: [],
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

        document.title = "Satyjylar";
        this.setData();
    }

    setData() {
        let id = window.location.pathname.split("/")[3];

        axios
            .get(server + "/api/admin/trade_centers/" + id, this.state.auth)
            .then((resp) => {
                this.setState({ name_tm: resp.data.name_tm });
                this.setState({ id: resp.data.id });
                this.setState({ location_name: resp.data.location });
                this.setState({ location_id: resp.data.location_id });
                this.setState({ img: resp.data.img_m });
                this.setState({ sort_order: resp.data.sort_order });
                this.setState({ isLoading: false });
            });
    }

    edit_img() {
        let id = window.location.pathname.split("/")[3];
        var fdata = new FormData();
        fdata.append("img_l", document.getElementById("imgselector").files[0]);

        axios
            .put(
                server + "/api/admin/trade_centers/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                alert("Ýatda saklandy");
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

        axios
            .put(
                server + "/api/admin/trade_centers/" + id + "/",
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    delete(id) {
        var result = window.confirm("Bozmaga ynamyňyz barmy?");

        if (result === true) {
            axios
                .post(
                    server + "/api/admin/trade_centers/delete/" + id,
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
            <div className="max-w-[600px]">
                <h3>{this.state.name_tm} </h3>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}
                {this.state.isLoading && <h3>Ýüklenýär...</h3>}

                <input
                    id="imgselector"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                    onChange={() => {
                        this.edit_img();
                    }}
                ></input>

                <div className="grid">
                    <img alt="" src={this.state.img}></img>

                    <input
                        id="name_tm"
                        defaultValue={this.state.name_tm}
                        placeholder="Ady"
                    ></input>
                    <input
                        id="sort_order"
                        defaultValue={this.state.sort_order}
                        placeholder="Tertip belgisi"
                    ></input>
                    <button
                        className="border rounded-md  flex items-center p-2"
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                    >
                        <BiMap className=" mr-2 hover:bg-slate-300"></BiMap>
                        <label>
                            Ýerleşýän ýeri - {this.state.location_name}
                        </label>
                    </button>
                    <div className="flex items-center">
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
