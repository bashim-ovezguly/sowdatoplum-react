import axios from "axios";
import React from "react";
import { server } from "../static";
import { BiMap } from "react-icons/bi";

class Pharmacies extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,  
           
            stores:[],
            
            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            }
        }

        document.title = 'Dermanhanalar';
        this.setData()
    };

    setData(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const customer = urlParams.get('customer')
    
        // const pathname = window.location.pathname
        // const id = pathname.split('/')[2]
     
        axios.get(server + '/mob/stores?category=1&'+ urlParams).then(resp=>{
            this.setState({ stores: resp.data.data})                        
        })
    }
    

    render(){
        var default_img_url = '/default.png'
        return <div className="stores">

            <h3>Dermanhanalar - {this.state.stores.length} sany </h3>

            <div className="filter">
                <button>Giňişleýin gözleg</button>
                <button onClick={()=>{window.location.href ='/create/store'}}>Täze goşmak</button>
                <input className="search" type='search' placeholder="Ady boýunça gözleg..."></input>
            </div>

            <div className="ext_filter">
                {/* <select>
                    <option value={}></option>
                </select> */}
            </div>

           <div className="items">
                {
                    this.state.stores.map(item=>{
                        var img_url = server + item.img
                        if (item.img === ''){
                            img_url = default_img_url;
                        }

                        return <a href={'/stores/'+item.id} className="card">
                                <img src={ img_url}></img>
                                <div className="text">
                                    <label># {item.id}</label>
                                    <label>{item.name}</label>
                                    <label> <BiMap></BiMap> {item.location}</label>
                                </div>
                            </a>
                    })
                }
           </div>

        </div>
    }
}

export default Pharmacies;