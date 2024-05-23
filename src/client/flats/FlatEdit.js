import axios from "axios";
import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { server } from "../../static";
import { CircularProgress } from "@mui/material";
import Loader from "../components/Loader";

class FlatEdit extends React.Component{

    constructor(props){
        super(props);       

        this.state = {
            isLoading:true,  
        
            images:[],
          
            categories:[],
            trade_centers:[],
            sizes:[],
            locations:[],
            units:[],
            brands:[],
            factories:[],
            selected_images:[],
            countries:[],
            location_id:'',
            location_name:'',

            headers: {
                'token': localStorage.getItem('access_token'),
            }
        }

        document.title = 'Gozgalmaýan emläk | Düzetmek';
        this.setData()
    };

    setData(){
        const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const id = urlParams.get('id')
       
        const pathname = window.location.pathname
        const id = pathname.split('/')[3]
     
        axios.get(server + '/mob/flats/'+id).then(resp=>{            
            this.setState({ name: resp.data.name,
                            location: resp.data.location,
                            detail_text: resp.data.body_tm,
                            img: resp.data.img,
                            images: resp.data.images,
                            category: resp.data.category,
                            phone: resp.data.phone,
                            customer_id: resp.data.customer_id,
                            customer: resp.data.customer,
                            at_floor: resp.data.at_floor,
                            floor: resp.data.floor,
                            room_count: resp.data.room_count,
                            square: resp.data.square,
                            description: resp.data.description,
                            id: resp.data.id,
                            price: Number(resp.data.price.replace(' ', '').replace('TMT','')),
                            
                            isLoading:false })
        })

        axios.get(server + '/mob/index/flat').then(resp=>{
            this.setState({ categories: resp.data['categories']})
        })    

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ locations: resp.data })
            this.setState({ isLoading: false })
          
        }) 

        axios.get(server + '/mob/customers').then(resp=>{
            this.setState({ customers: resp.data })
            
        }) 
    }

    removeImage(file){
        var temp = this.state.selected_images
        temp.splice(temp.indexOf(file), 1)
      
        this.setState({selected_images: temp})
    }

    addSelectedImages(){
        var formdata = new FormData();
        let images = document.getElementById('imgselector').files

        for(let i=0; i<images.length; i++){
            formdata.append('images', images[i])
        }

        axios.put(server + '/mob/flats/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });
    }
    
    setMainImage(id){
        var formdata = new FormData();
      
        formdata.append('img', id)
      
        axios.put(server + '/mob/flats/'+this.state.id, formdata, {headers:this.state.headers}).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    removeImage(id){
        if(window.confirm('Bozmaga ynamyňyz barmy?')==true)
            axios.post(server + '/mob/flats/img/delete/'+ id, {}, {headers:this.state.headers} ).then(resp=>{
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
        }

            
    save(){
        this.setState({isLoading:true});
        if(document.getElementById('name').value.length ==0){
            alert('Adyny hökman girizmeli');
            this.setState({isLoading:false})
            return null
        }

        var formdata = new FormData();
        formdata.append('name', document.getElementById('name').value)   
                
        if(document.getElementById('category').value !=''){
            formdata.append('category', document.getElementById('category').value)
        }
    
        formdata.append('phone', document.getElementById('phone').value)
        formdata.append('price', document.getElementById('price').value)
        formdata.append('room_count', document.getElementById('room_count').value)
        formdata.append('floor', document.getElementById('floor').value)
        formdata.append('at_floor', document.getElementById('at_floor').value)
        formdata.append('square', document.getElementById('square').value)
        formdata.append('description', document.getElementById('description').value)

        formdata.append('location', this.state.location_id)
       
        axios.put(server + '/mob/flats/'+this.state.id , formdata, {headers:this.state.headers}).then(resp=>{
            alert('Ýatda saklandy')
            this.setData();
            this.setState({isLoading:false})
        }).catch(err=>{
            this.setState({isLoading:false})
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    delete(){

        if(window.confirm("Bozmaga ynamyňyz barmy?") == false){
            return null
        }

        axios.post(server + '/mob/flats/delete/'+this.state.id , {headers:this.state.headers}, ).then(resp=>{
            this.setData();
            this.setState({isLoading:false})
            window.history.back()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
            this.setState({isLoading:false})
        });

    }


    
    render(){
        
        return <div className="grid grid-cols-2 p-[10px]">
            <div className="grid h-max">
                <Loader open={this.state.isLoading}></Loader>
                
                <input onChange={()=>{this.addSelectedImages()}}
                    id="imgselector" 
                    multiple hidden
                    className="max-w-300px"
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                    type='file'>
                </input>
            
                <div className="flex flex-wrap">
                {
                    this.state.images.map(item=>{
                    return <div 
                                className="relative w-[150px] h-[150px] overflow-hidden border rounded-md m-[2px]" 
                                key={item.id}>
                        <img alt="" className="w-full h-full object-cover" src={server+item.img}></img>
                        <div className="absolute z-1">
                            <MdClose title="Bozmak" 
                                onClick={()=>{this.removeImage(item.id)}} 
                                className="m-[5px]"></MdClose>
                            <FcCheckmark 
                                onClick={()=>{this.setMainImage(item.id)}} 
                                title="Esasy surata bellemek" 
                                className="m-5px"></FcCheckmark>
                        </div>
                    </div>
                    })
                }
                        
                </div>
            </div>

            <div className="grid max-w-[300px] h-max text-[14px]">    
                <h3>{this.state.name}</h3>
                <label className="fieldName">Ady</label>
                <input id="name"  defaultValue={this.state.name}></input>

                <label className="fieldName">Bahasy (TMT)</label>
                <input id="price" type="number"  defaultValue={this.state.price}></input>

                <label className="fieldName">Otag sany</label>
                <input id="room_count" type="number"  defaultValue={this.state.room_count}></input>

                <label className="fieldName">Binadaky gat sany</label>
                <input id="floor" type="number"  defaultValue={this.state.floor}></input>

                <label className="fieldName">Ýerleşýän gaty</label>
                <input id="at_floor" type="number"  defaultValue={this.state.at_floor}></input>

                <label className="fieldName">Meýdany</label>
                <input id="square" type="number"  defaultValue={this.state.square}></input>


                <label className="fieldName">Telefon belgisi</label>
                <input id="phone"  defaultValue={this.state.phone}></input>

                <label className="fieldName">Kategoriýasy</label>
                <select id="category">
                    <option hidden value={''}>{this.state.category}</option>
                    {this.state.categories.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <label className="fieldName">Ýerleşýän ýeri</label>
                <select id="location">
                    <option value={''}>{this.state.location}</option>
                    {this.state.locations.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>
                

                <label className="fieldName">Giňişleýin maglumat</label>
                <textarea id="description" defaultValue={this.state.description}></textarea>

                <div className="btns">
                    <button 
                        onClick={()=>{this.save()}} 
                        className="bg-green-600 text-white rounded-md m-[5px] p-[5px]">Ýatda saklamak</button>
                    <button 
                        onClick={()=>{this.delete()}} 
                        className="bg-red-600 text-white rounded-md m-[5px] p-[5px]">Bozmak</button> 
                </div>
                
            </div>
              
           
        </div>
    }
}

export default FlatEdit;