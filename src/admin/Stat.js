import axios from "axios";
import React from "react";
import { server } from "../static";
import ProgressIndicator from "./ProgressIndicator";

class Stat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            visitors: [],
            counts: [],

            auth: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };

        document.title = "Statistika";
        this.setData();
    }

    setData() {
        axios.get(server + "/api/adm/stat", this.state.auth).then((resp) => {
            this.setState({ visitors: resp.data.last_30_day_visitors });
            this.setState({ counts: resp.data });
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <div className="stat p-2">
                <label className="font-bold text-[20px] my-2">
                    Statistika
                    <ProgressIndicator
                        open={this.state.isLoading}
                    ></ProgressIndicator>
                </label>

                <div className="grid">
                    <label>Dükanlar: {this.state.counts.store}</label>
                    <label>Harytlary: {this.state.counts.product}</label>
                    <label>Söwda merkezleri: {this.state.counts.bazar}</label>
                    <label>Awtoulaglar: {this.state.counts.car}</label>
                </div>

                <label className="font-bold text-[17px] my-2">
                    Soňky 30 gündäki saýta giren adamlaryň sany
                </label>

                <div className="last-30-days">
                    {this.state.visitors.map((item) => {
                        return (
                            <div className="vert-items">
                                <label className="">{item.day} - </label>

                                <label className="">{item.visitor}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Stat;
