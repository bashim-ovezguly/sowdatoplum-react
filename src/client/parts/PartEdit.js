import axios from "axios";
import React from "react";
import { server } from "../../static";
import { BiMap,   } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import { MdCheck, MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";
import Loader from "../components/Loader";

class PartEdit extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            isLoading:true,                    
            created_at:'',
            price:'',
              
            marks:[],
            models:[],
          
            allLocations:[],
            images:[],      
            location_id:'',
            location_name:'',

            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            }
        }

        // document.title = 'Dükanlar';
        this.setData()
    };

    componentDidMount(){
       
    }

    delete(){     

        let result = window.confirm('Bozmaga ynamyňyz barmy?');
        if(result == true){
            axios.post(server + '/mob/parts/delete/'+this.state.id).then(resp=>{
                window.history.back();
            });
        }
        
    }

    setData(){
        const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const id = urlParams.get('id')
       
        const pathname = window.location.pathname
        const id = pathname.split('/')[3]

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ allLocations: resp.data })
        })

        let q = '';
        if (this.state.selectedMark != undefined){
            q = '?mark='+this.state.selectedMark
        } 

        // index values
        axios.get(server + '/mob/index/part'+ q ).then(resp=>{
                    this.setState({ categories: resp.data['categories'],
                                 
                        models: resp.data['models'], 
                        marks: resp.data['marks'], 
                                 
                })
                this.setState({isLoading:false})
            })
     
        axios.get(server + '/mob/parts/'+id).then(resp=>{
            document.title = resp.data.name

            this.setState({ mark: resp.data.mark,
                            mark_id: resp.data.mark_id,
                            model: resp.data.model,
                            model_id: resp.data.model_id,
                            price: resp.data.price,
                            main_img: resp.data.img,
                            id: resp.data.id,
                            location_name: resp.data.location,
                            location_id: resp.data.location_id,
                            viewed: resp.data.viewed, 
                            detail: resp.data.detail,
                            name: resp.data.name,
                            created_at: resp.data.created_at,
                            images: resp.data.images,
                            phone: resp.data.phone,
                            store: resp.data.store,
                            store_id: resp.data.store_id,
                            customerID: resp.data.customer.id,
                            customer_name: resp.data.customer.name,
                            isLoading:false })
        })
    }

    


    
    addSelectedImages(){
        this.setState({isLoading:true})
        var formdata = new FormData();
        let images = document.getElementById('imgselector').files

        for(let i=0; i<images.length; i++){
            formdata.append('images', images[i])
        }

        axios.put(server + '/mob/parts/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            document.getElementById('imgselector').value = null
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    setMainImage(id){
        var formdata = new FormData();
      
        formdata.append('img', id)
      
        axios.put(server + '/mob/parts/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    removeImage(id){
        if(window.confirm('Bozmaga ynamyňyz barmy?')==true)
            axios.post(server + '/mob/parts/img/delete/'+ id ).then(resp=>{
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
        }

    
    save(){
        var formdata = new FormData();
        formdata.append('name', document.getElementById('name').value);
        formdata.append('name_tm', document.getElementById('name').value);
        formdata.append('model', document.getElementById('model').value);
        formdata.append('price', document.getElementById('price').value.replace(' TMT', '').replace(' ',''));
        formdata.append('phone', document.getElementById('phone').value);
        formdata.append('detail', document.getElementById('description').value);
        formdata.append('location', this.state.location_id)
       
        axios.put(server + '/mob/parts/'+this.state.id , formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });
    }

    onMarkSelect(){
        let mark_id = document.getElementById('mark').value

        axios.get(server + '/mob/index/car?mark=' + mark_id  ).then(resp=>{
            this.setState({ categories: resp.data.categories,
                            transmissions: resp.data.transmissions, 
                            countries: resp.data.countries, 
                            colors: resp.data.colors, 
                            wds: resp.data.wheel_drives, 
                            models: resp.data.models, 
                            marks: resp.data.marks, 
                            fuels: resp.data.fuels, 
                            bodyTypes: resp.data.body_types, 
        })
        this.setState({isLoading:false})
    })

    }

    

    render(){
        var default_img_url = '/default.png';
        var main_img = server + this.state.main_img

        if(this.state.main_img ===''){
            main_img = default_img_url
        }
        
        return <div className="part_edit grid justify-center">
                <div className="preview h-max grid grid-cols-[max-content_auto]">
                    <img 
                        alt="" 
                        className="w-[100px] h-[100px] m-[10px] object-cover rounded-md" 
                        src={main_img}></img>

                    <div className="grid m-[20px] h-max">
                        <label className="text-[20px] font-bold">{this.state.name}</label>
                        <label className="text-sky-600 font-bold text-[20px]">{this.state.price}</label>
                        <label>{this.state.created_at}</label>
                        <label>{this.state.category}</label>
                        <label>{this.state.location}</label>
                    </div>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-1">

                    <div className="grid">

                        {/* IMAGES */}
                        <div className="flex flex-wrap overflow-x-auto w-full p-[10px] h-max">
                            {
                            this.state.images.map(item=>{
                                var img=server+item.img_s;
                                if(item.img_m === ''){
                                    img = default_img_url
                                }
                                
                                return <div className="relative m-[5px]" key={item.id}>
                                    <img 
                                        alt="" 
                                        className="h-[100px] w-[100px] object-cover " 
                                        src={img}></img>
                                    <div className="absolute top-[2px] left-[2px] z-2 flex">
                                        <MdClose size={25}
                                            title="Bozmak" 
                                            onClick={()=>{this.removeImage(item.id)}} 
                                            className="bg-red-700 hover:bg-red-600 duration-300 hover:shadow-lg text-white rounded-full p-[5px] m-[2px]">
                                        </MdClose>
                                        <MdCheck size={25}
                                            onClick={()=>{this.setMainImage(item.id)}} 
                                            title="Esasy surata bellemek" 
                                            className="bg-white hover:bg-slate-400 duration-300 hover:shadow-lg  text-green-700 rounded-full p-[5px] m-[2px]">
                                        </MdCheck>
                                    </div>
                                </div>
                            })
                            }
                        </div>
                    </div>


                    <input onChange={()=>{this.addSelectedImages()}}
                        id="imgselector" 
                        multiple hidden
                        className="max-w-300px"
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"  
                        type='file'>
                    </input>

                    <div className="grid max-w-[400px] min-w-[300px] mx-auto text-[14px] h-max">   
                        <label className="font-bold">Ady</label>            
                        <input id="name" defaultValue={this.state.name}></input>                 
                    
                        <label className="font-bold">Markasy</label>
                        <select id="mark" onChange={()=>{this.onMarkSelect()}}>
                            <option value={this.state.mark_id}>{this.state.mark}</option>
                            {this.state.marks.map(item=>{
                                return  <option id={item.id} value={item.id}>{item.name}</option>
                            })}
                        </select>

                        <label className="font-bold">Modeli</label>
                        <select id="model">
                            <option value={this.state.model_id}>{this.state.model}</option>
                            {this.state.models.map(item=>{
                                return  <option id={item.id} value={item.id}>{item.name}</option>
                            })}
                        </select>
                        
                        <label className="font-bold">Bahasy (TMT)</label>
                        <input id="price" defaultValue={this.state.price.replace(' TMT', '')}></input>

                        <label className="font-bold">Telefon belgisi</label>
                        <input id="phone" defaultValue={this.state.phone}></input>

                        <label className="font-boldfont-bold">Ýerleşýän ýeri</label>
                        <div  
                            className="location border rounded-[5px] p-[10px] m-5px flex items-center">
                            <BiMap 
                                size={25}
                                className="hover:bg-slate-200 rounded-md p-[2px]" 
                                onClick={()=>{this.setState({locationSelectorOpen:true})}}>
                            </BiMap>
                            <label>{this.state.location_name}</label>
                            {this.state.location_name.length > 0 &&
                            <MdClose 
                                size={25} 
                                className="border rounded-circle hover:bg-slate-400 rounded-md" 
                                onClick={()=>{
                                    this.setState({location_name:''});
                                    this.setState({location_id:''});
                            }}></MdClose>}
                        </div>
                                    
                        {this.state.locationSelectorOpen &&
                            <LocationSelector parent={this}></LocationSelector> }

                        <label className="font-bold">Giňişleýin maglumat</label>
                        <textarea id="description" defaultValue={this.state.detail}></textarea>

                        <div>
                            <button onClick={()=>{this.save()}} className="button-green">Ýatda saklamak</button>
                            <button onClick={()=>{this.delete()}} className="button-red">Bozmak</button>
                        </div>
                    </div>
                   
                </div>

                    

                <Loader open={this.state.isLoading}></Loader>

        </div>
    }


}

export default PartEdit;