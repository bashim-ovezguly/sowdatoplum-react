import axios from "axios";
import React from "react";
import { server } from "../static";
import { MotionAnimate } from "react-motion-animate";

class AboutUs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };

        document.title = "Biz barada";
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    render() {
        return (
            <MotionAnimate>
                <div className="about_us p-6 max-w-[900px] mx-auto">
                    <img
                        className="max-w-[200px] mx-auto drop-shadow-md"
                        alt=""
                        src={"/logo.png"}
                    ></img>
                    <h2 className="font-bold text-[30px] text-center text-appColor">
                        Söwda toplumy
                    </h2>
                    <h2 className="font-bold text-[20px] text-center text-appColor">
                        Marketplace
                    </h2>

                    <div className="text-slate-600">
                        <p>
                            Söwda toplumy - saýtyň esasy maksady dükanlaryň
                            işini ýeňleşdirmek we söwdasyny galdyrmaga kömek
                            etmekdir.
                        </p>
                        <h4>Saýtyň mümkinçilikleri:</h4>
                        <p> - Hasap açmak</p>
                        <p> - Web katalog döretmek</p>
                        <p> - Harytlary sargyt etmek </p>
                        <p> - Online dükan açmak</p>
                        <p>- Haryt we hyzmatlary goşmak</p>
                        <p> - Harytlary filterler arkaly gözlemek</p>

                        <p>
                            - Awtoulag, awtoşaý, gurluşyk harytlary we beýleki
                            harytlary bölümi
                        </p>
                        <p>
                            - Türkmenistanda ýerleşýän bazarlar we söwda
                            nokatlary
                        </p>
                    </div>

                    <div className="flex items-center my-4">
                        <label className="text-slate-600 font-bold border rounded-md  px-2">
                            Client ID:
                        </label>
                        <label className="mx-2">
                            {localStorage.getItem("device_id")}
                        </label>
                    </div>
                </div>
            </MotionAnimate>
        );
    }
}

export default AboutUs;
