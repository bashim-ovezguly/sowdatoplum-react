import React from "react";

export default class Template extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: [],
            all_locations: [],

            current_page: 1,
            last_page: 1,
            total: 0,
            stores: [],
            url_params: [],
            filterOpen: false,
            newStoreOpen: false,
            categories: [],
            sizes: [],
            trade_centers: [],
            page_size: 50,

            headers: {
                auth: {
                    username: localStorage.getItem("admin_username"),
                    password: localStorage.getItem("admin_password"),
                },
            },
        };
    }

    render() {
        return <div className="stores"></div>;
    }
}
