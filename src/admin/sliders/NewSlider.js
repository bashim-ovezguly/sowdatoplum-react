export function NewSlider() {
    return (
        <div className="wrapper absolute shadow-lg rounded-md p-2 bg-white grid">
            <label>Täze Slider</label>
            <input id="advName" placeholder="ady"></input>

            <div className="text-[12px]">
                <button
                    className="p-1 rounded-md m-1 text-sky-600 hover:bg-sky-400"
                    onClick={() => {
                        this.addNewAdv();
                    }}
                >
                    Goşmak
                </button>
                <button
                    className="p-1 rounded-md m-1 text-sky-600 hover:bg-sky-400"
                    onClick={() => {
                        this.setState({ addOpen: false });
                    }}
                >
                    Ýapmak
                </button>
            </div>
        </div>
    );
}
