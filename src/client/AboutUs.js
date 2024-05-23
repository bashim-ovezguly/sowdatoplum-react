import axios from "axios";
import React from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { BrowserRouter,  Routes, Route, Link } from 'react-router-dom';
import { server } from "../static";
import "./main.css";

class AboutUs extends React.Component{

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
           <p>Söwda toplumy - saýtyň esasy maksady önüm öndürijileriň işini ýeňleşdirmek we söwdasyny galdyrmaga kömek etmekdir.</p>
           <h4>Saýtyň mümkinçilikleri:</h4>
           <p> - Önüm öndürijileriň katalogyndan peýdalanmak</p>
           <p> - Harytlary sargyt etmek </p>
           <p> - Hasap açmak</p>
           <p> - Açar sözüni dikeltmek</p>
           <p> - Söwda nokadyny açmak</p>
           <p> - Harytlary suratlary we beýleki maglumatlary bilen söwda nokadyna ýerleşdirmek</p>
           <p> - Harytlary filterler arkaly gözlemek</p>
           <p> - Dolandyryş çäk birlikleri easynda harytlary, söwda nokatlary, hyzmatlary we beýleki harytlary gözlemek</p>
           <p> - Satlyk awtoulaglary, awtoşaýlary, hyzmatlary, gurluşyk harytlary we beýleki harytlary görmek</p>
           <p> - Türkmenistanda ýerleşýän bazarlar we söwda nokatlary barada maglumat almak</p>
        </div>
    }
}

export default AboutUs;