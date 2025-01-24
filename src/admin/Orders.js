import axios from "axios";
import React from "react";
import { BiTrash } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import { server } from "../static";
import { Link } from "react-router-dom";
import ProgressIndicator from "./ProgressIndicator";

class Orders extends React.Component {
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

            datalist: [],
            urlParams: [],

            newStoreOpen: false,

            auth: {
                username: localStorage.getItem("admin_username"),
                password: localStorage.getItem("admin_password"),
            },
        };

        document.title = "Sargytlar";
        this.setData();
    }

    setData() {
        axios
            .get(
                server +
                    "/api/adm/orders/?page_size=50&page=" +
                    this.state.current_page,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ datalist: resp.data.data });
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    window.location.href = "/superuser/login";
                }
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    deleteOrder(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true) {
            axios
                .post(
                    server + "/api/adm/orders/delete/" + id,
                    {},
                    { auth: this.state.auth }
                )
                .then((resp) => {
                    this.setData();
                });
        }
    }

    render() {
        return (
            <div className="orders w-full text-[12px]">
                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>

                <div className=" flex flex-wrap items-center text-slate-600">
                    <label className="text-lg">
                        Sargytlar {this.state.total}
                    </label>

                    <button
                        className="px-2 "
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                    >
                        <MdRefresh size={20} className=""></MdRefresh>
                    </button>
                </div>

                <table className="w-full text-[12px] border">
                    <tr className="bg-slate-200">
                        <th>ID</th>
                        <th>Sargyt ediji</th>
                        <th>Kabul ediji</th>
                        <th>Wagty</th>
                        <th>Summasy</th>
                        <th>Statusy</th>
                        <th>Hereket</th>
                    </tr>
                    {this.state.datalist.map((item) => {
                        return (
                            <tr>
                                <td>
                                    <a
                                        className="p-1"
                                        href={"/superuser/orders/" + item.id}
                                    >
                                        {item.id}{" "}
                                    </a>
                                </td>

                                <td>
                                    <Link
                                        to={
                                            "/superuser/stores/" +
                                            item.sender.id
                                        }
                                    >
                                        {item.sender.name}{" "}
                                    </Link>
                                </td>

                                <td>
                                    <Link
                                        to={
                                            "/superuser/stores/" +
                                            item.accepter.id
                                        }
                                    >
                                        {item.accepter.name}
                                    </Link>
                                </td>

                                <td>{item.created_at}</td>
                                <td>{item.total} TMT</td>
                                <td>{item.status}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            this.deleteOrder(item.id)
                                        }
                                    >
                                        <BiTrash
                                            className="hover:text-red-600"
                                            size={20}
                                        ></BiTrash>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export default Orders;
