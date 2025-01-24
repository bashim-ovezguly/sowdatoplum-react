import axios from "axios";
import React from "react";
import { server } from "../static";
import { toast, ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";

class WriteToUs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            products: [],
            user: [],

            msg: "",
            email: "",
        };
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    clear() {
        document.getElementById("msg").value = "";
        document.getElementById("email").value = "";
    }

    sendMail() {
        // data
        const msg = document.getElementById("msg").value;
        const email = document.getElementById("email").value;

        if (email == "") {
            toast.error("Email hökman doldurnmaly");
            return null;
        }

        if (msg == "") {
            toast.error("Hat hökman doldurnmaly");
            return null;
        }

        var data = {
            msg: msg,
            email: email,
        };

        //app headers
        var header = {
            "device-id": localStorage.getItem("device-id"),
        };

        this.setState({ isLoading: true });

        axios
            .post(server + "/mails", data, { headers: header })
            .then((resp) => {
                this.setState({ products: resp.data, isLoading: false }); // set loading false
                toast.success("Ugradyldy");
                this.clear(); //clear all fields
            })
            .catch((err) => {
                toast.error("Näsazlyk ýüze çykdy");
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="flex justify-center">
                    <CircularProgress></CircularProgress>
                </div>
            );
        }
        return (
            <div className="p-4 grid max-w-[600px] mx-auto rounded-lg my-6 border shadow-lg">
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                <label className="text-appColor font-bold">Bize ýazyň</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Elektron poçtaňyz"
                    className="p-2"
                ></input>
                <textarea
                    id="msg"
                    placeholder="şu ýere ýaz..."
                    className="min-h-[200px] p-2 max-h-[500px]"
                ></textarea>
                <button
                    onClick={() => {
                        this.sendMail();
                    }}
                    className="bg-green-600 text-white rounded-md w-max  px-4 p-2 my-2 justify-self-end "
                >
                    Ugrat
                </button>
            </div>
        );
    }
}

export default WriteToUs;
