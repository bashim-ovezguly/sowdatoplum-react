import axios from "axios";
import React from "react";
import { BiMap, BiPlus } from "react-icons/bi";
import { MdCheck, MdDelete, MdPerson, MdRefresh } from "react-icons/md";
import { server } from "../../static";
import { AiOutlineShop } from "react-icons/ai";
import LocationSelector from "../LocationSelector";
import Pagination from "@mui/material/Pagination";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

class AdminCarParts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            newCarOpen: false,
            selected_images: [],
            categories: [],
            transmissions: [],
            models: [],
            marks: [],
            stores: [],

            datalist: [],

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Awtoşaýlar";
        this.setData();
    }

    saveNewCar() {
        let error = false;
        let errorList = [];

        if (error == true) {
            let msg = "Ýalňyşyklaryň sanawy:";
            for (let i = 0; i < errorList.length; i++) {
                msg = msg + "\n - " + errorList[i];
            }
            alert(msg);
            return null;
        }

        var formdata = new FormData();

        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("address", document.getElementById("address").value);
        formdata.append(
            "body_type",
            document.getElementById("body_type").value
        );
        formdata.append("made_in", document.getElementById("made_in").value);
        formdata.append("location", this.state.location_id);
        formdata.append("mark", document.getElementById("mark").value);
        formdata.append("model", document.getElementById("model").value);
        formdata.append("color", document.getElementById("color").value);
        formdata.append("fuel", document.getElementById("fuel").value);
        formdata.append(
            "transmission",
            document.getElementById("transmission").value
        );
        formdata.append("year", document.getElementById("year").value);
        formdata.append("millage", document.getElementById("millage").value);
        formdata.append("wd", document.getElementById("wd").value);
        formdata.append("motor", document.getElementById("motor").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("store", document.getElementById("store").value);
        formdata.append("customer", document.getElementById("customer").value);

        let imageFiles = document.getElementById("imgselector").files;

        for (let i = 0; i < imageFiles.length; i++) {
            formdata.append("images", imageFiles[i]);
        }

        if (this.props.stores === "all") {
            formdata.append("store", document.getElementById("store").value);
        } else {
            if (this.state.storeID != null) {
                formdata.append("store", this.state.storeID);
            }
        }

        if (document.getElementById("swap").checked === true) {
            formdata.append("swap", true);
        }

        if (document.getElementById("credit").checked === true) {
            formdata.append("credit", true);
        }

        if (document.getElementById("none_cash_pay").checked === true) {
            formdata.append("none_cash_pay", true);
        }

        if (document.getElementById("recolored").checked === true) {
            formdata.append("recolored", true);
        }
        this.setState({ isLoading: true });
        axios
            .post(server + "/mob/cars", formdata, { auth: this.state.auth })
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("Awtoulag üstünlikli goşuldy");
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    addModalForm() {
        if (this.state.newCarOpen === false) {
            return null;
        }

        return (
            <div className="add grid absolute border rounded-md shadow-md p-[5px] bg-white">
                <label>
                    Saýlanan surat jemi: {this.state.selected_images.length}{" "}
                    sany{" "}
                </label>

                <input
                    onChange={(event) => {
                        console.log(event.target.files.length);
                    }}
                    id="imgselector"
                    multiple
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <div
                    className="border rounded p-5px"
                    onClick={() => {
                        this.setState({ locationSelectorOpen: true });
                    }}
                >
                    <BiMap
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                        className="icon"
                    ></BiMap>
                    <label>{this.state.location_name}</label>
                </div>
                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <select id="store">
                    <option value={""}>Söwda nokady</option>
                    {this.state.stores.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name_tm}
                            </option>
                        );
                    })}
                </select>

                <select id="customer">
                    <option hidden value={""}>
                        Ulanyjy
                    </option>
                    {this.state.customers.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {" "}
                                {item.phone} {item.name}
                            </option>
                        );
                    })}
                </select>

                <select
                    onChange={() => {
                        this.setState(
                            {
                                selectedMark:
                                    document.getElementById("mark").value,
                            },
                            () => {
                                this.setData();
                            }
                        );
                    }}
                    id="mark"
                >
                    <option hidden value={""}>
                        Markasy
                    </option>
                    {this.state.marks.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <select id="model">
                    <option hidden value={""}>
                        Model
                    </option>
                    {this.state.models.map((item) => {
                        return (
                            <option id={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>

                <input
                    id="price"
                    placeholder="Bahasy (TMT)"
                    type={"number"}
                    min={0}
                ></input>

                <textarea
                    id="body_tm"
                    placeholder="Giňişleýin maglumat..."
                ></textarea>

                <input
                    id="phone"
                    className="phone"
                    placeholder="Telefon belgisi"
                ></input>

                <div>
                    <button
                        onClick={() => {
                            this.saveNewCar();
                        }}
                        className="save"
                    >
                        Goşmak
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ newCarOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    setPage(pageNumber) {
        this.setState({ current_page: pageNumber });
        axios
            .get(server + "/api/admin/parts?page=" + pageNumber, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
            });
    }

    accept(id) {
        let formdata = new FormData();
        formdata.append("status", "accepted");
        axios
            .put(server + "/api/admin/parts/" + id + "/", formdata, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setData();
                toast.success("Kabul edildi");
            });
    }

    getLocations() {
        axios.get(server + "/mob/index/locations/all").then((resp) => {
            this.setState({ allLocations: resp.data });
        });
    }

    setData() {
        this.setState({ isLoading: true });

        this.getLocations();
        this.getCustomers();

        let q = "";
        if (this.state.selectedMark !== undefined) {
            q = "?mark=" + this.state.selectedMark;
        }

        axios.get(server + "/mob/index/part" + q).then((resp) => {
            this.setState({
                categories: resp.data.categories,
                transmissions: resp.data.transmissions,
                countries: resp.data.made_in_countries,
                colors: resp.data.colors,
                wds: resp.data.wheel_drives,
                models: resp.data.models,
                marks: resp.data.marks,
                fuels: resp.data.fuels,
                bodyTypes: resp.data.body_types,
            });
            this.setState({ isLoading: false });
        });

        axios
            .get(server + "/api/admin/stores?pagination=None", {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ stores: resp.data });
            });

        axios
            .get(server + "/api/admin/parts/?page=" + this.state.current_page, {
                auth: this.state.auth,
            })
            .then((resp) => {
                this.setState({ locations: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ datalist: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    getCustomers() {
        axios.get(server + "/mob/customers", this.state.auth).then((resp) => {
            this.setState({ customers: resp.data });
        });
    }

    deletePart(id) {
        let result = window.confirm("Bozmaga ynamyňyz barmy?");
        if (result === false) {
            return null;
        }

        axios
            .post(server + "/mob/parts/delete/" + id, {}, this.state.auth)
            .then((resp) => {
                this.setData();
            });
    }

    render() {
        return (
            <div className="">
                <ToastContainer
                    autoClose={10000}
                    closeOnClick={true}
                ></ToastContainer>
                <h3 className="border-b">Awtoşaýlar {this.state.total} </h3>

                <div className="flex items-center text-[12px] text-sky-600 mr-2">
                    <div
                        onClick={() => {
                            this.setData();
                        }}
                        className="flex items-center text-[12px] text-sky-600 m-2 hover:text-slate-500"
                    >
                        <label>Refresh</label>
                        <MdRefresh size={20}></MdRefresh>
                    </div>
                    <div
                        onClick={() => {
                            this.setState({
                                newCarOpen: !this.state.newCarOpen,
                            });
                        }}
                        className="flex items-center text-[12px] text-sky-600 m-2 hover:text-slate-500"
                    >
                        <label>Goşmak</label>
                        <BiPlus size={20} className="rounded "></BiPlus>
                    </div>
                </div>

                {this.addModalForm()}

                {this.state.isLoading && <CircularProgress></CircularProgress>}
                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={Number(this.state.last_page)}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap">
                    {this.state.datalist.map((item, index) => {
                        let img = "";
                        if (item.img === "") {
                            img = "/default.png";
                        } else {
                            img = server + item.img;
                        }

                        let status = null;

                        if (item.status === "pending") {
                            status = (
                                <label className="bg-orange-600 text-white w-max rounded-lg p-1">
                                    Garaşylýar
                                </label>
                            );
                        }
                        if (item.status === "canceled") {
                            status = (
                                <label className="bg-red-600 text-white w-max rounded-lg p-1">
                                    Gaýtarlan
                                </label>
                            );
                        }

                        if (item.status === "accepted") {
                            status = (
                                <label className="bg-green-600 text-white w-max rounded-lg p-1">
                                    Kabul edilen
                                </label>
                            );
                        }

                        return (
                            <div
                                key={item.id}
                                className="grid border rounded-lg overflow-hidden border-slate-300 m-2 w-[150px] text-[12px]"
                            >
                                <div>
                                    <Link to={"/admin/parts/" + item.id}>
                                        <img
                                            className="h-[150px] w-full object-cover"
                                            alt=""
                                            src={img}
                                        ></img>
                                    </Link>
                                    <div className="text grid p-2">
                                        <label className="font-bold">
                                            {item.name_tm}
                                        </label>
                                        <label className="text-sky-600 font-bold">
                                            {item.price}
                                        </label>
                                        {status}
                                        <div className="flex items-center">
                                            <AiOutlineShop></AiOutlineShop>
                                            <label className="name">
                                                {item.store}
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <MdPerson></MdPerson>
                                            <label className="name">
                                                {item.customer_name}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-slate-600">
                                        <MdDelete
                                            size={30}
                                            className="p-1 rounded-md hover:bg-slate-300"
                                            onClick={() => {
                                                this.deletePart(item.id);
                                            }}
                                        ></MdDelete>
                                        <MdCheck
                                            size={30}
                                            className="p-1 rounded-md hover:bg-slate-300"
                                            onClick={() => {
                                                this.accept(item.id);
                                            }}
                                        ></MdCheck>
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

export default AdminCarParts;
