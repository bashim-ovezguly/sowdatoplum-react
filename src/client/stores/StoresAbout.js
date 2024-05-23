import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./storesDetail.css";
import { MdCall } from "react-icons/md";

class StoreAbout extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,  
            list:[],     
            contacts:[],       

            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            }
        }

        this.setData()
      
    };

    setData(){
             
        const pathname = window.location.pathname
        const id = pathname.split('/')[2]
     
        axios.get(server + '/mob/stores/'+id).then(resp=>{

            this.setState({body_tm: resp.data.body_tm})
            document.title = resp.data.name_tm
            this.setState({contacts : resp.data.contacts})
         
        },(resp)=>{
           
        })            
    }
    
    render(){       
        return <div className="store_about p-10px">
                <p style={{whiteSpace:"pre-line"}} 
                     className="description text-grey text-15px"
                    >
                    {this.state.body_tm}
                </p>
                     
        </div>
    }
}

export default StoreAbout;