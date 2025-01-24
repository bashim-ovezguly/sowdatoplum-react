import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMinus, BiPlus } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { MdClose } from "react-icons/md";
import { MotionAnimate } from "react-motion-animate";

class StoreBasket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            products: [],
            total: 0,
            confirmationIsOpen: false,
        };
    }

    componentDidMount() {
        this.calcTotal();
    }

    calcTotal() {
        let t = 0;
        this.props.items.map((item) => {
            var price = Number(String(item.price).replaceAll(" ", ""));

            t = t + item.amount * price;
        });
        this.setState({ total: t });
    }

    removeItem(index) {
        let products = this.props.items;
        products.splice(index, 1);
        this.setState({ items: products });

        if (products.length === 0) {
            this.props.parent.setState({ showBasket: false });
        }

        this.calcTotal();
    }

    clear() {
        this.props.parent.setState({ basket_items: [], showBasket: false });
        this.calcTotal();
    }

    increment(item) {
        let index = this.props.items.indexOf(item);
        let tempArray = this.props.items;
        tempArray[index].amount = tempArray[index].amount + 1;
        this.props.parent.setState({ items: tempArray });
        this.calcTotal();
    }

    decrement(item) {
        let index = this.props.items.indexOf(item);
        let tempArray = this.props.items;
        if (tempArray[index].amount > 1) {
            tempArray[index].amount = tempArray[index].amount - 1;
        }
        this.setState({ products: tempArray });
        localStorage.setItem("basket", JSON.stringify(tempArray));
        this.calcTotal();
    }

    orderConfirm(items) {
        let products = [];
        items.map((item) => {
            products.push({ product: item.id, amount: item.amount });
        });

        if (this.props.sender == undefined) {
            toast.error("Sargyt etmek üçin ulgama girmeli");
            return null;
        }

        let address = document.getElementById("address").value;
        let note = document.getElementById("note").value;
        let time = document.getElementById("time").value;

        if (address == "") {
            toast.error("Salgy hökman girizmeli");
            return null;
        }
        if (time == "") {
            toast.error("Wagty hökman girizmeli");
            return null;
        }

        const data = {
            address: address,
            sender: this.props.sender,
            accepter: this.props.accepter,
            note: note,
            time: time,
            products: products,
        };

        axios
            .post(server + "/orders/add", data, {
                headers: { token: localStorage.getItem("user_access_token") },
            })
            .then((resp) => {
                toast.success("Sargyt ugradyldy");
                this.setState({ confirmationIsOpen: false });
                this.props.parent.setState({ showBasket: false });
                this.clear();
            })
            .catch((err) => {
                toast.error("Ýalňyşlyk ýüze çykdy");
            });
    }

    orderConfirmationModal() {
        if (this.state.confirmationIsOpen === false) {
            return null;
        }
        return (
            <div
                style={{ zIndex: 200 }}
                className="fixed left-0 top-0 right-0 h-full bg-slate-400/50 p-4 z-200 "
            >
                <ToastContainer
                    autoClose={5000}
                    closeOnClick={true}
                ></ToastContainer>
                <div className="border mx-auto mt-[10%] max-w-[400px] bg-white shadow-lg rounded-lg grid p-4 text-[12px]">
                    <label className="font-bold">Salgysy</label>
                    <input id="address"></input>
                    <label className="font-bold">Wagty</label>
                    <input
                        id="time"
                        type="datetime-local"
                        placeholder="Wagty"
                    ></input>
                    <label className="font-bold">Bellik</label>
                    <textarea className="min-h-[100px]" id="note"></textarea>

                    <div className="flex justify-between items-center font-bold my-2 text-[17px]">
                        <label>Jemi:</label>
                        <label>{this.state.total} TMT</label>
                    </div>

                    <div className="grid grid-cols-2 border-t py-2">
                        <button
                            onClick={() => {
                                this.setState({ confirmationIsOpen: false });
                            }}
                            className="mx-1 rounded-md p-2 text-slate-800 border hover:bg-slate-200 duration-200"
                        >
                            Ýapmak
                        </button>
                        <button
                            onClick={() => {
                                this.orderConfirm(this.props.items);
                            }}
                            className="mx-1 rounded-md p-2 bg-green-600 text-white hover:bg-slate-400 duration-200"
                        >
                            Ugratmak
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div
                style={{ zIndex: 1000 }}
                className="fixed top-0 left-0 z-100 w-full h-full bg-slate-500/30 duration-200"
            >
                <div
                    style={{ zIndex: 100 }}
                    className="fixed bg-white left-0 right-0 top-[10%] rounded-lg border sm:w-[90%]
                shadow-2xl border-slate-300 min-h-[20%] z-100 p-4 max-w-[600px] mx-auto max-h-[80%]"
                >
                    <ToastContainer
                        className="hidden"
                        autoClose={3000}
                        closeOnClick={true}
                    ></ToastContainer>
                    {this.orderConfirmationModal()}
                    <div className="flex justify-between">
                        <label className="font-bold text-appColor text-[20px]">
                            Sebet
                        </label>
                        <MdClose
                            onClick={() => {
                                this.props.parent.setState({
                                    showBasket: false,
                                });
                            }}
                            size={25}
                            className="right-2 top-2 hover:bg-slate-200 duration-200 rounded-md"
                        ></MdClose>
                    </div>
                    <div className="grid h-full overflow-y-auto max-h-[350px]">
                        {this.props.items.map((item, index) => {
                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[max-content_auto] overflow-hidden my-2 h-max relative
                                rounded-lg border text-[12px]"
                                >
                                    <img
                                        alt=""
                                        className="w-[120px] sm:w-[100px] h-[100px] object-cover"
                                        src={server + item.img}
                                    ></img>
                                    <div className="grid p-2 text-[16px] sm:text-[14px] ">
                                        <label className="font-bold ">
                                            {item.name}
                                        </label>
                                        <label className="text-sky-600 font-bold">
                                            {item.price} TMT{" "}
                                        </label>
                                        <div className="flex items-center border w-max h-max rounded-lg">
                                            <button
                                                className=" hover:bg-slate-200/20 flex justify-center p-1 items-center"
                                                onClick={() => {
                                                    this.decrement(item);
                                                }}
                                            >
                                                <BiMinus size={22}></BiMinus>
                                            </button>
                                            <label className="min-w-[50px] text-center">
                                                {item.amount} sany
                                            </label>
                                            <button
                                                className=" hover:bg-slate-200/20 flex justify-center p-1 items-center"
                                                onClick={() => {
                                                    this.increment(item);
                                                }}
                                            >
                                                <BiPlus size={22}></BiPlus>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                this.removeItem(index);
                                            }}
                                            className="flex items-center p-1 hover:text-red-600 text-slate-400 absolute right-2 my-auto top-0 bottom-0 h-max
                                            w-max float-end duration-200 text-red rounded-lg"
                                        >
                                            <BsTrash size={30}></BsTrash>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <label className="font-bold text-appColor">
                        Jemi: {this.state.total} TMT
                    </label>
                    {this.props.items.length > 0 && (
                        <div className="grid text-[14px]">
                            <button
                                onClick={() => {
                                    this.setState({
                                        confirmationIsOpen: true,
                                    });
                                }}
                                className="rounded-md p-2 bg-appColor w-max px-4 text-white hover:bg-slate-400 duration-200 m-1"
                            >
                                Ugratmak
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default StoreBasket;
