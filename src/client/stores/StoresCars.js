import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./storesDetail.css";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";

class StoreCars extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading:true,  
            items:[],
            id:'',
            

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
        
         
        axios.get(server + '/mob/cars?store='+id).then(resp=>{
            this.setState({ items: resp.data.data})
        })

            
    }


      
    setProductsPage(pageNumber){    
        this.setState({ isLoading: true})     
      
        axios.get(server + '/mob/cars?store='+ this.state.id +'&page='+ pageNumber+'&page_size='+ this.state.page_size).then(resp=>{
            this.setState({ products: resp.data.data})  
            this.setState({ isLoading: false})     
        })
    }   

    render(){
        return <div className="store_cars">    
            {/* <Pagination className="pagination" onChange={(event, page)=>{this.setProductsPage(page)}} 
                count={this.state.products_total_page} variant="outlined" shape="rounded" /> */}
            
            <div className="flex flex-wrap ">
                {this.state.items.map(item=>{
                    var img = server + item.img 
                    if(item.img.length === 0){
                        img = "/default.png";
                    }
                    return    <Link to={"/cars/"+item.id} 
                                    className="grid w-[150px] overflow-hidden rounded-md 
                                                shadow-md border m-[5px] h-max text-[14px]" 
                                    key={item.id}>
                                <img alt="" className="h-[150px] w-full object-cover" src={img}></img>
                                <div className="text grid p-[5px]">
                                    <label className="bold">{item.mark} {item.model} {item.year}</label>
                                    <label className="font-bold text-[15px] text-sky-600">{item.price }</label>
                                    <div className="text-slategrey flex items-center">
                                </div>
                                </div>
                            </Link>})}
            </div>
           
        </div>
    }
}

export default StoreCars;