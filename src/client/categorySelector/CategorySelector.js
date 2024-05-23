import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiBox, BiBuildingHouse, BiNews, BiWrench } from "react-icons/bi";
import { AiFillCar } from "react-icons/ai";
import { Link } from "react-router-dom";

class CategorySelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            current_page: "",
            last_page: "",

            products: [],

            auth: {
                auth: {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password"),
                },
            },
        };

        document.title = "Täze bildiriş";
        this.setData();
        if (localStorage.getItem("user_id") === null) {
            window.location.href = "/login";
        }
    }

    setData() {
        axios
            .get(server + "/mob/announcements?page=" + this.state.current_page)
            .then((resp) => {
                this.setState({ products: resp.data.data });
                this.setState({ last_page: resp.data.total_page });
                this.setState({ count: resp.data.count });
                this.setState({ total_page: resp.data.total_page });
                this.setState({ page_size: resp.data.page_size });
                this.setState({ current_page: resp.data.current_page });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <div
                style={{ zIndex: 100 }}
                className="grid absolute bg-white shadow-md rounded-md top-[50px] right-3"
            >
                <div className="grid m-auto w-max text-sky-700 shadow-lg">
                    <Link
                        to={"/cars/add"}
                        className="flex hover:bg-slate-300 p-1 m-1 rounded-md text-decoration-none items-center "
                    >
                        <AiFillCar size={30}></AiFillCar>
                        <label className="m-[5px]">Awtoulag</label>
                    </Link>
                    <Link
                        to={"/products/add"}
                        className="flex hover:bg-slate-300 p-1 m-1 rounded-md text-decoration-none items-center"
                    >
                        <BiBox size={30}></BiBox>
                        <label className="m-[5px]">Haryt</label>
                    </Link>
                    <Link
                        to={"/parts/add"}
                        className="flex hover:bg-slate-300 p-1 m-1 rounded-md text-decoration-none items-center "
                    >
                        <BiWrench size={30}></BiWrench>
                        <label className="m-[5px]">Awtoşaý</label>
                    </Link>
                    <Link
                        to={"/flats/add"}
                        className="flex hover:bg-slate-300 p-1 m-1 rounded-md text-decoration-none items-center "
                    >
                        <BiBuildingHouse size={30}></BiBuildingHouse>
                        <label className="m-[5px]">Gozgalmaýan emläk</label>
                    </Link>
                    <Link
                        to={"/lenta/add"}
                        className="flex hover:bg-slate-300 p-1 m-1 rounded-md text-decoration-none items-center "
                    >
                        <BiNews size={30}></BiNews>
                        <label className="m-[5px]">Lenta</label>
                    </Link>
                </div>
            </div>
        );
    }
}

export default CategorySelector;
