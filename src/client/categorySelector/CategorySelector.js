import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiBox, BiBuildingHouse } from "react-icons/bi";
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
    }

    render() {
        return (
            <div
                style={{ zIndex: 100 }}
                className="grid absolute bg-white shadow-md rounded-md top-[50px] right-3 overflow-hidden"
            >
                <div className="grid m-auto w-max text-appColor shadow-lg  text-[14px]">
                    <Link
                        to={"/products/add"}
                        className="flex hover:bg-slate-300 p-2 text-decoration-none items-center"
                    >
                        <BiBox size={25}></BiBox>
                        <label className="m-2">Haryt</label>
                    </Link>
                    <Link
                        to={"/cars/add"}
                        className="flex hover:bg-slate-300 p-2 text-decoration-none items-center "
                    >
                        <AiFillCar size={25}></AiFillCar>
                        <label className="m-2">Awtoulag</label>
                    </Link>

                    <Link
                        to={"/lenta/add"}
                        className="flex hover:bg-slate-300 p-2 text-decoration-none items-center "
                    >
                        <BiBuildingHouse size={25}></BiBuildingHouse>
                        <label className="m-2">Aksiýa</label>
                    </Link>
                </div>
            </div>
        );
    }
}

export default CategorySelector;
