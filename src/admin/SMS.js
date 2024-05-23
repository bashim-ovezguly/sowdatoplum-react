import axios from "axios";
import React from "react";
import { BiLeftArrow, BiMap, BiPlus, BiRightArrow } from "react-icons/bi";
import { MdClose, MdDelete, MdFilter, MdPerson, MdRefresh } from "react-icons/md";
import { server } from "../static";
import "./stores.css";


class SMS extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading:true,    
            locations:[],
            all_locations:[],
            
            page_size:'',
            current_page:1,
            last_page:'',
            total:'',
            iplist:[],
            urlParams:[],
            filterOpen:false,
            newStoreOpen:false,

            
            auth : {auth:{
                'username' : localStorage.getItem('admin_username'), 
                'password' : localStorage.getItem('admin_password'),}
            }
        }

        document.title = 'Myhmanlar';
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
     
        axios.get(server + '/api/admin/visitors/?page='+this.state.current_page, this.state.auth).then(resp=>{
             this.setState({ last_page: resp.data['last_page'] })
             this.setState({ page_size: resp.data['page_size'] })
             this.setState({ total: resp.data['total'] })
             this.setState({ iplist: resp.data.data })
             this.setState({isLoading:false});
            
        })
    }

    deleteItem(id){
        if(window.confirm('Bozmaga ynamynyz barmy?').result==false){
            return null
        }
        axios.delete(server + '/api/admin/visitors/' + id, this.state.auth).then(resp=>{
            this.setData()
       })
    }
   
    render(){


       
        return <div className="sms">
                  
                     


            <table>
                <tr>
                    <th>IP</th>
                    <th>device_id</th>
                    <th>App version</th>
                    
                    <th>TIME</th>
                    <th>REQUEST TYPE</th>
                    <th>Browser</th>
                    <th>OS</th>
                    <th>REQUEST URL</th>
                    <th>QUERY STRING</th>
                    <th></th>
                </tr>
                {
                    this.state.iplist.map(item=>{
                        return <tr>
                            <td>{item.ip}</td>
                            <td>{item.device_id}</td>
                            <td>{item.app_version}</td>
                            <td>{item.created_at}</td>
                            <td>{item.request_method}</td>
                            <td>{item.browser}</td>
                            <td>{item.os}</td>
                            <td>{item.request_url}</td>
                            <td>{item.query_string}</td>
                            <td><MdDelete onClick={()=>{this.deleteItem(item.id)}}></MdDelete></td>
                        </tr>
                    })
                }

            </table>


           

        </div>
            
    }
}

export default SMS;