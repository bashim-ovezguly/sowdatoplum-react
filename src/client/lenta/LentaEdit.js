import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import "./lenta.css";
import { BiCalendar } from "react-icons/bi";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdCheck, MdClose, MdSave } from "react-icons/md";
import Loader from "../components/Loader";


class LentaEdit extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,  
            current_page:'',
            last_page:'',
            total_page:'',
            images:[],

            customer_photo:'',
            customer:'',
            view:'',
            created_at:'',
            
            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            },

            token: localStorage.getItem('user_access_token'),
        }

        document.title = 'Lenta';
        this.setData()
    };

    save(){
        var formdata = new FormData();
        formdata.append('text', document.getElementById('text').value);
        this.setState({isLoading:true})
        axios.put(server + '/mob/lenta/'+this.state.id , formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });
    }

    setPage(pageNumber){    
      
        axios.get(server + '/mob/lenta?page='+pageNumber).then(resp=>{
            this.setState({ datalist: resp.data.data})  
        })
    }   

    setData(){
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const customer = urlParams.get('customer')
    
        const pathname = window.location.pathname
        const id = pathname.split('/')[3]
     
        axios.get(server + '/mob/lenta/'+id).then(resp=>{
            this.setState({ lenta: resp.data})    
            this.setState({ customer_photo: resp.data.data.customer_photo})    
            this.setState({ customer: resp.data.data.customer})    
            this.setState({ images: resp.data.data.images})    
            this.setState({ view: resp.data.data.view})    
            this.setState({ created_at: resp.data.data.created_at})    
            this.setState({ text: resp.data.data.text})    
            this.setState({ id: resp.data.data.id})    
            this.setState({ images: resp.data.data.images})    
            this.setState({ isLoading: false})    
        })
    }


    addSelectedImages(){
        this.setState({isLoading:true})
        var formdata = new FormData();
        let images = document.getElementById('imgselector').files

        for(let i=0; i<images.length; i++){
            formdata.append('images', images[i])
        }

        this.setState({isLoading : true})

        axios.put(server + '/mob/lenta/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            document.getElementById('imgselector').value = null
            this.setData()
            this.setState({isLoading : true})
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
            this.setState({isLoading : true})
        });

    }

    removeImage(id){
        if(window.confirm('Bozmaga ynamyňyz barmy?')===true)
            axios.post(server + '/mob/lenta/img/delete/'+ id, {}, {headers:{token:this.state.token}}).then(resp=>{
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
    }
    

    render(){
      
        return <div className="lentaEdit grid  max-w-[600px] mx-auto">
                
                <Loader open = {this.state.isLoading}></Loader>

                {/* IMAGES */}
                <div className="flex flex-wrap">
                {
                    this.state.images.map(item=>{
                        return <div className="relative">
                            <img 
                                alt="" 
                                className="w-[100px] h-[100px] object-cover m-[10px]" 
                                src={server + item.img}>
                            </img>

                            <div className="absolute top-[2px] left-[2px] z-1 flex">
                                <MdClose size={25}
                                    title="Bozmak" 
                                    onClick={()=>{this.removeImage(item.id)}} 
                                    className="bg-red-700 hover:bg-red-600 duration-300 hover:shadow-lg 
                                                text-white rounded-full p-[5px] m-[2px]">
                                </MdClose>
                                <MdCheck size={25}
                                    onClick={()=>{this.setMainImage(item.id)}} 
                                    title="Esasy surata bellemek" 
                                    className="bg-white hover:bg-slate-400 duration-300 hover:shadow-lg  
                                                text-green-700 rounded-full p-[5px] m-[2px]">
                                </MdCheck>
                            </div>
                        </div>
                    })
                }
                </div>
                {/* IMAGES ENDS */}

                <input onChange={()=>{this.addSelectedImages()}}
                        id="imgselector" 
                        multiple hidden
                        className="max-w-300px"
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"  
                        type='file'>
                </input>

                <button 
                    onClick={()=>{document.getElementById('imgselector').click()}}
                    className="bg-sky-600 p-[5px] text-white w-max text-[14px]">Surat goşmak</button>

                <textarea 
                    id="text" 
                    className="min-h-[200px]" 
                    defaultValue={this.state.text}>
                </textarea>                        
                 
                <div className="view">
                    <FiEye></FiEye><label>{this.state.view}</label>
                    <BiCalendar></BiCalendar><label>{this.state.created_at}</label>
                </div>
               <div className="flex flex-wrap">
                    <button onClick={()=>{this.save()}}
                        className="flex items-center text-[14px] bg-sky-600 text-white p-[5px]">
                        <MdSave size={25}></MdSave>
                        <label>Ýatda saklamak</label>
                    </button>
               </div>
                
            </div>  
          
    }
}

export default LentaEdit;