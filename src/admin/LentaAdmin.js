import axios from "axios";
import React from "react";
import { BiCalendar } from "react-icons/bi";
import {
    MdCancel,
    MdDelete,
    MdDone,
    MdPerson,
    MdRefresh,
} from "react-icons/md";
import { server } from "../static";
import Pagination from "@mui/material/Pagination";

class LentaAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,

            page_size: "",
            current_page: 1,
            last_page: 1,
            total: 0,
            datalist: [],
            url_params: [],
            filterOpen: false,

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Lenta";
        this.setData();
    }

    setPage(pageNumber) {
        axios
            .get(
                server + "/api/admin/lenta?page=" + pageNumber,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
            });
    }

    setData() {
        axios
            .get(server + "/api/admin/lenta?page=" + this.state.current_page, {
                params: this.state.url_params,
                auth: this.state.auth.auth,
            })
            .then((resp) => {
                this.setState({ datalist: resp.data.data });
                this.setState({ last_page: resp.data.last_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ total: resp.data.total });
                this.setState({ isLoading: false });
            });
    }

    setFilter() {
        let params = {
            name_tm: document.getElementById("filter_name").value,
            status: document.getElementById("filter_status").value,
            category: document.getElementById("filter_category").value,
        };

        this.setState({ url_params: params, current_page: 1 }, () => {
            this.setData();
        });
    }

    onSearchButtonClick() {
        this.setFilter();
    }

    cancelItem(item) {
        let formdata = new FormData();
        formdata.append("active", "False");
        formdata.append("customer", item.customer.id);
        axios
            .put(
                server + "/api/admin/lenta/" + item.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    acceptItem(item) {
        let formdata = new FormData();
        formdata.append("active", "True");
        formdata.append("customer", item.customer.id);
        axios
            .put(
                server + "/api/admin/lenta/" + item.id + "/",
                formdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    deleteItem(item) {
        let result = window.confirm("Bozmaga ynamyňyz barmy");
        if (result == true) {
            axios
                .delete(server + "/api/admin/lenta/" + item.id, this.state.auth)
                .then((resp) => {
                    this.setData();
                });
        }
    }

    render() {
        return (
            <div className="lenta">
                <h3>
                    Lenta ({this.state.total} sany)
                    {this.state.isLoading && <label> Ýüklenýär...</label>}
                </h3>

                <div className="actions">
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <label>Täzelemek</label>
                        <MdRefresh className="icon"></MdRefresh>
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
                    {this.state.datalist.map((item, index) => {
                        return (
                            <div
                                key={item.id}
                                className="rounded-md h-max shadow-md w-[300px] text-[12px] m-2 grid p-2"
                            >
                                <label className="flex items-center">
                                    <MdPerson></MdPerson> {item.customer.name}{" "}
                                </label>
                                <label className="flex items-center">
                                    <BiCalendar></BiCalendar> {item.created_at}
                                </label>

                                {item.active === "True" && (
                                    <label className="status">
                                        Kabul edilen
                                    </label>
                                )}
                                {item.active === "False" && (
                                    <label className="status">Garaşylýar</label>
                                )}

                                <div className="">
                                    {/* {item.images.map(itemImg=>{
                                return <a href={server+itemImg.img} target="_blank"><img src={server + itemImg.img}></img></a> 
                            })} */}
                                    <img
                                        alt=""
                                        className="w-full h-[200px] object-cover"
                                        src={server + item.images[0].img}
                                    ></img>
                                </div>
                                <div>
                                    <p className="text">{item.text}</p>
                                    <div className="text-[12px] flex  items-center">
                                        <button
                                            className="flex items-center mx-1 border p-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.acceptItem(item);
                                            }}
                                        >
                                            <MdDone></MdDone>
                                            <label>Kabul etmek</label>
                                        </button>
                                        <button
                                            className="flex items-center mx-1 border p-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.cancelItem(item);
                                            }}
                                        >
                                            <MdCancel></MdCancel>{" "}
                                            <label>Gaýtarmak</label>
                                        </button>
                                        <button
                                            className="flex items-center mx-1 border p-1 hover:bg-slate-200"
                                            onClick={() => {
                                                this.deleteItem(item);
                                            }}
                                        >
                                            <MdDelete></MdDelete>{" "}
                                            <label>Bozmak</label>
                                        </button>
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

export default LentaAdmin;
