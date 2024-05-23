import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./add.css";
import LocationSelector from "../../admin/LocationSelector";
import { BiMap, BiSave } from "react-icons/bi";
import Loader from "../components/Loader";
import { MdClose, MdSave } from "react-icons/md";

class AddCar extends React.Component{

    constructor(props){
        super(props);
        

        this.state = {
            isLoading:true,  
            locations:[],
            categories:[],
            countries:[],
            selected_images:[],
            marks:[],
            models:[],
            fuels:[],
            transmissions:[],
            wds:[],
            bodyTypes:[],
            colors:[],
            stores:[],
            customers:[],
            location_name:'',
            location_id:'',
        }

        document.title = 'Täze awtoulag';
        this.setData()
    };
   

    setData(){
       
        const customer_id = localStorage.getItem('user_id')
    
        if(this.props.customers ==='all'){
            axios.get(server + '/mob/customers').then(resp=>{
                this.setState({ customers: resp.data })
                
            })
        }


        if (customer_id != null){
            axios.get(server + '/mob/customer/'+customer_id).then(resp=>{
                this.setState({ customerName: resp.data.data['name'] })
                this.setState({customerID : customer_id});
            })
        }

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ locations: resp.data })})

            
        let q = '';
        if (this.state.selectedMark !== undefined){
            q = '?mark='+this.state.selectedMark
        } 

        axios.get(server + '/mob/index/car'+ q ).then(resp=>{
                    this.setState({ categories: resp.data['categories'],
                                    transmissions: resp.data['transmissions'], 
                                    countries: resp.data['countries'], 
                                    colors: resp.data['colors'], 
                                    wds: resp.data['wheel_drives'], 
                                    models: resp.data['models'], 
                                    marks: resp.data['marks'], 
                                    fuels: resp.data['fuels'], 
                                    bodyTypes: resp.data['body_types'], 
                })
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
            if(t.find(x=> x.name === files[i].name)===undefined){
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
        let error = false;
        let errorList= []
       
        if(document.getElementById('mark').value.length === 0){
            errorList.push('Markasyny hökman girizmeli')
            error = true
        }

        if(document.getElementById('model').value.length === 0){
            errorList.push('Modelini hökman girizmeli')
            error = true
        }

        if(document.getElementById('year').value.length === 0){
            errorList.push('Ýylyny hökman girizmeli')
            error = true
        }

        if(error === true){
            let msg='Ýalňyşyklaryň sanawy:'
            for(let i=0; i<errorList.length; i++){
                msg = msg + '\n - ' + errorList[i];
            }
            alert(msg);
            return null
        }

        var formdata = new FormData();
        
        formdata.append('phone', document.getElementById('phone').value)
        formdata.append('body_type', document.getElementById('body_type').value)
        formdata.append('location', this.state.location_id)
        formdata.append('mark', document.getElementById('mark').value)
        formdata.append('model', document.getElementById('model').value)
        formdata.append('color', document.getElementById('color').value)
        formdata.append('fuel', document.getElementById('fuel').value)
        formdata.append('transmission', document.getElementById('transmission').value)
        formdata.append('year', document.getElementById('year').value)
        formdata.append('millage', document.getElementById('millage').value)
        formdata.append('wd', document.getElementById('wd').value)
        formdata.append('motor', document.getElementById('motor').value)
        formdata.append('price', document.getElementById('price').value)
        // formdata.append('store', document.getElementById('store').value)
        
        for(let i=0; i<this.state.selected_images.length; i++){
            formdata.append('images', this.state.selected_images[i])
        }

        if(this.props.customers==='all'){
            formdata.append('customer', document.getElementById('customer').value)
        }
        else{
            formdata.append('customer', localStorage.getItem('user_id') )
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

        if(document.getElementById('recolored').checked === true){
            formdata.append('recolored', true)
        }
        this.setState({isLoading:true})
        axios.post(server + '/mob/cars' , formdata).then(resp=>{
            this.setState({isLoading:false})
            alert('Üstünlikli goşuldy. Moderator tassyklamasyna garaşyň');
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }

    storeCard(){
        if(this.state.storeID ==null){
            return null
        }
        return <div className="storeCard">
                <img alt="" src={server + this.state.img}></img>
                <a href={'/stores/'+this.state.storeID}> 
                    <h3>                      
                        {this.state.storeName}
                    </h3>
                </a>
            </div>
    }


    render(){
        
        return <div className="add car">
           <Loader open={this.state.isLoading}></Loader>
            <h3 
                className="font-bold text-[20px]"
            >
                    Täze awtoulag
            </h3>
           <div className="fields">

                <input onChange={()=>{this.onImgSelect()}} 
                        id="imgselector" 
                        multiple 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                        hidden 
                        type='file'>        
                </input>

                 <select onChange={()=>{
                        this.setState({selectedMark:document.getElementById('mark').value}, ()=>{
                            this.setData();                        
                        });                      
                        }} id="mark">
                    <option hidden value={''}>Markasy</option>
                    {this.state.marks.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>

                <select id="model">
                    <option hidden value={''}>Model</option>
                    {this.state.models.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>
                <input id="year" type={'number'} min={1900} placeholder="Ýyly"></input>
                <input id="price" placeholder="Bahasy (TMT)" type={'number'} min={0}></input>
                <input id="motor" type={'number'} step={0.1} min={0} max={10} placeholder="Motoryň göwrümi"></input>
                <input id="millage" type={'number'} min={0} placeholder="Geçen ýoly (km)"></input>

                <div className="border border-solid border-slate-300 p-[5px] rounded-md m-[5px]  flex items-center" 
                    >
                    <BiMap 
                        onClick={()=>{this.setState({locationSelectorOpen:true})}}
                        className="text-slate-600 hover:bg-slate-200 rounded-md  duration-300 " size={30}>
                    </BiMap> 
                        
                    {this.state.location_name}
                    {this.state.location_name !== '' && 
                    <MdClose size={20} 
                        onClick={()=>{this.setState({location_name: '', location_id:''})}}
                        className="border border-solid border-slate-300 rounded-full 
                                            p-[5px] m-[5px] w-[25px] h-[25px] hover:bg-slate-200 duration-300 " >
                        </MdClose>
                    }   
                    
                </div>

                {
                    this.state.locationSelectorOpen &&
                    <LocationSelector parent={this}></LocationSelector>
                }
               
                <select id="body_type">
                    <option hidden value={''}>Kuzow görnüşi</option>
                    {this.state.bodyTypes.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>

                <select id="color">
                    <option hidden value={''}>Reňki</option>
                    {this.state.colors.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name}</option>
                    })}
                </select>

                <select id="fuel">
                    <option hidden value={''}>Ýangyjy</option>
                    {this.state.fuels.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <select id="transmission">
                    <option hidden value={''}>Transmissiýa (korobka)</option>
                    {this.state.transmissions.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <select id="wd">
                    <option hidden value={''}>Ýörediji görnüşi</option>
                    {this.state.wds.map(item=>{
                        return  <option id={item.id} value={item.id}>{item.name_tm}</option>
                    })}
                </select>

                <textarea id="body_tm"  placeholder="Giňişleýin maglumat..."></textarea>
                <input id="phone" className="phone" placeholder="Telefon belgisi"></input>
                
                <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                border-slate-200 rounded-md m-[5px] p-[5px]"
                    onClick={()=>{document.getElementById('swap').click()}}
                    >
                    <input className="w-[20px] h-[20px]" id="swap" type={'checkbox'}></input>
                    <label>Çalşyk</label>
                </div>
                <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                border-slate-200 rounded-md m-[5px] p-[5px]"
                    onClick={()=>{document.getElementById('credit').click()}}
                    >
                    <input className="w-[20px] h-[20px]" id="credit"  type={'checkbox'}></input>
                    <label>Kredit</label>
                </div>
                <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                border-slate-200 rounded-md m-[5px] p-[5px]"
                    onClick={()=>{document.getElementById('none_cash_pay').click()}}
                    >
                    <input className="w-[20px] h-[20px]" id="none_cash_pay"  type={'checkbox'}></input>
                    <label>Nagt däl töleg</label>
                </div>
                <div className="checkbox flex items-center border border-solid hover:bg-slate-200 duration-300 
                                border-slate-200 rounded-md m-[5px] p-[5px]"
                    onClick={()=>{document.getElementById('recolored').click()}}
                    >
                    <input className="w-[20px] h-[20px]" id="recolored"  type={'checkbox'}></input>
                    <label>Reňki üýtgedilen</label>
                </div>   
              
                <div className="images flex flex-wrap">
                    {
                        this.state.selected_images.map(item=>{
                        return  <div className="item relative">
                                <MdClose    
                                    className="cursor-pointer hover:shadow-lg hover:bg-slate-500 
                                            duration-300 absolute bg-red-600 rounded-[50%] p-[5px] 
                                            text-white shadow-md right-[5px] top-[5px]"
                                    onClick={()=>{this.removeImage(item)}} 
                                    size={35}>
                                </MdClose>

                                <img alt="" src={URL.createObjectURL(item)}></img>
                               
                             </div>                      
                        })
                    }
                </div>  

                <button 
                    className=" p-[5px] border border-solid border-slate-300 hover:bg-slate-500 
                                hover:text-white duration-300 m-[5px]" 
                    onClick={()=>{document.getElementById('imgselector').click()}}>
                    Saýlanan surat  {this.state.selected_images.length} sany
                </button>

                {this.state.isLoading === false &&
                    <button  
                        onClick={()=>{this.save()}} 
                        className="flex items-center p-[10px] w-max border shadow-md bg-sky-700 text-white 
                                duration-300 hover:bg-slate-500">
                            <BiSave size={25} className="mx-[5px]"></BiSave>
                            Ýatda sakla
                    </button>
                }
                
            </div> 

        </div>
    }
}

export default AddCar;