import axios from "axios";
import React from "react";
import { server } from "../static";

class Rules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            user: [],
            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Biz barada";
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setData() {
        axios.get(server + "/products", this.state.auth).then((resp) => {
            this.setState({ products: resp.data, isLoading: false });
        });
    }

    render() {
        return (
            <div className="about_us p-4 max-w-[600px] mx-auto">
                <h2 className="font-bold text-[30px] text-center text-appColor my-4 ">
                    Söwda toplumy
                </h2>

                <h4>Saýtyň düzgünleri:</h4>
                <p>
                    {" "}
                    - Ulanyjy tarapyndan ýerleşdirilen maglumatlar moderatorlar
                    tarapyndan barlanýar
                </p>
                <p>
                    {" "}
                    - Maglumatlar barlagy üstünlikli geçeninden soňra saýtda
                    peýda bolýar
                </p>
                <p> - Maglumatlaryň mukdary bellinelen çäkde ýerleşdirilýär</p>
                <p>
                    {" "}
                    - Ýerleşdirilýän maglumatlar Türkmenistanyň kanunçylygyna
                    laýyk gelmeli
                </p>
                <p> - Ulanyjy ýerleşdiren maglumatyna jogap berýär</p>
                <p> - Ýazgylarda hapa-paýyş söz ulanmak gadagan</p>
            </div>
        );
    }
}

export default Rules;
