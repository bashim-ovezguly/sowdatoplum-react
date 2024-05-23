import axios from "axios";
import React from "react";
import { BiFilter, BiLeftArrow, BiPlus, BiRefresh, BiRightArrow, BiSleepy } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { server } from "../static";
import "./admin.css";
import "./locations.css";
import LocationSelector from "./LocationSelector";


class Locations extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading:true,    
            locations:[],
            all_locations:[],
            statuses:[],
            page_size:'',
            current_page: 1,
            last_page:'',
            total:'',
            isSearching:false,
            url_params:[],

            filterOpen:false,
            newLocationOpen: false,
            editModalOpen: false,

            locationSelectorOpen:false,
            location_name:'',
            location_id:'',
            
            auth : {'auth':{
                'username' : localStorage.getItem('admin_username'), 
                'password' : localStorage.getItem('admin_password'),}
            }
        }

        document.title = 'Dolandyryş çäk birlikleri';
       
    };
    componentDidMount(){
        this.setData();
      
    }

  
    set_page(){
       
        if(Number(this.state.last_page) >= Number(document.getElementById('setPageNumber').value)){
            
            this.setState({current_page: document.getElementById('setPageNumber').value }, ()=>{
                this.setData();
            });        
        }
        
    }

    next_page(){
        if(this.state.last_page >= this.state.current_page + 1 ){
            var next_page_number= this.state.current_page + 1
            this.setState({current_page: next_page_number }, ()=>{
                this.setData();
              
            })
            
        }
    }
    
    prev_page(){
        if(this.state.current_page-1 != 0){
            this.setState({current_page: this.state.current_page-1 }, ()=>{
                this.setData();
            })
            
        }
       
        
    }

    setData(){
        this.setState({  isLoading:true })
                       
        axios.get(server + '/api/admin/locations/?page='+this.state.current_page, {params:this.state.url_params, auth:this.state.auth.auth} ).then(resp=>{
             this.setState({ locations: resp.data.data})
             this.setState({ last_page: resp.data['last_page'] })
             this.setState({ page_size: resp.data['page_size'] })
             this.setState({ total: resp.data['total'] })
             this.setState({ isLoading: false })
        })

        axios.get(server + '/mob/index/locations/all').then(resp=>{
            this.setState({ all_locations: resp.data })
            setTimeout(() => {
                this.setState({ isLoading: false })
             }, 500);
       })

        axios.get(server + '/api/admin/location_status/', this.state.auth).then(resp=>{
            this.setState({ statuses: resp.data.data})
            setTimeout(() => {
                this.setState({ isLoading: false })
             }, 500);
       })
    }

  
    open_filter_modal(){
        this.setState({filterOpen:true})
    }

    close_filter_modal(){
        this.setState({filterOpen:false}) 
    }


    filter_modal(){
        if(this.state.filterOpen==false){
            return null
        }
        return <div className="filter modal">
            <MdClose onClick={()=>{this.close_filter_modal()}} className="close-icon" size={25}></MdClose>
            <h3>Filter </h3>
             <div className="name-field-form">
                <input id="id" hidden></input>
                <label>Ady</label>
                <input id="filter_name" type='search'></input>

               

                <label>Tertip belgisi</label>
                <input id="filter_sort_order" type='number' placeholder="Tertip belgisi"></input>
             
             
                <label></label>
                <div><input id="filter_active" type='checkbox'></input>
                    <label>Aktiw</label>
                </div>

            </div>
            <button className="clear-filter" onClick={()=>{this.clear_filter_params()}}>Filtri arassala</button>
            <button className="save" onClick={()=>{this.filter()}}>Filter et</button>
        </div>
    }
   
    
    edit_modal(){  
        if(this.state.editModalOpen==false){
            return null
        }  
        return <div className="edit modal">
            <MdClose onClick={()=>{this.close_edit_modal()}} className="close-icon" size={25}></MdClose>
            <h3>Düzetmek </h3>
             <div className="name-field-form">
                <input id="edit_id" hidden></input>
                <label>Ady</label>
                <input id="edit_name" ></input>

                <label>Statusy</label>
                <select id="edit_status">
                    <option></option>
                    {
                        this.state.statuses.map(item=>{
                            return <option value={item.id}> {item.name}</option>
                        })
                    }
                </select>

                <label>Tertip belgisi</label>
                <input id="edit_sort_order" type='number' placeholder="Tertip belgisi"></input>
                <label>Degişli ýeri</label>

                <select id="edit_parent">
                    <option></option>
                    
                    {this.state.all_locations.map(item=>{
                            return <option value={item.id}> {item.name_tm}</option>
                        })}
                </select>

                <label></label>
                <div><input id="edit_active" type='checkbox'></input>
                    <label>Aktiw</label>
                </div>
            </div>
            <button className="save" onClick={()=>{this.edit()}}>Ýatda sakla</button>
        </div>
    }

    close_create_modal(){
        this.setState({newLocationOpen:false})
    }

    open_create_modal(){
        this.setState({newLocationOpen:true})
    }

    close_edit_modal(){
        this.setState({editModalOpen:false})
    }

    open_edit_modal(instance){
        console.log(instance)
        this.setState({editModalOpen:true}, ()=>{
            document.getElementById('edit_name').value = instance.name_tm  
            document.getElementById('edit_parent').value = instance.parent.id 
            document.getElementById('edit_status').value = instance.status.id  
            document.getElementById('edit_sort_order').value = instance.sort_order  
            document.getElementById('edit_id').value = instance.id  
            document.getElementById('edit_active').checked = instance.active  
        })
       
        
    }

    add_modal(){
        if(this.state.newLocationOpen==false){
            return null
        }
        return <div className="add_location modal">
            <MdClose onClick={()=>{this.close_create_modal()}} className="close-icon" size={25}></MdClose>
            <h3>Täze goşmak </h3>
             
                {this.state.locationSelectorOpen && <LocationSelector parent={this}></LocationSelector> }    
             
             <div className="fields">
                <label>Ady</label>
                <input id="name" type='search' placeholder="Ady"></input>

                <label>Statusy</label>
                <select id="status">
                    <option> </option>
                    {
                        this.state.statuses.map(item=>{
                            return <option value={item.id}> {item.name}</option>
                        })
                    }
                </select>

                <label>Tertip belgisi</label>
                <input id="sort_order" type='number' placeholder="Tertip belgisi"></input>

                <button onClick={()=>{this.setState({locationSelectorOpen:true})}}>
                    <label>Degişli ýeri - </label>
                   
                </button>

                <label></label>
                <div>
                    <input id="active" type='checkbox'></input>
                    <label>Aktiw</label>
                </div>
                
            </div>
            <button  onClick={()=>{this.create()}}>Goşmak</button>
        </div>
    }

    edit(){
        let active=false
        if(document.getElementById('edit_active').checked == true){
            active = true
        }
        
        var fdata = new FormData()
        fdata.append('name_tm',   document.getElementById('edit_name').value)
        fdata.append('parent',   document.getElementById('edit_parent').value)
        fdata.append('status',   document.getElementById('edit_status').value)
        fdata.append('sort_order',   document.getElementById('edit_sort_order').value)
        fdata.append('active',   active)
        var id = document.getElementById('edit_id').value
        
        axios.put(server + '/api/admin/locations/'+id+'/', fdata, this.state.auth).then(resp=>{
          this.setData()
          this.close_edit_modal();
        });
    }

    create(){
        var fdata = new FormData()
        if(document.getElementById('name').value.length == 0){
            alert('Adyny hökman girizmeli!');
            return null;
        }

        fdata.append('name_tm',   document.getElementById('name').value)
        fdata.append('parent',   this.state.location_id)
        fdata.append('status',   document.getElementById('status').value)
        fdata.append('sort_order',   document.getElementById('sort_order').value)
        fdata.append('active',   document.getElementById('active').value)

        axios.post(server + '/api/admin/locations/create', fdata, this.state.auth).then(resp=>{
          this.setData();
        });

    }

    filter(){
        let active='';
        if(document.getElementById('filter_active').checked == true){
            active='1';
        }
      
        let params={
            'name':document.getElementById('filter_name').value,
            'parent':document.getElementById('filter_parent').value,
            'status':document.getElementById('filter_status').value,
            'sort_order':document.getElementById('filter_sort_order').value,
            'active': active,
        };
        
        this.setState({url_params : params, current_page:1}, ()=>{
            this.setData()
        })
    }

    clear_filter_params(){
        this.setState({url_params:null}, ()=>{
            this.close_filter_modal();
            this.setData();
        })

    }

    delete(item){
        let id = item.id
        var result = window.confirm( item.name_tm + ' - bozmaga ynamyňyz barmy?');

        if(result==true){
            axios.post(server + '/api/admin/locations/delete/'+id ,{}, this.state.auth).then(resp=>{
                this.setData()
              });
        }

    }

    downloadingProgresBar(){
        if(this.state.isLoading == true){
            return <div className="downloading">
            <h3>Maglumat ýüklenýär</h3>
        </div>
        }
        else{
            return null
        }
      
    }

    search_by_name(){    
        let params={
            'name': document.getElementById('search_by_name').value,
        };
        
        this.setState({url_params : params, current_page:1}, ()=>{
            this.setData()
        })

    }
   
    render(){
       
        return <div className="locations">
          
            <h3>Dolandyryş çäk birlikler ({this.state.total} sany) </h3>

            <div className="control_panel">
                <button onClick={()=>{this.open_create_modal()}} className="add">
                    <BiPlus size={20}></BiPlus>
                    Goşmak</button>

                <button onClick={()=>{this.setData()}} className="add">
                    <BiRefresh size={20}></BiRefresh>
                    Maglumatlary täzelemek</button>

                <button onClick={()=>{this.open_filter_modal()}} className="add">
                    <BiFilter size={20}></BiFilter>
                    Filter</button>
            
                <select>
                    <option value={1}>Asyl tertipde</option>
                    <option value={2}>Tertibi boýunça - kiçiden ula</option>
                    <option value={3}>Tertibi boýunça - uludan kiçä</option>
                    <option value={4}>Ady boýunça A-Z</option>
                    <option value={5}>Ady boýunça Z-A</option>
                </select>
                
                <div>
                    <label>Statusy</label>
                    <select id="filter_status">
                        <option></option>
                        {
                            this.state.statuses.map(item=>{
                                return <option value={item.id}> {item.name}</option>
                            })
                        }
                    </select>
                </div>

               
                <input id="search_by_name" onChange={()=>{this.search_by_name()}} type={'search'} placeholder="Ady boýunça gözleg"></input>

            </div>
           
                  
            {this.add_modal()}
            {this.edit_modal()}
            {this.filter_modal()}
           
            <div className="pagination">
                <button onClick={()=>{this.prev_page()}}><BiLeftArrow></BiLeftArrow></button>
                <label>Sahypa {this.state.current_page}/{this.state.last_page} </label>
                <button onClick={()=>{this.next_page()}}><BiRightArrow></BiRightArrow></button>
                <div className="setPage">
                    <input id="setPageNumber" min={1} defaultValue={1} type={'number'}></input>
                    <button onClick={()=>{this.set_page()}}>Sahypa geç</button>
                </div>
            </div>
           
            {this.downloadingProgresBar()}

            <table>
                <tbody>
                    <tr>
                        <th>Ady</th>
                        <th>Degişli çägi</th>
                        <th>Aktiw</th>
                        <th>Tertibi</th>
                        <th></th>
                    </tr>

                    {
                        this.state.locations.map((item,index)=>{
                            let parentStatus = ''
                            let active = ''
                            if(item.parent.status != undefined){
                                parentStatus = item.parent.status.name
                            }
                            if(item.active == true){
                                active = 'Aktiw'
                            }
                            else{
                                active='Aktiw däl'
                            }

                            return <tr>
                                <td>{item.name_tm} {item.status.name}</td>
                                <td>{item.parent.name } {parentStatus}</td>
                                <td>{active}</td>
                                <td>{item.sort_order}</td>
                                <td>
                                    <button onClick={()=>{this.delete(item)}}>Bozmak</button>
                                    <button onClick={()=>{this.open_edit_modal(item)}}>Düzetmek</button>
                                </td>
                            </tr>
                        })
                    }
                    
                </tbody>
            </table>

           

        </div>
            
    }
}

export default Locations;