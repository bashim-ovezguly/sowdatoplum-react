import axios from "axios";
import React from "react";
import { server, storeUrl } from "../../static";
import { BiMap, BiTrash } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import LocationSelector from "../../admin/LocationSelector";
import ProgressIndicator from "../../admin/ProgressIndicator";
import { MdEdit } from "react-icons/md";

class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            id: "",
            name: "",
            phone: "",
            email: "",
            created_at: "",
            img: "",
            location_id: "",
            location_name: "",
            tc_id: "",
            tc_name: "",
            email_error: "",
            confirm_password_error: "",
            old_passwrod_error: "",
            new_password_error: "",

            categories: [],
            trade_centers: [],

            headers: {
                token: localStorage.getItem("user_access_token"),
            },
            token: localStorage.getItem("user_access_token"),
        };

        document.title = "Profile";
        this.setData();
    }

    get_new_access_token() {
        var formdata = new FormData();
        var email = localStorage.getItem("email");
        var password = localStorage.getItem("password");

        formdata.append("email", email);
        formdata.append("password", password);

        axios
            .post(server + "/token/obtain", formdata)
            .then((resp) => {
                localStorage.setItem(
                    "access_token",
                    resp.data.data["access_token"]
                );
                localStorage.setItem(
                    "refresh_token",
                    resp.data.data["refresh_token"]
                );
            })
            .catch((err) => {
                this.refresh_token();
            });
    }

    refresh_token() {
        var formdata = new FormData();
        var refresh_token = localStorage.getItem("refresh_token");
        formdata.append("refresh_token", refresh_token);

        axios
            .post(server + "/token/refresh", formdata)
            .then((resp) => {
                localStorage.setItem(
                    "access_token",
                    resp.data.data["access_token"]
                );
                localStorage.setItem(
                    "refresh_token",
                    resp.data.data["refresh_token"]
                );
            })
            .catch((err) => {
                window.location.href = "/login";
            });
    }

    setData() {
        const id = localStorage.getItem("user_id");
        console.log(storeUrl + "/" + id);

        axios.get(storeUrl + "/" + id).then((resp) => {
            this.setState({
                isLoading: false,
                user: resp.data,
                description: resp.data.description,
                id: resp.data.id,
                logo: resp.data.logo,
                phone: resp.data.phone,
                name: resp.data.name,
                email: resp.data.email,
            });

            if (resp.data.location !== "" && resp.data.location !== null) {
                this.setState({
                    location_name: resp.data.location.name,
                    location_id: resp.data.location.id,
                });
            }
            if (resp.data.center !== "" && resp.data.center !== null) {
                this.setState({
                    tc_name: resp.data.center.name,
                    tc_id: resp.data.center.id,
                });
            }
            if (resp.data.category !== "" && resp.data.category !== null) {
                this.setState({
                    category_id: resp.data.category.id,
                    category_name: resp.data.category.name,
                });
            }
        });

        axios.get(server + "/index/store").then((resp) => {
            this.setState({
                categories: resp.data.categories,
                trade_centers: resp.data.trade_centers,
            });
        });
    }

    clear_all_errors() {
        this.setState({
            email_error: "",
            old_passwrod_error: "",
            new_password_error: "",
            confirm_password_error: "",
        });
    }

    logout_click() {
        window.location.href = "/login";
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("logged_in", false);
        localStorage.removeItem("id");
    }

    setUploadedImg() {
        var file = document.getElementById("fileInput").files;
        document.getElementById("customer_photo").src = URL.createObjectURL(
            file[0]
        );
    }

    delete_image() {
        if (window.confirm("Suraty bozmaga ynamyňyz barmy?") === false) {
            return false;
        }

        var formdata = new FormData();
        formdata.append("logo", "delete");
        axios
            .put(server + "/mob/stores/" + this.state.id, formdata, {
                headers: { token: this.state.token },
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Ýatda saklandy");
            })
            .catch((err) => {
                toast.error("Error");
            });

        this.setData();
    }

    changePassword() {
        var formdata = new FormData();

        var new_password = document.getElementById("new_password").value;
        var old_password = document.getElementById("old_password").value;
        var confirm_password =
            document.getElementById("confirm_password").value;

        if (old_password.length > 0) {
            if (new_password.length === 0) {
                toast.error("Täze açar sözüni giriziň");
                return null;
            }
        }

        if (new_password.length > 0) {
            if (old_password.length === 0) {
                toast.error("Köne açar sözüni giriziň");
            }

            if (confirm_password !== new_password) {
                toast.error("password gabat gelenok");
                return null;
            } else {
                formdata.append("new_password", new_password);
                formdata.append("old_password", old_password);
            }
        }

        axios
            .put(server + "/stores/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Açar sözi üýtgedildi");
                this.get_new_access_token();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    save() {
        this.setState({ isLoading: true });
        var formdata = new FormData();
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var description = document.getElementById("description").value;
        var new_password = document.getElementById("new_password").value;
        var old_password = document.getElementById("old_password").value;
        var confirm_password =
            document.getElementById("confirm_password").value;
        var image = document.getElementById("fileInput").files[0];

        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("description", description);
        formdata.append("location", this.state.location_id);
        formdata.append("category", document.getElementById("category").value);
        formdata.append("center", document.getElementById("tc").value);

        if (image !== undefined) {
            formdata.append("logo", image);
        }

        if (old_password.length > 0) {
            if (new_password.length === 0) {
                alert("Täze açar sözüni giriziň");
                return null;
            }
        }

        if (new_password.length > 0) {
            if (old_password.length === 0) {
                alert("Köne açar sözüni giriziň");
            }

            if (confirm_password !== new_password) {
                alert("password gabat gelenok");
                return null;
            } else {
                formdata.append("new_password", new_password);
                formdata.append("old_password", old_password);
            }
        }

        axios
            .put(storeUrl + "/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("Ýatda saklandy");
                localStorage.setItem("user_name", this.state.name);
                localStorage.setItem("user_email", this.state.email);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.logout_click();
                }

                toast.error("Ýalňyşlyk ýüze çykdy");
            })
            .finally((err) => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div className="grid bg-white p-4 mb-4 shadow-md rounded-md w-max mx-auto border">
                <ToastContainer
                    closeOnClick={true}
                    autoClose={5000}
                ></ToastContainer>

                <ProgressIndicator
                    open={this.state.isLoading}
                ></ProgressIndicator>
                <div className="grid max-w-[400px] mx-auto w-full">
                    <img
                        alt=""
                        className=" border h-[200px] w-[200px] rounded-full shadow-sm  overflow-hidden my-2 hover:shadow-lg
                        mx-auto duration-300 object-cover border-white "
                        onClick={() => {
                            document.getElementById("fileInput").click();
                        }}
                        id="customer_photo"
                        src={server + this.state.logo}
                    ></img>

                    <input
                        onChange={() => {
                            this.setUploadedImg();
                        }}
                        id="fileInput"
                        hidden
                        type="file"
                    ></input>

                    <div
                        onClick={() => {
                            this.delete_image();
                        }}
                        className="flex items-center justify-center border rounded-md text-red-600 w-max mx-auto
                                my-2 p-1 hover:text-slate-300 duration-200"
                    >
                        <BiTrash size={23}></BiTrash>
                        <label>Bozmak</label>
                    </div>
                    <label className="text-[12px] font-bold text-slate-600">
                        Adyňyz
                    </label>
                    <input id="name" defaultValue={this.state.name}></input>
                    <label className="text-[12px] font-bold text-slate-600">
                        Elektron poçtaňyz
                    </label>
                    <input id="email" defaultValue={this.state.email}></input>

                    <label className="text-[12px] font-bold text-slate-600">
                        Ýerleşýän ýeriňiz
                    </label>
                    <div className="flex items-center border p-1 my-2 rounded-md">
                        <BiMap
                            onClick={() => {
                                this.setState({ locationSelectorOpen: true });
                            }}
                            className=""
                            size={25}
                        ></BiMap>
                        <label>{this.state.location_name}</label>
                    </div>

                    <label className="text-[12px] font-bold text-slate-600">
                        Kategoriýa
                    </label>
                    {this.state.locationSelectorOpen && (
                        <LocationSelector parent={this}></LocationSelector>
                    )}

                    <select id="category">
                        <option hidden value={this.state.category_id}>
                            {this.state.category_name}
                        </option>
                        {this.state.categories.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name_tm}
                                </option>
                            );
                        })}
                    </select>
                    <label className="text-[12px] font-bold text-slate-600">
                        Söwda merkezi
                    </label>
                    <select id="tc">
                        <option hidden value={this.state.tc_id}>
                            {this.state.tc_name}
                        </option>
                        {this.state.trade_centers.map((item) => {
                            return (
                                <option id={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                    <textarea
                        className="max-h-[200px]"
                        id="description"
                        defaultValue={this.state.description}
                    ></textarea>
                    <button
                        className="p-2 my-1 bg-green-600 text-white  rounded-md"
                        onClick={() => {
                            this.save();
                        }}
                    >
                        Ýatda sakla
                    </button>
                    <label className="font-bold">Açar sözüni täzelemek</label>
                    <input
                        id="old_password"
                        placeholder="Köne açar sözi"
                    ></input>
                    <label id="old_password_error" className="error">
                        {this.state.old_passwrod_error}
                    </label>

                    <input
                        id="new_password"
                        placeholder="Täze açar sözi"
                    ></input>
                    <label id="new_password_error" className="error">
                        {this.state.new_password_error}
                    </label>

                    <input
                        id="confirm_password"
                        placeholder="Täze açar sözüni gaýtdan ýazyň"
                    ></input>
                    <label id="password_confirm_error" className="error">
                        {this.state.confirm_password_error}
                    </label>
                    <button
                        className="p-2 my-1 bg-green-600 text-white rounded-md"
                        onClick={() => {
                            this.changePassword();
                        }}
                    >
                        Açar sözüni täzelemek
                    </button>
                </div>
            </div>
        );
    }
}

export default ProfileEdit;
