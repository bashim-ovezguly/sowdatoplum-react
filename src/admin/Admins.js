import axios from "axios";
import React from "react";
import { BiLeftArrow, BiMap, BiPlus, BiRightArrow } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { server } from "../static";
import "./admin.css";


class Admins extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading:true,    
            locations:[],
            all_locations:[],
            statuses:[],
            page_size:'',
            current_page:1,
            last_page:'',
            total:'',
            users:[],
            addOpen:false,
            
            
            auth : {auth:{
                'username' : localStorage.getItem('admin_username'), 
                'password' : localStorage.getItem('admin_password'),}
            }
        }

        document.title = 'Satyjylar';
        this.setData();
    };


    setData(){
        axios.get(server + '/api/admin/users/?page='+this.state.current_page, this.state.auth).then(resp=>{
             this.setState({ locations: resp.data.data, isLoading:false })
             this.setState({ last_page: resp.data['last_page'] })
             this.setState({ page_size: resp.data['page_size'] })
             this.setState({ total: resp.data['total'] })
             this.setState({ users: resp.data.data })
            
        })
      
    }

    saveNewAdmin(){
        var formdata = new FormData();
        
        this.setState({isLoading:true})
        this.setState({addOpen:false})
        
        formdata.append('username', document.getElementById('username').value)   
        formdata.append('password', document.getElementById('password').value)   
        formdata.append('first_name', document.getElementById('first_name').value)   
        formdata.append('is_active', true)   
        
        if(document.getElementById('is_superuser').checked==true){
            formdata.append('is_superuser', true)  
        }
        else{
            formdata.append('is_superuser', false)  
        }
        
        axios.post(server + '/api/admin/users/' , formdata, this.state.auth).then(resp=>{
            this.setData();
        }).catch(err=>{
            alert('Ýalňyşlyk ýüze çykdy')
        });

    }

    addModal(){

        if(this.state.addOpen===false){
            return null
        }

        return <div className="add modal">
            <div className="fields">
                <h3>Täze admin</h3>
                <input id="username" placeholder="Username"></input>
                <input id="password" type="password" placeholder="Password"></input>
                <input id="first_name" placeholder="Ady"></input>
                <div>
                    <input id="is_superuser" type="checkbox"></input>
                    <label>Superuser</label>
                </div>

            </div>

            <div>
                    <button onClick={()=>{this.saveNewAdmin()}}>Ýatda saklamak</button>
                    <button onClick={()=>{this.setState({addOpen:false})}}>Ýapmak</button>
                </div>
        </div>
    }


     
    render(){
       if(this.state.isLoading){
        return <h3>Ýüklenýär...</h3>
       }
        return <div className="admins">
          
            <h3>Adminler ({this.state.total} sany) </h3>
            <div className="managment">
                <button onClick={()=>{this.setState({addOpen:true})}}>Goşmak</button>
                <button onClick={()=>{
                    this.setState({isLoading:true})
                    this.setData()}} >Maglumatlary täzelemek</button>
               
            </div>

            {this.addModal()}
            
            <div className="pagination">
                <button onClick={()=>{this.prev_page()}}><BiLeftArrow></BiLeftArrow></button>
                <label>Sahypa {this.state.current_page}/{this.state.last_page} </label>
                <button onClick={()=>{this.next_page()}}><BiRightArrow></BiRightArrow></button>
            </div>

            <div className="cards">
                {
                    this.state.users.map((item,index)=>{
                                         
                        return <a href={'/admin/admins/'+item.id} key={item.id} className="card">
                            {item.img_m == null ? <img src="/default.png"></img> : <img src={item.img_m}></img>}
                            
                            <div className="text">
                                <label className="name">{item.username} </label>
                                <label>{item.phone}</label>
                                {item.is_active == true? <label className="status accepted">Aktiw</label> :
                                                    <label className="status pending">Passiw</label> }

                                {item.is_superuser ? <label>Admin</label> : <label>Moderator</label>}
                                {item.last_login}
                            </div>
                            
                           
                        </a>
                    })
                }

            </div>

           

        </div>
            
    }
}

export default Admins;