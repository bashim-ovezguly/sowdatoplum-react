import axios from "axios";
import React from "react";
import { BiLeftArrow, BiMap, BiPlus, BiRightArrow } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { server } from "../static";
import "./admin.css";


class AdminDetail extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading:true,    
            
            auth : {auth:{
                'username' : localStorage.getItem('admin_username'), 
                'password' : localStorage.getItem('admin_password'),}
            }
        }

        document.title = 'Moderatorlar';
        this.setData();
    };

    next_page(){
        if(this.state.last_page >= this.state.current_page + 1 ){
            var next_page_number= this.state.current_page + 1
            this.setState({current_page: next_page_number }, ()=>{
                this.setData()
            })
            
        }
       
        
    }
    prev_page(){
        if(this.state.current_page-1 != 0){
            this.setState({current_page: this.state.current_page-1 }, ()=>{
                this.setData()
            })
            
        }
       
        
    }

    setData(){
        
        const pathname = window.location.pathname
        const id = pathname.split('/')[3]

        axios.get(server + '/api/admin/users/' + id, this.state.auth).then(resp=>{
             this.setState({ name: resp.data.first_name })
             this.setState({ username: resp.data.username })
             this.setState({ id: resp.data.id })
             this.setState({ last_login: resp.data.last_login })
             this.setState({ is_superuser: resp.data.is_superuser })
             this.setState({ email: resp.data.email })
             this.setState({ is_active: resp.data.is_active })
            
        })
      
    }


    filter_modal(){

        if(this.state.filterOpen == false){
            return null
        }

        return <div className="filter">
            <h3>Filter </h3>
             <div className="name-field-form">
                <input id="id" hidden></input>
                <label>Ady</label>
                <input id="edit_name" type='search'></input>

                <label>Statusy</label>
                <select id="status">
                    <option></option>
                    {
                        this.state.statuses.map(item=>{
                            return <option value={item.id}> {item.name}</option>
                        })
                    }
                </select>

                <label>Tertip belgisi</label>
                <input id="sort_order" type='number' placeholder="Tertip belgisi"></input>
                <label>Degişli ýeri</label>

                <select id="parent">
                    {this.state.all_locations.map(item=>{
                            let statusName = ''
                            if(item.status.name != undefined){
                                statusName = item.status.name
                            }
                            return <option value={item.id}> {item.name_tm + ' ' + statusName}</option>
                        })}
                </select>

                <label></label>
                <div><input id="edit_active" type='checkbox'></input>
                    <label>Aktiw</label>
                </div>
            </div>
            <button className="save" onClick={()=>{this.edit()}}>Filter et</button>
        </div>
    }
   

    edit(){
        var fdata = new FormData()
        fdata.append('name_tm',   document.getElementById('edit_name').value)
        fdata.append('parent',   document.getElementById('parent').value)
        fdata.append('status',   document.getElementById('status').value)
        fdata.append('sort_order',   document.getElementById('sort_order').value)
        fdata.append('active',   document.getElementById('active').value)
        var id = document.getElementById('id').value

        axios.put(server + '/api/admin/locations/'+id+'/', fdata, this.state.auth).then(resp=>{
          alert('Ýatda saklandy');
          this.setData()
          this.close_edit_modal();
        });
    }

   
    save(){
        this.setState({isLoading:true})
        var fdata = new FormData()
        fdata.append('username',   document.getElementById('username').value)

        if(document.getElementById('password').value.length !=''){
            fdata.append('password',   document.getElementById('password').value)
        }
        
        fdata.append('email',   document.getElementById('email').value)
        fdata.append('first_name',   document.getElementById('name').value)
        
        if(document.getElementById('active').checked == true){
            fdata.append('is_active', true)
        }
        else{
            fdata.append('is_active', false)
        }

        axios.put(server + '/api/admin/users/'+this.state.id+'/', fdata, this.state.auth).then(resp=>{
          this.setData()
          window.history.back()
        }).catch(err=>{
            alert('error')
        });
    }


    delete(id){
        var result = window.confirm('Bozmaga ynamyňyz barmy?');

        if(result==true){
            axios.delete(server + '/api/admin/users/'+id+'/',  this.state.auth).then(resp=>{
                window.history.back();
                
              }).catch(err=>{
                alert('error')
              });
        }
    }

    newModeratorModal(){
        if(this.state.newModeratorModalOpen==false){
            return null
        }

        return <div className="new-moderator modal">
            <div className="fields">
                <h3>Täze moderator</h3>
                <input id="new_mod_username" placeholder="Ulanyjy ady"></input>
                <input id="new_mod_password" placeholder="Açar sözi"></input>
                <input id="new_mod_first_name" placeholder="Ady"></input>    
                <div>
                    <button onClick={()=>{this.saveNewModerator()}}> Ýatda saklamak</button>
                    <button onClick={()=>{this.setState({newModeratorModalOpen:false})}}>Ýapmak</button>
                </div>
            </div>
            
        </div>
    }
   
    render(){
       
        return <div className="customers_detail">
          
            
            <div className="fields">
                <h3>{this.state.username} </h3>
                <div>
                    {
                        this.state.is_active==true? <input id="active" defaultChecked type="checkbox"></input> :
                                                <input id="active" type="checkbox"></input> 
                    }
                <label>Aktiw</label>
                </div>
                <input id="name" defaultValue={this.state.name} placeholder="Ady"></input>
                <input id="username" defaultValue={this.state.username} placeholder="Username"></input>
                <input id="password"  placeholder="Password"></input>
                <input id="email" defaultValue={this.state.email}  placeholder="email"></input>

                <div>
                    <button onClick={()=>{this.save()}}>Ýatda saklamak</button>
                    <button onClick={()=>{this.delete(this.state.id)}}>Bozmak</button>

                </div>

            </div>

           

        </div>
            
    }
}

export default AdminDetail;