import React from "react";
import { CircularProgress } from "@mui/material";
import { MotionAnimate } from "react-motion-animate";

class ProgressIndicator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        if (this.props.open === false) {
            return null;
        }

        return (
            <MotionAnimate>
                <div
                    style={{ zIndex: 10 }}
                    className="p-2 m-2 fixed left-0 right-0 mx-auto w-max bg-slate-500/20 rounded-lg "
                >
                    <CircularProgress size={45}></CircularProgress>
                </div>
            </MotionAnimate>
        );
    }
}

export default ProgressIndicator;
