import axios from "axios";
import React from "react";
import { server } from "../../static";
import "./verif.css";

class Verification extends React.Component{

    constructor(props){
        super(props);
       
        this.state = {
            isLoading:true,    
            products:[],
            user:[],
            phone:'',
            error: '',
            auth : {'auth':{
                'username' : localStorage.getItem('username'), 
                'password' : localStorage.getItem('password'),}
            }
        }

        document.title = 'Werifikasiýa';
        
    };

    resend(){

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get('phone')
        this.setState({phone : phone})
        var formData = new FormData()
        formData.append('phone', phone)       

        axios.post(server + '/mob/customers/send/code', formData).then(resp=>{
        });

    }

   

    confirm_click(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const phone = urlParams.get('phone')
        const next_page = urlParams.get('next')
   
        var code = document.getElementById('code').value
        var formData = new FormData()
        formData.append('code', code)
        formData.append('phone', phone)

        if(code == ''){
            this.setState({error: "Tassyklaýyş kodyny giriziň"})
        }
        
        axios.post(server + '/mob/verif', formData).then(resp=>{
                    
            if (resp.status == 200){
                localStorage.setItem('phone',resp.data.phone );
                localStorage.setItem('email',resp.data.email );
                localStorage.setItem('access_token',resp.data.access_token );
                localStorage.setItem('refresh_token',resp.data.refresh_token );
                localStorage.setItem('name',resp.data.name );
                localStorage.setItem('id',resp.data.id );
                localStorage.setItem('logged_in', true);
                
                if(next_page == 'restore'){
                    window.location.href = '/restore/password/'
                }
                else{
                    window.location.href = '/customer/'+ localStorage.getItem('id');
                }

                
            }
            else{
                this.setState({error:'Ýalňyşlyk ýüze çykdy'});
            }
         
        }).catch(err=>{

            if (err.response.data.error_code === 2){
                this.setState({error:'tassyklaýyş kody nädogry'});
            }

        })
    }

    time_tick(){
        
    }

    render(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get('email')

        let error_message = null;

        const phone = urlParams.get('phone')
        
        return <div>
            
            <div className="verif">
                <label>+993 {phone} belgä ugradylan SMS kody giriziň</label>
                <label className="email">{email}</label>
                <input id="code" maxLength={4} placeholder="Kod" min={1000} max={9999}></input>
                <button className="resend" onClick={()=>{this.resend()}}>Kody gaýtadan ugratmak</button>
                <label className="msg">{this.state.error}</label>
                <button className="confirm" onClick={()=>{this.confirm_click()}}>Tassyklamak</button>
                <a href="/login">Goý bolsun etmek</a>
           </div>

           <h3>{error_message}</h3>

        </div>
    }
}

export default Verification;
