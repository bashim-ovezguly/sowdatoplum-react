import axios from "axios";
import React from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { BrowserRouter,  Routes, Route, Link } from 'react-router-dom';
import { server } from "../static";
import "./main.css";

class Rules extends React.Component{

    constructor(props){
        super(props);
       

        this.state = {
            isLoading:true,    
            products:[],
            user:[],
            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            }
        }

        document.title = 'Biz barada';
        
    };

    setData(){
        axios.get(server + '/products', this.state.auth).then(resp=>{
            this.setState({ products: resp.data, isLoading:false })
            
        })
    }
    

    render(){
        return <div className="about_us">
           <h2>Söwda toplumy</h2>
         
           <h4>Saýtyň düzgünleri:</h4>
           <p> - Ulanyjy tarapyndan ýerleşdirilen maglumatlar moderatorlar tarapyndan barlanýar</p>
           <p> - Maglumatlar barlagy üstünlikli geçeninden soňra saýtda peýda bolýar</p>
           <p> - Maglumatlaryň mukdary bellinelen çäkde ýerleşdirilýär</p>
           <p> - Ýerleşdirilýän maglumatlar Türkmenistanyň kanunçylygyna laýyk gelmeli</p>
           <p> - Ulanyjy ýerleşdiren maglumatyna jogap berýär</p>
           <p> - Ýazgylarda hapa-paýyş söz ulanmak gadagan</p>
        </div>
    }
}

export default Rules;