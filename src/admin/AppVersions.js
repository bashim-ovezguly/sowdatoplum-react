import axios from "axios";
import React from "react";
import { MdDelete } from "react-icons/md";
import { server } from "../static";
import { CircularProgress } from "@mui/material";

class AppVersions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            apk_list: [],
            counts: [],

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
            .delete(server + "/api/admin/apks/" + id, this.state.auth)
            .then((resp) => {
                this.setState({ isLoading: false });
                this.setData();
            });
    }

    add() {
        this.setState({ isLoading: true });
        let fdata = new FormData();
        fdata.append("apk", document.getElementById("apk_file").files[0]);
        fdata.append("version", document.getElementById("version").value);

        axios
            .post(server + "/api/admin/apks/", fdata, this.state.auth)
            .then((resp) => {
                this.setState({ apk_list: resp.data.data });
                this.setState({ isLoading: false });
            });
    }

    setData() {
        axios.get(server + "/api/admin/apks", this.state.auth).then((resp) => {
            this.setState({ apk_list: resp.data.data });
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <div className="app_versions">
                <h3>App Versions</h3>

                <div className="add">
                    <input id="apk_file" type="file"></input>
                    <input
                        id="version"
                        placeholder="Version"
                        type="text"
                    ></input>
                    <button
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

                <div className="apk_items">
                    {this.state.apk_list.map((item) => {
                        return (
                            <div className="item">
                                <label>ID {item.id}</label>
                                <MdDelete
                                    className="delete_icon"
                                    onClick={() => {
                                        this.delete(item.id);
                                    }}
                                ></MdDelete>
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
