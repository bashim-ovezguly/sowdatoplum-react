import axios from "axios";
import React from "react";
import { server } from "../../static";

class StoreAbout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            list: [],
            contacts: [],
        };
    }

    render() {
        return (
            <div className="store_about p-2">
                <p
                    style={{ whiteSpace: "pre-line" }}
                    className="description text-grey text-15px"
                >
                    {this.props.data}
                </p>
            </div>
        );
    }
}

export default StoreAbout;
