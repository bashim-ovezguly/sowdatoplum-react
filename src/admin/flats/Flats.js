import axios from "axios";
import React from "react";
import { BiMap, BiPlus } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import { server } from "../../static";
import LocationSelector from "../LocationSelector";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";

class Flats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],

            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",

            addOpen: false,

            locationSelectorOpen: false,
            location_id: "",
            location_name: "",

            flats: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Gozgalmaýan emläkler";
        this.setData();
    }

    setData() {
        axios
            .get(
                server + "/api/admin/flats/?page=" + this.state.current_page,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ isLoading: false });
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ flats: resp.data.data });
            });

        axios.get(server + "/mob/index/flat").then((resp) => {
            this.setState({ categories: resp.data.categories });
            this.setState({ remont_states: resp.data.remont_states });
            this.setState({ streets: resp.data.streets });
        });
    }

    addModal() {
        if (this.state.addOpen === false) {
            return null;
        }

        return (
            <div className="add_flat">
                <label>Täze emläk</label>

                <div className="rdbtns">
                    <label>Kärende</label>
                    <input id="for-rent" name="rent" type="radio"></input>
                    <label>Satlyk</label>
                    <input id="for-sale" name="rent" type="radio"></input>
                </div>

                <div>
                    <BiMap
                        onClick={() => {
                            this.setState({ locationSelectorOpen: true });
                        }}
                        className="icon"
                    ></BiMap>
                    <label>{this.state.location_name}</label>
                </div>
                <select id="category">
                    <option>Kategoriýasy</option>
                    {this.state.categories.map((item) => {
                        return <option value={item.id}>{item.name_tm}</option>;
                    })}
                </select>
                <select id="remont_state">
                    <option value={""}>Remont yagdayy</option>
                    {this.state.remont_states.map((item) => {
                        return <option value={item.id}>{item.name_tm}</option>;
                    })}
                </select>

                {this.state.locationSelectorOpen && (
                    <LocationSelector parent={this}></LocationSelector>
                )}

                <input
                    id="price"
                    type="number"
                    min={0}
                    placeholder="Bahasy"
                ></input>
                <input id="address" type="text" placeholder="Salgysy"></input>
                <div>
                    <label>Eýesinden</label>
                    <input id="own" type="checkbox"></input>
                </div>

                <input id="floor" type="number" placeholder="Gat sany"></input>
                <input
                    id="at_floor"
                    type="number"
                    placeholder="Ýerleşýän gaty"
                ></input>
                <input id="room" type="number" placeholder="Otag sany"></input>
                <input id="square" type="number" placeholder="Meýdany"></input>
                <input
                    id="people"
                    type="number"
                    placeholder="Ýazgydaky adam sany"
                ></input>
                <input id="phone" placeholder="Telefon belgisi"></input>
                <div>
                    <label id="credit">Karzyna</label>
                    <input type="checkbox"></input>
                </div>
                <div>
                    <label id="swap">Çalşyk</label>
                    <input type="checkbox"></input>
                </div>
                <div>
                    <label id="ipoteka">Ipoteka</label>
                    <input type="checkbox"></input>
                </div>
                <textarea id="detail"></textarea>

                <input
                    id="imgselector"
                    multiple
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                ></input>

                <div>
                    <button
                        onClick={() => {
                            this.saveNewFlat();
                        }}
                    >
                        Goşmak
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ addOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    saveNewFlat() {
        var formdata = new FormData();
        formdata.append("category", document.getElementById("category").value);

        if (document.getElementById("remont_state").value != "") {
            formdata.append(
                "remont_state",
                document.getElementById("remont_state").value
            );
        }

        formdata.append("room", document.getElementById("room").value);
        formdata.append("floor", document.getElementById("floor").value);
        formdata.append("at_floor", document.getElementById("at_floor").value);
        formdata.append("square", document.getElementById("square").value);
        formdata.append("phone", document.getElementById("phone").value);
        formdata.append("people", document.getElementById("people").value);
        formdata.append("price", document.getElementById("price").value);
        formdata.append("address", document.getElementById("address").value);
        formdata.append("detail", document.getElementById("detail").value);
        formdata.append("location", this.state.location_id);

        if (document.getElementById("credit").checked) {
            formdata.append("credit", true);
        }

        if (document.getElementById("for-rent").checked) {
            formdata.append("for_rent", true);
        } else {
            formdata.append("for_rent", false);
        }

        if (document.getElementById("swap").checked) {
            formdata.append("swap", true);
        }

        if (document.getElementById("ipoteka").checked) {
            formdata.append("ipoteka", true);
        }

        if (document.getElementById("own").checked) {
            formdata.append("own", true);
        }

        for (
            let i = 0;
            i < document.getElementById("imgselector").files.length;
            i++
        ) {
            formdata.append(
                "images",
                document.getElementById("imgselector").files[i]
            );
        }

        this.setState({ isLoading: true });

        axios
            .post(server + "/mob/flats", formdata, this.state.auth)
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("Emläk goşuldy");
                this.setData();
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    setPage(pageNumber) {
        axios
            .get(
                server + "/api/admin/flats?page=" + pageNumber,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ flats: resp.data.data });
            });
    }

    render() {
        return (
            <div className="flats">
                {this.addModal()}
                <h3>
                    Gozgalmaýan emläkler {this.state.total}
                    {this.state.isLoading && <label> Ýüklenýär...</label>}
                </h3>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            this.setState({ addOpen: true });
                        }}
                        className="add"
                    >
                        <BiPlus></BiPlus>
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="create"
                    >
                        <MdRefresh></MdRefresh>
                    </button>
                </div>

                <Pagination
                    className="pagination"
                    onChange={(event, page) => {
                        this.setPage(page);
                    }}
                    count={this.state.last_page}
                    variant="outlined"
                    shape="rounded"
                />

                <div className="flex flex-wrap justify-center">
                    {this.state.flats.map((item, index) => {
                        let img = "";
                        if (item.img === "") {
                            img = "/default.png";
                        } else {
                            img = server + item.img;
                        }
                        return (
                            <Link
                                to={"/admin/flats/" + item.id}
                                key={item.id}
                                className="w-[200px] sm:w-[150px] text-slate-600 text-[12px] grid grid-rows-[max-content_auto] m-2 shadow-md rounded-md overflow-hidden"
                            >
                                <img
                                    alt=""
                                    className="w-full h-[200px] sm:h-[150px] object-cover"
                                    src={img}
                                ></img>
                                <div className="grid p-2 h-max">
                                    <label className="font-bold">
                                        {item.name}
                                    </label>
                                    <label>{item.location}</label>
                                    <label className="text-green-600 font-bold">
                                        {item.status}
                                    </label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Flats;
