import axios from "axios";
import React from "react";
import { server } from "../static";

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
        axios.get(server + "/api/admin/stat", this.state.auth).then((resp) => {
            this.setState({ visitors: resp.data.last_30_day_visitors });
            this.setState({ counts: resp.data });
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <div className="stat p-2">
                <label className="font-bold text-[22px]">
                    Statistika
                    {this.state.isLoading && (
                        <span className="loader"> - Ýüklenýär...</span>
                    )}
                </label>

                <div className="grid">
                    <label>Dükanlar: {this.state.counts.store}</label>
                    <label>Harytlary: {this.state.counts.product}</label>
                    <label>
                        Söwda merkezleri: {this.state.counts.shopping_center}
                    </label>
                    <label>Dermanhanalar: {this.state.counts.pharmacy}</label>
                    <label>Emläkler: {this.state.counts.flat}</label>
                    <label>Awtoulaglar: {this.state.counts.car}</label>
                    <label>Hyzmatlar: {this.state.counts.service}</label>
                    <label>Awtoşaýlar: {this.state.counts.part}</label>
                </div>

                <label className="font-bold text-[22px]">
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
