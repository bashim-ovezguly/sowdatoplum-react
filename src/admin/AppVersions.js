import axios from "axios";
import React from "react";
import { MdDelete } from "react-icons/md";
import { server } from "../static";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

class AppVersions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            apk_list: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "App Versions";
        this.setData();
    }

    delete(id) {
        if (window.confirm("Bozmaga ynamyňyz barmy?") == false) {
            return null;
        }
        this.setState({ isLoading: true });

        axios
            .delete(server + "/api/adm/apks/" + id, this.state.auth)
            .then((resp) => {
                this.setData();
                toast.error("APK deleted");
            })
            .finally((resp) => {
                this.setState({ isLoading: false });
            });
    }

    add() {
        if (document.getElementById("version").value == "") {
            toast.error("Version is empty");
            return null;
        }
        this.setState({ isLoading: true });
        let fdata = new FormData();
        fdata.append("apk", document.getElementById("apk_file").files[0]);
        fdata.append("version", document.getElementById("version").value);

        axios
            .post(server + "/api/adm/apks/", fdata, this.state.auth)
            .then((resp) => {
                this.setData();
                toast.success("New APK added successfully");
            });
    }

    setData() {
        axios.get(server + "/api/adm/apks", this.state.auth).then((resp) => {
            this.setState({ apk_list: resp.data.data, isLoading: false });
        });
    }

    render() {
        return (
            <div className="app_versions">
                <ToastContainer
                    autoClose={false}
                    closeOnClick={true}
                ></ToastContainer>
                <h3>App Versions</h3>

                <div className="flex text-[12px]">
                    <input id="apk_file" type="file"></input>
                    <input
                        className="mx-2"
                        id="version"
                        placeholder="Version"
                        type="text"
                    ></input>
                    <button
                        className="bg-green-600 text-white m-2 p-2 rounded-md"
                        onClick={() => {
                            this.add();
                        }}
                    >
                        Ýatda sakla
                    </button>
                </div>

                <div className="progress">
                    {this.state.isLoading && (
                        <CircularProgress></CircularProgress>
                    )}
                </div>

                <div className="max-w-[800px] text-[12px]">
                    {this.state.apk_list.map((item) => {
                        return (
                            <div className="item grid border rounded-md m-1 p-2">
                                <label>ID {item.id}</label>
                                <button
                                    onClick={() => {
                                        this.delete(item.id);
                                    }}
                                    className="flex items-center border rounded-md px-2 m-1 w-max hover:bg-slate-200"
                                >
                                    <MdDelete className="delete_icon"></MdDelete>
                                    Bozmak
                                </button>
                                <label>Version: {item.version}</label>
                                <a href={item.apk}>APK: {item.apk}</a>
                                <label>{item.created_at}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AppVersions;
