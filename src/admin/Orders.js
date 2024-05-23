import axios from "axios";
import React from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import { server } from "../static";

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
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Myhmanlar";
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
        if (this.state.current_page - 1 != 0) {
            this.setState({ current_page: this.state.current_page - 1 }, () => {
                this.setData();
            });
        }
    }

    setData() {
        axios
            .get(
                server +
                    "/api/admin/orders/?page_size=50&page=" +
                    this.state.current_page,
                this.state.auth
            )
            .then((resp) => {
                this.setState({ last_page: resp.data["last_page"] });
                this.setState({ page_size: resp.data["page_size"] });
                this.setState({ total: resp.data["total"] });
                this.setState({ datalist: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    deleteOrder(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") == true) {
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
            <div className="orders">
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

                <table>
                    <tr>
                        <th>ID</th>
                        <th>Sargyt ediji</th>
                        <th>Söwda nokady</th>
                        <th>Kabul ediji</th>
                        <th>Wagty</th>
                        <th>Summasy</th>
                        <th>Statusy</th>
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
                                    <a
                                        href={
                                            "/admin/customers/" +
                                            item.customer.id
                                        }
                                    >
                                        {item.customer.name}{" "}
                                        {item.customer.phone}
                                    </a>
                                    {item.customer_deleted == "True" &&
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
                                    {item.accepter_deleted == "True" &&
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
                                        Bozmak
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
