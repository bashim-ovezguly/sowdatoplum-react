import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiTrash } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";

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

            email_error: "",
            confirm_password_error: "",
            old_passwrod_error: "",
            new_password_error: "",

            headers: {
                token: localStorage.getItem("user_access_token"),
            },
        };

        document.title = "Profile";
        this.setData = this.setData.bind(this);
        this.setData();
    }

    get_new_access_token() {
        var formdata = new FormData();
        var email = localStorage.getItem("email");
        var password = localStorage.getItem("password");

        formdata.append("email", email);
        formdata.append("password", password);

        axios
            .post(server + "/mob/token/obtain", formdata)
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
            .post(server + "/mob/token/refresh", formdata)
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
        const pathname = window.location.pathname;
        const id = localStorage.getItem("user_id");

        axios.get(server + "/mob/customer/" + id).then((resp) => {
            this.setState({
                user: resp.data,
                isLoading: false,
                id: resp.data.data["id"],
                phone: resp.data.data["phone"],
                name: resp.data.data["name"],
                email: resp.data.data["email"],
                img: resp.data.data["img_m"],
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

    onSelectFile() {
        var file = document.getElementById("imgselector").files;
        document.getElementById("customer_photo").src = URL.createObjectURL(
            file[0]
        );
    }

    delete_image() {
        if (window.confirm("Suraty bozmaga ynamyňyz barmy?") === false) {
            return false;
        }

        var formdata = new FormData();
        formdata.append("img", "delete");
        axios
            .put(
                server + "/mob/customer/" + this.state.id,
                formdata,
                this.state.config
            )
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("saved successfully");
            })
            .catch((err) => {
                this.get_new_access_token();
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
            .put(
                server + "/mob/customer/" + this.state.id,
                formdata,
                this.state.config
            )
            .then((resp) => {
                this.setState({ isLoading: false });
                alert("saved successfully");
            })
            .catch((err) => {
                this.get_new_access_token();
            });
    }

    save() {
        var formdata = new FormData();
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var new_password = document.getElementById("new_password").value;
        var old_password = document.getElementById("old_password").value;
        var confirm_password =
            document.getElementById("confirm_password").value;
        var image = document.getElementById("imgselector").files[0];

        formdata.append("name", name);
        formdata.append("email", email);

        if (image !== undefined) {
            formdata.append("img", image);
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
            .put(server + "/mob/customer/" + this.state.id, formdata, {
                headers: this.state.headers,
            })
            .then((resp) => {
                this.setState({ isLoading: false });
                toast.success("saved successfully");
            })
            .catch((err) => {
                // this.get_new_access_token();
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    render() {
        var img = "/default.png";
        if (this.state.img != null) {
            img = server + this.state.img;
        }

        return (
            <div className="grid text-[14px]">
                <ToastContainer
                    closeOnClick={true}
                    autoClose={5000}
                ></ToastContainer>
                <h3 className="font-bold text-[22px] border-b">Profil</h3>

                {/* PHOTO */}
                <div className="grid w-[200px] mx-auto">
                    <img
                        alt=""
                        className=" h-[200px] my-2 rounded-lg mx-auto hover:shadow-md duration-300 object-cover"
                        onClick={() => {
                            document.getElementById("imgselector").click();
                        }}
                        id="customer_photo"
                        src={img}
                    ></img>
                    <input
                        onChange={() => {
                            this.onSelectFile();
                        }}
                        id="imgselector"
                        hidden
                        type="file"
                    ></input>

                    <div
                        onClick={() => {
                            this.delete_image();
                        }}
                        className="flex items-center justify-center border rounded-md text-slate-600
                                my-[5px] p-[5px] hover:bg-slate-400 duration-200"
                    >
                        <BiTrash size={23}></BiTrash>
                        <label>Bozmak</label>
                    </div>
                </div>

                <div className="img"></div>

                <div className="grid max-w-[400px]">
                    <label>Meniň maglumatlarym</label>
                    <input
                        id="name"
                        defaultValue={this.state.name}
                        placeholder="Adyňyz"
                    ></input>

                    <input
                        id="email"
                        defaultValue={this.state.email}
                        placeholder="Elektron poçtaňyz"
                    ></input>

                    <button
                        className="w-max p-2 my-1 bg-sky-600 text-white  rounded-md"
                        onClick={() => {
                            this.save();
                        }}
                    >
                        Ýatda sakla
                    </button>
                </div>

                <div className="grid max-w-[400px] mt-[20px] ">
                    <label>Açar sözüni täzelemek</label>
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
                        className="w-max p-2 my-1 bg-sky-600 text-white rounded-md"
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
