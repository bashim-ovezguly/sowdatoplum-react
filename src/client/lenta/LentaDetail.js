import axios from "axios";
import React from "react";
import { FiEye } from "react-icons/fi";
import { server } from "../../static";
import "./lenta.css";
import { BiCalendar } from "react-icons/bi";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";


class LentaDetail extends React.Component{

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
            }
        }

        document.title = 'Lenta';
        this.setData()
    };


    setPage(pageNumber){    
      
        axios.get(server + '/mob/lenta?page='+pageNumber).then(resp=>{
            this.setState({ datalist: resp.data.data})  
        })
    }   

    setData(){
        const pathname = window.location.pathname
        const id = pathname.split('/')[2]
     
        axios.get(server + '/mob/lenta/'+id).then(resp=>{
            this.setState({ lenta: resp.data})    
            this.setState({ customer_photo: resp.data.data.customer_photo})    
            this.setState({ customer: resp.data.data.customer})    
            this.setState({ images: resp.data.data.images})    
            this.setState({ view: resp.data.data.view})    
            this.setState({ text: resp.data.data.text})    
            this.setState({ created_at: resp.data.data.created_at})    
            this.setState({ customer_id: resp.data.data.customer_id})    
        })
    }
    

    render(){
      
        return <div className="lenta_detail p-10px">

                <Link to={'/customers/' + this.state.customer_id } className="customer m-10px"> 
                    {this.state.customer_photo !== '/media/' && <img alt="" src={server+this.state.customer_photo}></img> }
                    {this.state.customer_photo === '/media/' && <img alt="" src={'/default.png   '}></img> }
                    <label>{this.state.customer}</label>
                </Link>
               
                <Carousel  emulateTouch={true}  
                            autoFocus={true}
                            infiniteLoop={true} 
                            showThumbs={false} 
                            showStatus={false}    
                            showIndicators={true}     
                            transitionTime={200}
                            showArrows={true}
                            className="carousel">
                    {this.state.images.map(item=>{
                        return <div className="item">
                            <img src={server + item.img}></img>
                        </div>
                    })}

                </Carousel>

                <p>{this.state.text}</p>
                 
                <div className="view">
                    <FiEye></FiEye><label>{this.state.view}</label>
                    <BiCalendar></BiCalendar><label>{this.state.created_at}</label>
                </div>
                
            </div>  
          
    }
}

export default LentaDetail;