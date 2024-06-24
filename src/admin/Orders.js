import axios from "axios";
import React from "react";
import { BiLeftArrow, BiRightArrow, BiTrash } from "react-icons/bi";
import { MdDelete, MdRefresh, MdRemove } from "react-icons/md";
import { server } from "../static";
import { Link } from "react-router-dom";

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

        document.title = "Myhmanlar";
        this.setData();
    }

    setData() {
        axios
            .get(
                server +
                    "/api/admin/orders/?page_size=50&page=" +
                    this.state.current_page,
                { auth: this.state.auth }
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ datalist: resp.data.data });
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    window.location.href = "/admin/login";
                }
            });
    }

    deleteOrder(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === true) {
            axios
                .post(
                    server + "/api/admin/orders/delete/" + id,
                    {},
                    this.state.auth
                )
                .then((resp) => {
                    this.setData();
                });
        }
    }

    render() {
        return (
            <div className="orders w-full">
                <h3>
                    Sargytlar {this.state.total}
                    {this.state.isLoading && (
                        <span className="loader">
                            {" "}
                            - Maglumat ýüklenýär... Garaşyň
                        </span>
                    )}
                </h3>

                <div className="managment">
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

                <table className="w-full text-[12px] border">
                    <tr className="bg-slate-200">
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Store</th>
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
                                    <a href={"/admin/orders/" + item.id}>
                                        {item.id}{" "}
                                    </a>
                                </td>

                                <td>
                                    <Link
                                        to={
                                            "/admin/customers/" +
                                            item.customer.id
                                        }
                                    >
                                        {item.customer.name}{" "}
                                        {item.customer.phone}
                                    </Link>
                                    {item.customer_deleted === "True" &&
                                        " (Bozdy)"}
                                </td>
                                <td>
                                    <a href={"/admin/stores/" + item.store_id}>
                                        {item.store}
                                    </a>
                                </td>
                                <td>
                                    <a
                                        href={
                                            "/admin/customers/" +
                                            item.store_customer_id
                                        }
                                    >
                                        {item.store_customer}
                                    </a>
                                    {item.accepter_deleted === "True" &&
                                        " (Bozdy)"}
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
