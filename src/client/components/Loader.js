import React from "react";
import "./loader.css";
import { CircularProgress } from "@mui/material";

class Loader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.open) {
            return (
                <div className="loader shadow-md rounded-md bg-white flex items-center">
                    <CircularProgress></CircularProgress>
                    <label className="m-[10px] bold">Ýüklenýär</label>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

export default Loader;
