import axios from "axios";
import React from "react";
import { server } from "../../static";
import { MdCall } from "react-icons/md";

class StoreContacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            list: [],
            contacts: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        this.setData();
    }

    setData() {
        const pathname = window.location.pathname;
        const id = pathname.split("/")[2];

        axios.get(server + "/mob/stores/" + id).then(
            (resp) => {
                this.setState({ body_tm: resp.data.body_tm });
                document.title = resp.data.name_tm;
                this.setState({ contacts: resp.data.contacts });
            },
            (resp) => {}
        );
    }

    render() {
        return (
            <div className="store_about p-[10px]">
                <div className="contacts grid">
                    {this.state.contacts.map((item) => {
                        return (
                            <a
                                href={"tel:" + item.value}
                                className=" text-green-700 hover:bg-slate-200 m-[5px] border border-green-700 
                        rounded-md w-max flex items-center p-[10px]"
                            >
                                <MdCall
                                    className=" border border-green-700 rounded-full p-[5px] "
                                    size={30}
                                ></MdCall>
                                <label>{item.value}</label>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default StoreContacts;
