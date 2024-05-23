import axios from "axios";
import React from "react";
import { BiMap, BiSave } from "react-icons/bi";
import { server } from "../../static";
import "./add.css";
import Loader from "../components/Loader";
import { MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";

class AddFlat extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,  
            locations:[],
            categories:[],
            streets:[],
            remont_states:[],
            selected_images:[],
            location_id:'',
            location_name:'',
        }

        document.title = 'Täze emläk';
       
    };

    componentDidMount(){
        this.setData()
    }

    setData(){
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const store_id = urlParams.get('store')
        const customer_id = localStorage.getItem('id')
        

        // parent store
        if (store_id != null){
            axios.get(server + '/mob/stores/'+store_id).then(resp=>{
                this.setState({ storeName: resp.data['name_tm'] })
                this.setState({ img: resp.data['img'] })
                this.setState({storeID : store_id});
            })
        }

        // parent customer
        if (customer_id != null){
            axios.get(server + '/mob/customer/'+customer_id).then(resp=>{
                this.setState({ customerName: resp.data.data['name'] })
                this.setState({customerID : customer_id});
            })
        }

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ locations: resp.data })})

        axios.get(server + '/mob/index/flat').then(resp=>{
                    this.setState({ categories: resp.data['categories'],
                                remont_states: resp.data['remont_states'],
                                streets: resp.data['streets'],                     
                })

                this.setState({isLoading:false});
            })
    }
    
    onImgSelect(){
        var files = document.getElementById('imgselector').files
        var t=[]
        
        for(let i=0; i<this.state.selected_images.length; i++){
            t.push(this.state.selected_images[i])
        }

        for(let i=0; i<files.length; i++){
            if(t.find(x=> x.name == files[i].name)==undefined){
                t.push(files[i])
            }
           
        }   

        this.setState({selected_images : t})
        
    }

    removeImage(file){
        var temp = this.state.selected_images
        temp.splice(temp.indexOf(file), 1)
        this.setState({selected_images: temp})
    }



    save(){
      
        var formdata = new FormData();
        
        formdata.append('phone', document.getElementById('phone').value)
        formdata.append('address', document.getElementById('address').value)
        formdata.append('location', document.getElementById('location').value)
        formdata.append('price', document.getElementById('price').value)
        formdata.append('category', document.getElementById('category').value)
        console.log(document.getElementById('location').value.length)
        
        for(let i=0; i<this.state.selected_images.length; i++){
            formdata.append('images', this.state.selected_images[i])
        }

      
        if(localStorage.getItem('id') != null){
            formdata.append('customer', localStorage.getItem('id') )
        }

        if(this.state.storeID != null){
            formdata.append('store', this.state.storeID)
        }

        if(document.getElementById('swap').checked === true){
            formdata.append('swap', true)
        }

        if(document.getElementById('credit').checked === true){
            formdata.append('credit', true)
        }

        if(document.getElementById('none_cash_pay').checked === true){
            formdata.append('none_cash_pay', true)
        }

        if(document.getElementById('ipoteka').checked === true){
            formdata.append('ipoteka', true)
        }

        if(document.getElementById('own').checked === true){
            formdata.append('own', true)
        }

        if(document.getElementById('documents_ready').checked === true){
            formdata.append('documents_ready', true)
        }

        if(document.getElementById('type').value === 'rent'){
            formdata.append('for_rent', true)
        }
        else{
            formdata.append('for_rent', false)
        }

      
        this.setState({isLoading:true});
        axios.post(server + '/mob/flats' , formdata).then(resp=>{
            this.setState({isLoading:false});
            alert('Üstünlikli goşuldy. Moderator tassyklamasyna garaşyň');
            window.location.reload();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
            this.setState({isLoading:false});
        });

    }

    storeCard(){
        if(this.state.storeID ==null){
            return null
        }
        return <div className="storeCard">
                <img src={server + this.state.img}></img>
                <a href={'/stores/'+this.state.storeID}> 
                    <h3>                      
                        {this.state.storeName}
                    </h3>
                </a>
            </div>
    }


    render(){

      
        return <div className="grid p-[10px] m-auto max-w-[400px] w-[100%]">

            {
                this.state.locationSelectorOpen &&
                <LocationSelector parent={this}></LocationSelector>
            }
           
            <Loader open={this.state.isLoading}></Loader>
            <h3
                className="font-bold text-[20px]"
            >Täze emläk</h3>
           <div className="grid ">
                
                <input id="name" placeholder="Ady" ></input>
             
                <select id="type">
                    <option value={'sale'}>Satlyk</option>
                    <option value={'rent'}>Kärendesine</option>
                </select>
                    
               
                <select id="category">
                    <option hidden value={''}>Kategoriýasy</option>
                    {this.state.categories.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <div 
                    className="border rounded-md p-[5px] m-[5px] flex items-center">
                    <BiMap 
                        size={25}
                        className="hover:bg-slate-200 rounded-md p-[2px]" 
                        onClick={()=>{this.setState({locationSelectorOpen:true})}}>
                    </BiMap>
                    <label>{this.state.location_name}</label>
                    {this.state.location_name.length > 0 &&
                    <MdClose 
                        size={25} 
                        className="border rounded-full" 
                        onClick={()=>{
                            this.setState({location_name:''});
                            this.setState({location_id:''});
                    }}></MdClose>}
                </div>

                <input id="price" placeholder="Bahasy (TMT)" type={'number'} min={0}></input>
                <input id="address" placeholder="Salgysy"></input>
                <input id="floor" type={'number'} min={0} placeholder="Binadaky gat sany"></input>
                <input id="at_floor" type={'number'} min={0} placeholder="Ýerleşýän gaty"></input>
                <input id="room" type={'number'} min={1} placeholder="Otag sany"></input>
                <input id="square" type={'number'} placeholder="Meýdany"></input>
                <input id="people" type={'number'} placeholder="Ýazgydaky adam sany"></input>              

                <select id="remont_state">
                    <option hidden value={''}>Remont ýagdaýy</option>
                    {this.state.remont_states.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <textarea id="detail"  placeholder="Giňişleýin maglumat..."></textarea>

                <input id="phone" className="phone" placeholder="Telefon belgisi" type='number'></input>

                <div
                    onClick={()=>{document.getElementById('own').click()}} 
                    className="flex items-center hover:bg-slate-200 duration-300 border rounded-md p-[5px] m-[5px]">
                    <input className="w-[20px] h-[20px]" id="own" type="checkbox"></input>
                    <label>Eýesinden</label>
                </div>
                
                <div
                    onClick={()=>{document.getElementById('swap').click()}} 
                    className="flex items-center hover:bg-slate-200 duration-300 border rounded-md p-[5px] m-[5px]">
                    <input className="w-[20px] h-[20px]" id="swap" type="checkbox"></input>
                    <label>Çalşyk</label>
                </div>

                  
                <div
                    onClick={()=>{document.getElementById('credit').click()}} 
                    className="flex items-center hover:bg-slate-200 duration-300 border rounded-md p-[5px] m-[5px]">
                    <input className="w-[20px] h-[20px]" id="credit" type="checkbox"></input>
                    <label>Kredit</label>
                </div>
                
                  
                <div
                    onClick={()=>{document.getElementById('none_cash_pay').click()}} 
                    className="flex items-center hover:bg-slate-200 duration-300 border rounded-md p-[5px] m-[5px]">
                    <input className="w-[20px] h-[20px]" id="none_cash_pay" type="checkbox"></input>
                    <label>Nagt däl töleg</label>
                </div>

                <div
                    onClick={()=>{document.getElementById('ipoteka').click()}} 
                    className="flex items-center hover:bg-slate-200 duration-300 border rounded-md p-[5px] m-[5px]">
                    <input className="w-[20px] h-[20px]" id="ipoteka" type="checkbox"></input>
                    <label>Ipoteka</label>
                </div>

                <input onChange={()=>{this.onImgSelect()}} 
                        id="imgselector" 
                        multiple 
                        hidden
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                        type='file'></input>
                
                <button 
                    className=" p-[5px] border border-solid border-slate-300 hover:bg-slate-500 
                                hover:text-white duration-300 m-[5px]" 
                    onClick={()=>{document.getElementById('imgselector').click()}}>
                    Saýlanan surat  {this.state.selected_images.length} sany
                </button>

                {/* IMAGES */}
                <div className="flex flex-wrap justify-center overflow-x-auto">
                    {
                        this.state.selected_images.map(item=>{
                            return <div className="w-[140px] h-[140px] relative m-[10px] ">
                                <img className="h-[100%] border rounded-md w-[100%] object-cover" alt="" src={URL.createObjectURL(item)}></img>
                                <MdClose    
                                    className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                            duration-300 absolute bg-red-600 rounded-[50%] p-[5px] 
                                            text-white shadow-md right-[5px] top-[5px]"
                                    onClick={()=>{this.removeImage(item)}} 
                                    size={35}>
                                </MdClose>
                            </div>
                        })
                    }
                    
                </div>



                <button onClick={()=>{this.save()}} 
                    className="save p-[10px] w-max flex items-center bg-sky-700 text-white">
                    <BiSave  className=" m-[2px]"></BiSave>
                    <label>Ýatda sakla</label>
                </button>
            </div> 
         
           
           
        </div>
    }
}

export default AddFlat;