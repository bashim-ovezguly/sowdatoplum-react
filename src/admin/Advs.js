import axios from "axios";
import React from "react";
import { BiLeftArrow, BiPlus, BiRightArrow } from "react-icons/bi";
import { MdClose, MdRefresh } from "react-icons/md";
import { server } from "../static";
import "./advs.css";

class Ads extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],
            statuses: [],
            page_size: "",
            current_page: 1,
            last_page: "",
            total: "",
            addOpen: false,
            selectedImages: [],

            ads: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Söwda nokatlary";
        this.setData();
    }

    next_page() {
        if (this.state.last_page >= this.state.current_page + 1) {
            var next_page_number = this.state.current_page + 1;
            this.setState({ current_page: next_page_number }, () => {
                this.setData();
            });
        }
    }

    prev_page() {
        if (this.state.current_page - 1 !== 0) {
            this.setState({ current_page: this.state.current_page - 1 }, () => {
                this.setData();
            });
        }
    }

    setData() {
        axios
            .get(server + "/api/admin/ads/?page=" + this.state.current_page, {
                auth: this.state.auth.auth,
            })
            .then((resp) => {
                this.setState({ locations: resp.data.data, isLoading: false });
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ ads: resp.data.data });
            });
    }

    onImgSelect() {
        var files = document.getElementById("imgselector").files;
        var t = [];

        for (let i = 0; i < this.state.selectedImages.length; i++) {
            t.push(this.state.selectedImages[i]);
        }

        for (let i = 0; i < files.length; i++) {
            if (t.find((x) => x.name == files[i].name) == undefined) {
                t.push(files[i]);
            }
        }

        this.setState({ selectedImages: t });
    }

    addModal() {
        if (this.state.addOpen === false) {
            return null;
        }

        return (
            <div className="addAdv">
                <label>Täze bildiriş</label>
                <input id="advName" placeholder="ady"></input>
                {/* <input onChange={()=>{this.onImgSelect()}} 
                        id="imgselector" 
                        multiple 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                        type='file'></input> */}

                <div>
                    <button
                        onClick={() => {
                            this.addNewAdv();
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

    addNewAdv() {
        var formdata = new FormData();

        formdata.append("title_tm", document.getElementById("advName").value);

        this.setState({ isLoading: true });
        axios
            .post(server + "/api/admin/ads/", formdata, this.state.auth)
            .then((resp) => {
                this.setState({ isLoading: false });
                let newAdvId = resp.data.id;
                alert("Biliriş goşuldy");
                window.location.href = "/admin/advs/" + newAdvId;
            })
            .catch((err) => {
                alert("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        return (
            <div className="ads">
                <h3>
                    Bildirişler ({this.state.total} sany)
                    {this.state.isLoading && <label> Ýüklenýär...</label>}
                </h3>

                <div className="managment">
                    <button
                        onClick={() => {
                            this.setState({ addOpen: true });
                        }}
                        className="add"
                    >
                        <label>Maglumat goşmak</label>
                        <BiPlus></BiPlus>
                    </button>

                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="create"
                    >
                        <label>Täzelemek</label>
                        <MdRefresh></MdRefresh>
                    </button>
                </div>

                {this.addModal()}
                {/* {this.filter_modal()} */}
                <div className="pagination">
                    <button
                        onClick={() => {
                            this.prev_page();
                        }}
                    >
                        <BiLeftArrow></BiLeftArrow>
                    </button>
                    <label>
                        Sahypa {this.state.current_page}/{this.state.last_page}{" "}
                    </label>
                    <button
                        onClick={() => {
                            this.next_page();
                        }}
                    >
                        <BiRightArrow></BiRightArrow>
                    </button>
                </div>

                <div className="cards">
                    {this.state.ads.map((item, index) => {
                        let img = "";
                        if (item.img == "") {
                            img = "/default.png";
                        } else {
                            img = server + item.img;
                        }
                        return (
                            <a
                                href={"/admin/advs/" + item.id}
                                key={item.id}
                                className="adv_card"
                            >
                                <img src={img}></img>
                                <label className="name">{item.title_tm}</label>
                                <label>{item.created_at}</label>
                                <label>{item.location}</label>
                                <label>Tertip belgisi: {item.sort_order}</label>
                                <label>{item.customer}</label>
                                <label>{item.type}</label>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Ads;
