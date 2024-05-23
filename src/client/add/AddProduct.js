import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./add.css";
import {MdClose, MdDelete } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import LocationSelector from "../../admin/LocationSelector";
import { BiMap, BiSave } from "react-icons/bi";

class AddProduct extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            isLoading:true,  
            categories:[],
            selected_images:[],     
            selectedImageCount:0,     
            locations:[],
            countries:[],
            brands:[],
            units:[],
            stores:[],
            customerID:null,
            storeID:null,
            location_id:'',
            location_name:'',
        }

        document.title = 'Täze haryt';
       
    };
    componentDidMount(){
        this.setData()
    }

    setData(){
        const customer_id = localStorage.getItem('user_id')
        axios.get(server + '/mob/stores?customer='+customer_id).then(resp=>{
            this.setState({ stores: resp.data.data })
        })

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ locations: resp.data })})

        axios.get(server + '/mob/index/product').then(resp=>{
                    this.setState({ categories: resp.data['categories']})
                this.setState({isLoading:false})
            })
    }
    
    onImgSelect(){
        var files = document.getElementById('imgselector').files
        var t=[]
        
        for(let i=0; i<this.state.selected_images.length; i++){
            t.push(this.state.selected_images[i])
        }

        for(let i=0; i<files.length; i++){
            if(t.find(x=> x.name === files[i].name) === undefined){
                t.push(files[i])
            }
        }   

        this.setState({selected_images : t},()=>{
            this.setState({selectedImageCount: this.state.selected_images.length})
        })
    }


    add_phone(){
        var temp = this.state.phone_elems;
        temp.push( <input className="phones" placeholder="Telefon belgisi" type='number'></input>);
        this.setState({phone_elems:temp})
    }
    
    removeImage(file){
        var temp = this.state.selected_images
        temp.splice(temp.indexOf(file), 1)
        this.setState({selected_images: temp},()=>{
            this.setState({selectedImageCount: this.state.selected_images.length})
        })
    }

    save(){
        
        var formdata = new FormData();
        formdata.append('name_tm', document.getElementById('name').value)   
        formdata.append('category', document.getElementById('category').value)
        formdata.append('body_tm', document.getElementById('body_tm').value)
        formdata.append('price', document.getElementById('price').value)
        formdata.append('store', document.getElementById('store').value)

        if(document.getElementById('name').value === ''){
            alert('Adyny hökman girizmeli!');
            return null;
        }
        
        if(this.state.selected_images.length === 0){
            alert('Surat hökan saýlamaly!');
            return null;
        }

        this.state.selected_images.map(item => {
            formdata.append('images', item)
        })

        formdata.append('customer', localStorage.getItem('user_id') )
        this.setState({isLoading:true})
        axios.post(server + '/mob/products' , formdata).then(resp=>{
            this.setState({isLoading:false})
            alert('Haryt üstünlikli goşuldy. Moderator tassyklamasyna garaşyň');
        }).catch(err=>{
            this.setState({isLoading:false})
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }


    clearSelectedImages(){
        this.setState({selected_images:[]}, ()=>{
            this.setState({selectedImageCount: this.state.selected_images.length})
        })
    }

    
   
    render(){
             
        return <div className="products add">
            {
                this.state.locationSelectorOpen &&
                <LocationSelector parent={this}></LocationSelector>
            }
            
            {
                this.state.isLoading &&
                <div className="flex justify-center">
                    <CircularProgress></CircularProgress>
                </div>
            }
           
            <h3
                className="font-bold text-[20px]"
            >Täze haryt</h3>
           <div className="grid">
                               
                <input onChange={()=>{this.onImgSelect()}} 
                        id="imgselector" 
                        multiple 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                        hidden 
                        type='file'>
                </input>
                
                <input placeholder="Ady" className="p-[10px]" id="name"></input>

                <select className="field" id="store">
                    <option value={''}>Meniň dükanlarym (görkezilmedik)</option>
                    {this.state.stores.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>
                    
                <div  
                    className="location border rounded-[5px] p-[10px] flex items-center">
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
                
                <input placeholder="Bahasy TMT" className="field p-10px" id="price" type="number" min={0}></input>

               
                
                <select className="field" id="category">
                    <option value={''}>Kategoriýasy (görkezilmedik)</option>
                    {this.state.categories.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <textarea placeholder="Giňişleýin maglumat" className="min-h-100px" id="body_tm"></textarea>

              
                <button 
                    className=" p-[5px] border border-solid border-slate-300 hover:bg-slate-500 
                                hover:text-white duration-300 my-1" 
                    onClick={()=>{document.getElementById('imgselector').click()}}>
                    Saýlanan surat  {this.state.selected_images.length} sany
                </button>

                <div className="slctd_imgs">
                    {this.state.selected_images.map(item=>{
                        return <div className="relative border rounded m-[5px]">
                            <MdClose    
                                className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                        duration-300 absolute bg-red-600 rounded-[50%] p-[5px] 
                                        text-white shadow-md right-[5px] top-[5px]"
                                onClick={()=>{this.removeImage(item)}} 
                                size={35}>
                            </MdClose>
                            <img className="rounded-md" alt="" src={URL.createObjectURL(item)}></img>                            
                        </div>
                    })}
                </div>

                <button onClick={()=>{this.save()}} 
                    className="p-[10px] w-max flex items-center bg-sky-700 text-white">
                    <BiSave  className="icon m-[2px]"></BiSave>
                    <label>Ýatda saklamak</label>
                </button>
            </div> 
         
           
           
        </div>
    }
}

export default AddProduct;