import axios from "axios";
import React from "react";
import { BiLeftArrow, BiPlus, BiRightArrow } from "react-icons/bi";
import { MdDelete, MdEdit, MdRefresh } from "react-icons/md";
import { server } from "../../static";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

class StoreCategories extends React.Component {
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
            urlParams: [],

            addFormOpen: false,
            editFormOpen: false,

            datalist: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Store Categories";
        this.setData();
    }

    setData() {
        axios
            .get(
                server +
                    "/api/adm/store_categories?page=" +
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

    add() {
        let fdata = new FormData();
        fdata.append("name_tm", document.getElementById("new_ctg_name").value);
        fdata.append(
            "sort_order",
            document.getElementById("new_ctg_name").value
        );
        fdata.append("name_tm", document.getElementById("new_ctg_name").value);
        axios
            .post(
                server +
                    "/api/adm/store_categories?page=" +
                    this.state.current_page,
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    AddModal() {
        return (
            <div className="grid max-w-[400px] rounded-md absolute mx-auto h-max bg-white shadow-lg left-0 right-0 p-2 mt-3">
                <label className="font-bold">New Store Category</label>
                <input
                    min={0}
                    defaultValue={0}
                    id="new_ctg_sort_order"
                    type="number"
                ></input>
                <input placeholder="Ady" id="new_ctg_name"></input>

                <div className="text-[12px]">
                    <button className="bg-green-700 mx-1 p-1 rounded-md text-white">
                        Ýatda saklamak
                    </button>
                    <button
                        className="bg-slate-700 text-white mx-1 p-1 rounded-md"
                        onClick={() => {
                            this.setState({ addFormOpen: false });
                        }}
                    >
                        Ýapmak
                    </button>
                </div>
            </div>
        );
    }

    deleteItem(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") === false) {
            return false;
        }
        axios
            .delete(server + "/api/adm/store_categories/" + id, this.state.auth)
            .then((resp) => {
                toast.success("Deleted successfully");
                this.setData();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error");
            });
    }

    editPromp(id, name) {
        let newName = window.prompt("Täze ady", name);

        if (newName === null) {
            return null;
        }

        let fdata = new FormData();
        fdata.append("name_tm", newName);
        axios
            .post(
                server + "/api/adm/store_categorie/" + id,
                fdata,
                this.state.auth
            )
            .then((resp) => {
                this.setData();
            });
    }

    render() {
        return (
            <div className="grid">
                <ToastContainer></ToastContainer>
                {this.state.addFormOpen && this.AddModal()}
                {this.state.editFormOpenFormOpen && this.editFormForm()}
                {this.state.isLoading && <CircularProgress></CircularProgress>}

                <div className="flex items-center my-1 border-b text-[20px] font-bold">
                    <h3 className=" p-2">Store Categories</h3>
                    <button
                        onClick={() => {
                            this.setState({ isLoading: true });
                            this.setData();
                        }}
                        className="p-1 rounded-md duration-200 border hover:bg-slate-200 flex items-center mx-1"
                    >
                        <MdRefresh size={20}></MdRefresh>
                    </button>

                    <button
                        className="p-1 rounded-md duration-200 border hover:bg-slate-200 flex items-center mx-1"
                        onClick={() => {
                            this.setState({ addFormOpen: true });
                        }}
                    >
                        <BiPlus size={20}></BiPlus>
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

                <table className="border p-2">
                    <tr>
                        <th>ID</th>
                        <th>Ady</th>
                        <th>Tertibi</th>
                        <th></th>
                    </tr>
                    {this.state.datalist.map((item) => {
                        return (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.name_tm}</td>
                                <td>{item.request_method}</td>
                                <td className="flex text-white">
                                    <MdEdit
                                        onClick={() => {
                                            this.editPromp(
                                                item.id,
                                                item.name_tm
                                            );
                                        }}
                                        size={25}
                                        className="bg-sky-600 rounded-md mr-2 p-1 duration-300 hover:shadow-md hover:bg-sky-700"
                                    ></MdEdit>
                                    <MdDelete
                                        onClick={() => {
                                            this.deleteItem(item.id);
                                        }}
                                        size={25}
                                        className="bg-sky-600 rounded-md mr-2 p-1 duration-300 hover:shadow-md hover:bg-sky-700"
                                    ></MdDelete>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export default StoreCategories;
