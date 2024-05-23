import axios from "axios";
import React from "react";

import { BiPlus, BiTime } from "react-icons/bi";
import { server } from "../static";
import "./advs.css";
import { BiMap } from "react-icons/bi";
import {FcCheckmark, FcCancel} from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LocationSelector from "./LocationSelector";
import { AiFillDelete } from "react-icons/ai";
import { CircularProgress } from "@mui/material";


class AdvsDetail extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,    
            img:'./default.png',
            images:[],
          
            allLocations:[],
            categories:[],
            customers:[],
            stores:[],

            location_name:'',
            location_id: '',
            phone:'',
            contacts:[],
            
            types:[],
            
            auth : {'auth':{
                'username' : localStorage.getItem('admin_username'), 
                'password' : localStorage.getItem('admin_password'),}
            }
        }

        document.title = 'Reklama giňişleýin';


    };
    componentDidMount(){
        this.setData();

    }

    setData(){
        axios.get(server + '/mob/index/locations/all').then(resp=>{
                    this.setState({ allLocations: resp.data })})

        axios.get(server + '/mob/stores?pagination=None').then(resp=>{
            this.setState({ stores: resp.data })})

        axios.get(server + '/api/admin/ad_types', this.state.auth).then(resp=>{
            this.setState({ types: resp.data.data,
        })})

        axios.get(server + '/api/admin/ad_categories',  this.state.auth).then(resp=>{
            this.setState({ categories: resp.data.data,
        })})

        axios.get(server + '/api/admin/customers?pagination=None',  this.state.auth).then(resp=>{
            this.setState({ customers: resp.data,
        })})

        const pathname = window.location.pathname
        const id = pathname.split('/')[3];
        this.setState({id: id});
     
        axios.get(server + '/api/admin/ads/'+id,  this.state.auth).then(resp=>{
            
            this.setState({ title_tm: resp.data.title_tm,
                            location_name: resp.data.location,
                            location_id: resp.data.location_id,
                            viewed: resp.data.viewed, 
                            detail_text: resp.data.body_tm,
                            img: resp.data.img,
                            exprire_at: resp.data.exprire_at,
                            sort_order: resp.data.sort_order,
                            created_at: resp.data['created_at'],
                            images: resp.data['images'],
                            category: resp.data['category'],
                            phone: resp.data['phone'],
                            type: resp.data['type'],
                            type_id: resp.data.type_id,
                            customer: resp.data.customer,
                            customer_id: resp.data.customer_id,
                            category_id: resp.data.category_id,
                            store_id: resp.data.store_id,
                            store: resp.data.store,
                            active: resp.data['active'],
                            contacts: resp.data.contacts,
                             })

            this.setState({isLoading:false})
        })
    }


   


    deleteAdv(){
        let result = window.confirm("Bozmaga ynamyňyz barmy?")
        if(result == false){
            return null;
        }

        axios.post(server + '/api/admin/ads/delete/'+this.state.id, {}, this.state.auth).then(resp=>{
          window.history.back()
        });
    }


    changeStatus(statusValue){
        var fdata = new FormData()
     
        fdata.append('status',  statusValue )
        
        axios.put(server + '/api/admin/ads/'+this.state.id+'/', fdata).then(resp=>{
          this.setData()
        });

    }

    

    setMainImage(id){
        var formdata = new FormData();
      
        formdata.append('img', id)
      
        axios.put(server + '/api/admin/ads/'+this.state.id+'/', formdata, this.state.auth).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    deleteImage(id){
        if(window.confirm('Bozmaga ynamyňyz barmy?')==true)
            axios.post(server + '/api/admin/ads/img/delete/'+ id, {}, this.state.auth ).then(resp=>{
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
        }
           

    addSelectedImages(){
        var formdata = new FormData();
        let images = document.getElementById('imgselector').files

        for(let i=0; i<images.length; i++){
            formdata.append('img_l', images[i])
            formdata.append('ad', this.state.id)
     
            axios.post(server + '/api/admin/ad_imgs/', formdata, this.state.auth).then(resp=>{
                alert('Ýatda saklandy')
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
        }
       

    }

    save(){
        var formdata = new FormData();
        formdata.append('title_tm', document.getElementById('name').value)           
        formdata.append('category', document.getElementById('category').value)
        formdata.append('body_tm', document.getElementById('body_tm').value)
        formdata.append('phone', document.getElementById('phone').value)
        formdata.append('location', this.state.location_id)        
        formdata.append('type', document.getElementById('type').value)
        formdata.append('sort_order', document.getElementById('sort_order').value)
        formdata.append('customer', document.getElementById('customer').value)
        formdata.append('store', document.getElementById('store').value)
        
       
        axios.put(server + '/api/admin/ads/'+this.state.id+'/' , formdata, this.state.auth).then(resp=>{
            alert('Ýatda saklandy')
            this.setData();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }

    add_contact(){
        var formdata = new FormData();
        formdata.append('value', document.getElementById('new_contact_value').value)   
        formdata.append('type', document.getElementById('new_contact_type').value)   
        formdata.append('adv', this.state.id)   

        axios.post(server + '/api/admin/ad_contacts/' , formdata, this.state.auth).then(resp=>{
            this.setData();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });
    }

   
    render(){

        return <div className="advs_detail">

            {this.state.isLoading &&
                <div className="downloader"><CircularProgress></CircularProgress></div>            
            }

            

            <div>
                <button className="save" onClick={()=>{this.save()}} >Ýatda sakla</button>
                <button onClick={()=>{this.deleteAdv()}} className="deleteStore">Bozmak</button>
            </div>
            
            <h2>{this.state.title_tm}</h2>

            <div className="gallery">
                <a href={server + this.state.img}>
                    <img className="mainImage" src={server + this.state.img}></img>
                </a>
                <div className="images">

                    {this.state.images.map(item=>{
                        return <div className="imageCard"> 
                            <img defaultValue={'/default.png'} src={ server+ item.img}></img>
                            <div className="actions">
                                <AiFillDelete onClick={()=>{this.deleteImage(item.id)}}></AiFillDelete>
                                <FcCheckmark onClick={()=>{this.setMainImage(item.id)}}></FcCheckmark>
                            </div>
                        </div>
                        
                    })}
                    <div className="imageCard"> 
                        <img onClick={()=>{document.getElementById('imgselector').click()}} src={'/default.png'}></img>
                        <input onChange={()=>{this.addSelectedImages()}} 
                        id="imgselector" 
                        multiple 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                        hidden 
                        type='file'></input>

                    </div>
                </div>
            </div>

          
            
            <div className="textData">

                <div className="fields">
                 
                    <label>Ady</label>
                    <input id="name" defaultValue={this.state.title_tm}></input>

                    <label>Möhleti</label>
                    <input id="expire_at" type="date" defaultValue={this.state.name}></input>

                    <label>Tertip belgisi</label>
                    <input id="sort_order" type="number"  defaultValue={this.state.sort_order}></input>

                    <label>Telefon belgisi</label>
                    <div>
                        <label>+993</label>
                        <input type="number" min={61000000} max={65999999} id="phone"  
                                defaultValue={this.state.phone.replace('+993', '')}></input>
                    </div>
                   
                    <button onClick={()=>{this.setState({locationSelectorOpen:true})}}>
                        <BiMap></BiMap>
                        Ýerleşýän ýeri - {this.state.location_name}</button>
                    {this.state.locationSelectorOpen == true &&
                        <LocationSelector parent={this} open={this.state.locationSelectorOpen}></LocationSelector>                    
                    }

                    <label>Görnüşi</label>
                    <select defaultValue={this.state.type_id} id="type">
                        <option value={this.state.type_id} hidden>{this.state.type}</option>
                        {this.state.types.map(item=>{    
                            return <option value={item.id}> {item.name_tm}</option>
                        })}
                    </select>

                    <label>Kategoriýasy</label>                   
                    <select id="category">
                        <option value={this.state.category_id} hidden>{this.state.category}</option>
                        {this.state.categories.map(item=>{
                            return <option value={item.id}> {item.name_tm}</option>
                        })}
                    </select>

                    <label>Ulanyjy</label>                   
                    <select id="customer">
                        <option value={this.state.customer_id} hidden>{this.state.customer}</option>
                        {this.state.customers.map(item=>{
                            return <option value={item.id}>{item.phone} {item.name}</option>
                        })}
                    </select>

                    <label>Söwda nokady</label>                   
                    <select id="store">
                        <option value={this.state.store_id} hidden>{this.state.store}</option>
                        {this.state.stores.map(item=>{
                            return <option value={item.id}>{item.name_tm}</option>
                        })}
                    </select>

                    <label>Goşmaça maglumat</label>
                    <textarea id="body_tm" defaultValue={this.state.detail_text}></textarea>
                    
                    
                </div>
                <div>
                    
                </div>
                <div className="view">
                    <label><FiEye size={20}></FiEye>{this.state.viewed}</label>
                    <label> <BiTime size={20}></BiTime> {this.state.created_at}</label>

                </div>
              
                <label>Kontaktlar </label>
                    <div className="contact-create">
                        <input placeholder="Contact" type="text" id="new_contact_value"></input>
                        <select id="new_contact_type">
                            <option value={'phone'}>Phone</option>
                            <option value={'imo'}>IMO</option>
                            <option value={'gmail'}>Gmail</option>
                            <option value={'mail'}>Mail</option>
                        </select>
                        <button onClick={()=>{this.add_contact()}}>
                            <label>Goşmak</label>
                            <BiPlus className="add-contact"></BiPlus>
                        </button>
                    </div>
                <div>
                    {this.state.contacts.map(item=>{
                        return <div>
                            <label>{item.value}</label>
                        </div>
                    })}
                </div>
            </div>

        </div>
    }
}

export default AdvsDetail;