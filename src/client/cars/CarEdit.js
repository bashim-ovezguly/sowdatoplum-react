import axios from "axios";
import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { server } from "../../static";
import "./car_edit.css";
import { BiCalendar, BiMap, BiPhone, BiTime } from "react-icons/bi";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import LocationSelector from "../../admin/LocationSelector";
import Loader from "../components/Loader";

class CarEdit extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            isLoading:true,                    
            created_at:'',
            price:'',
              
            marks:[],
            models:[],
            fuels:[],
            countries:[],
            transmissions:[],
            wheel_drives:[],
            colors:[],
            allLocations:[],
            body_types:[],
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
            axios.post(server + '/mob/cars/delete/'+this.state.id).then(resp=>{
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
        if (this.state.selectedMark !== undefined){
            q = '?mark='+this.state.selectedMark
        } 

        // index values
        axios.get(server + '/mob/index/car'+ q ).then(resp=>{
                    this.setState({ categories: resp.data['categories'],
                                    transmissions: resp.data['transmissions'], 
                                    countries: resp.data['countries'], 
                                    colors: resp.data['colors'], 
                                    wheel_drives: resp.data['wheel_drives'], 
                                    models: resp.data['models'], 
                                    marks: resp.data['marks'], 
                                    fuels: resp.data['fuels'], 
                                    body_types: resp.data['body_types'], 
                })
                this.setState({isLoading:false})
            })
     
        axios.get(server + '/mob/cars/'+id).then(resp=>{
            document.title = resp.data['mark'] + ' ' + resp.data['model'] + ' ' + resp.data['year']

            this.setState({ mark: resp.data.mark,
                            mark_id: resp.data.mark_id,
                            model: resp.data.model,
                            model_id: resp.data.model_id,
                            price: resp.data.price,
                            main_img: resp.data.img.img_m,
                            color: resp.data.color,
                            color_id: resp.data.color_id,
                            credit: resp.data.credit,
                            swap: resp.data.swap,
                            none_cash_pay: resp.data.none_cash_pay,
                            fuel: resp.data.fuel,
                            fuel_id: resp.data.fuel_id,
                            body_type: resp.data.body_type,
                            body_type_id: resp.data.body_type_id,
                            id: resp.data.id,
                            millage: resp.data.millage,
                            on_search: resp.data.on_search,
                            transmission: resp.data.transmission,
                            transmission_id: resp.data.transmission_id,
                            vin: resp.data.vin,
                            year: resp.data.year,
                            recolored: resp.data.recolored,
                            engine: resp.data.engine,
                            location_name: resp.data.location,
                            location_id: resp.data.location_id,
                            viewed: resp.data.viewed, 
                            detail: resp.data.detail,
                            wd: resp.data.wd,
                            wd_id: resp.data.wd_id,
                            created_at: resp.data.created_at,
                            images: resp.data.images,
                            phone: resp.data.phone,
                            store: resp.data.store,
                            store_id: resp.data.store_id,
                            customerID: resp.data.customer.id,
                            customer_name: resp.data.customer.name,
                            isLoading:false 
                        })
        })
    }

    


    
    addSelectedImages(){
        this.setState({isLoading : true})
        var formdata = new FormData();
        let images = document.getElementById('imgselector').files

        for(let i=0; i<images.length; i++){
            formdata.append('images', images[i])
        }

        axios.put(server + '/mob/cars/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    setMainImage(id){
        var formdata = new FormData();
      
        formdata.append('img', id)
      
        axios.put(server + '/mob/cars/'+this.state.id, formdata).then(resp=>{
            alert('Ýatda saklandy')
            this.setData()
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }
    
    removeImage(id){
        if(window.confirm('Bozmaga ynamyňyz barmy?')===true)
            axios.post(server + '/mob/cars/img/delete/'+ id ).then(resp=>{
                this.setData()
            }).catch(err=>{
                alert('Ýalňyşlyk ýüze çykdy')
            });
    }

    
    save(){
        var formdata = new FormData();
        formdata.append('model', document.getElementById('model').value);
        formdata.append('body_type', document.getElementById('body_type').value);
        formdata.append('color', document.getElementById('color').value);
        formdata.append('wd', document.getElementById('wd').value);        
        formdata.append('fuel', document.getElementById('fuel').value);        
        formdata.append('transmission', document.getElementById('korobka').value);
        formdata.append('vin', document.getElementById('vin').value);
        formdata.append('price', document.getElementById('price').value.replace(' TMT', '').replace(' ',''));
        formdata.append('engine', document.getElementById('engine').value);
        formdata.append('year', document.getElementById('year').value);
        formdata.append('millage', document.getElementById('millage').value);
        formdata.append('phone', document.getElementById('phone').value);
        formdata.append('detail', document.getElementById('description').value);
        formdata.append('location', this.state.location_id)

        if(document.getElementById('swap').checked){
            formdata.append('swap', true)
        }
        else{
            formdata.append('swap', false)
        }

        if(document.getElementById('credit').checked){
            formdata.append('credit', true)
        }
        else{
            formdata.append('credit', false)
        }

        if(document.getElementById('recolored').checked){
            formdata.append('recolored', true)
        }
        else{
            formdata.append('recolored', false)
        }

        if(document.getElementById('none_cash_pay').checked){
            formdata.append('none_cash_pay', true)
        }
        else{
            formdata.append('none_cash_pay', false)
        }
       
        axios.put(server + '/mob/cars/'+this.state.id , formdata).then(resp=>{
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
        
        return <div className="p-[20px] grid">
            <Loader open={this.state.isLoading}></Loader>

            <div>
                <input onChange={()=>{this.addSelectedImages()}}
                    id="imgselector" 
                    multiple 
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                    hidden 
                    type='file'></input>
                
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1">

                <div className="grid h-max">

                    <img alt="" className="w-[100%] rounded-lg my-[5px]" src={main_img}></img>
                    <div className="images flex flex-wrap">
                        {
                            this.state.images.map(item=>{
                                var img=server+item.img_s;
                                if(item.img_m === ''){
                                    img = default_img_url
                                }

                                return <div className="flex flex-wrap" key={item.id}>
                                    <img alt="" className="border w-[100px] h-[100px] rounded-lg object-cover" src={img}></img>
                                    <div className="absolute flex items-center ">
                                        <MdClose title="Bozmak" size={25} 
                                            onClick={()=>{this.removeImage(item.id)}} 
                                            className="rounded-full p-[2px] bg-white shadow-lg m-[5px]">
                                        </MdClose>

                                        <FcCheckmark size={25}
                                            onClick={()=>{this.setMainImage(item.id)}} 
                                            title="Esasy surata bellemek" 
                                            className="rounded-full p-[2px] bg-white shadow-lg m-[5px]"></FcCheckmark>
                                    </div>
                                
                                </div>
                            })
                        }

                    </div>
                    <button 
                        className="button-steelblue rounded-lg bg-sky-600 text-white w-max p-[5px]"
                        onClick={()=>{document.getElementById('imgselector').click()}}>
                        Surat goş
                    </button>
                </div>

                {/* INPUTS */}
                <div className="grid text-[14px] h-max px-[20px] max-w-[400px]">                    
                    
                    <label className='mx-[5px]'>Markasy</label>
                    <select id="mark" onChange={()=>{this.onMarkSelect()}}>
                        <option value={this.state.mark_id}>{this.state.mark}</option>
                        {this.state.marks.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>

                    <label className='mx-[5px]'>Modeli</label>
                    <select id="model">
                        <option value={this.state.model_id}>{this.state.model}</option>
                        {this.state.models.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>
                    
                    <label className='mx-[5px]'>Bahasy (TMT)</label>
                    <input id="price" defaultValue={this.state.price.replace(' TMT', '')}></input>

                    <label className='mx-[5px]'>Motory</label>
                    <input id="engine" defaultValue={this.state.engine}></input>

                    <label className='mx-[5px]'>Ýyly</label>
                    <input id="year" defaultValue={this.state.year}></input>

                    <label className='mx-[5px]'>Geçen ýoly (km)</label>
                    <input id="millage" defaultValue={this.state.millage}></input>

                    <label className='mx-[5px]'>Telefon belgisi</label>
                    <input id="phone" defaultValue={this.state.phone}></input>

                    <label className='mx-[5px]'>Kuzowy</label>
                    <select id="body_type">
                        <option hidden value={this.state.body_type_id}>{this.state.body_type}</option>
                        <option value={''}>(Görkezilmedik)</option>
                        {this.state.body_types.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>

                    <label className='mx-[5px]'>Reňki</label>
                    <select id="color">
                        <option value={this.state.color_id} hidden>{this.state.color}</option>
                        <option value={''}>(Görkezilmedik)</option>
                        {this.state.colors.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>

                    <label className='mx-[5px]'>Ýörediji</label>
                    <select id="wd">
                        <option hidden value={this.state.wd_id}>{this.state.wd}</option>
                        <option value={''}>(Görkezilmedik)</option>
                        {this.state.wheel_drives.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                        })}
                    </select>

                    <label className='mx-[5px]'>Ýangyjy</label>
                    <select id="fuel">
                        <option hidden value={this.state.fuel_id}>{this.state.fuel}</option>
                        <option value={''}>(Görkezilmedik)</option>
                        {this.state.fuels.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                        })}
                    </select>

                    <label className='mx-[5px]'>Korobka</label>
                    <select id="korobka">
                        <option hidden value={this.state.transmission_id}>{this.state.transmission}</option>
                        <option value={''}>(Görkezilmedik)</option>
                        {this.state.transmissions.map(item=>{
                            return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                        })}
                    </select>
                    
                    <label className='mx-[5px]'>Ýerleşýän ýeri</label>
                    <div className="border rounded p-[10px] m-[5px] flex items-center" onClick={()=>{this.setState({locationSelectorOpen:true})}}>
                        <BiMap></BiMap> {this.state.location_name}
                    </div>
                    
                                
                    {this.state.locationSelectorOpen &&
                        <LocationSelector parent={this}></LocationSelector> }

                    <label className='mx-[5px]'>VIN</label>
                    <input id="vin" defaultValue={this.state.vin}></input>
                    

                    <label className='mx-[5px]'>Giňişleýin maglumat</label>
                    <textarea className="min-h-200px" id="description" defaultValue={this.state.detail}></textarea>
                    
                    <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                border-slate-200 rounded-md m-[5px] p-[5px]"
                        
                                onClick={()=>{document.getElementById('swap').click()}}
                        >
                        <input defaultChecked={this.state.swap} className="w-[20px] h-[20px]" id="swap" type={'checkbox'}></input>
                        <label className='mx-[5px]'>Çalşyk</label>
                    </div>
                    <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                    border-slate-200 rounded-md m-[5px] p-[5px]"
                        onClick={()=>{document.getElementById('credit').click()}}
                        >
                        <input defaultChecked={this.state.credit} className="w-[20px] h-[20px]" id="credit"  type={'checkbox'}></input>
                        <label className='mx-[5px]'>Kredit</label>
                    </div>
                    <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                    border-slate-200 rounded-md m-[5px] p-[5px]"
                        onClick={()=>{document.getElementById('none_cash_pay').click()}}
                        >
                        <input defaultChecked={this.state.none_cash_pay} className="w-[20px] h-[20px]" id="none_cash_pay"  type={'checkbox'}></input>
                        <label className='mx-[5px]'>Nagt däl töleg</label>
                    </div>
                    <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                    border-slate-200 rounded-md m-[5px] p-[5px]"
                        onClick={()=>{document.getElementById('recolored').click()}}
                        >
                        <input defaultChecked={this.state.recolored} className="w-[20px] h-[20px]" id="recolored"  type={'checkbox'}></input>
                        <label className='mx-[5px]'>Reňki üýtgedilen</label>
                    </div>   
                    
                </div>

            </div>

            <div>
               
            
            <button onClick={()=>{this.save()}} className="bg-green-800 text-white rounded-md p-[5px]">Ýatda sakla</button>
            <button onClick={()=>{this.delete()}} className="bg-red-800 text-white rounded-md p-[5px]">Bozmak</button>
            
            </div>

           
        </div>
    }


}

export default CarEdit;