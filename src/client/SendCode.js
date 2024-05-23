import axios from "axios";
import React from "react";
import { server } from "../static";

class SendCode extends React.Component{

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

        document.title = 'Açar sözi dikeltmek';
        
    };

   

    sendCode(){
        
        let phone  = document.getElementById('phone_number').value

        if(phone.length == 0){
            alert('Telefon belgini hölman girizmeli');
            return null;
        }

        if(phone.length != 8){
            alert('Telefon belgi 8 belgiden ybarat bolmaly');
            return null;
        }

        var formData = new FormData()     
        formData.append('phone', document.getElementById('phone_number').value )
        
        axios.post(server + '/mob/customers/send/code', formData).then(resp=>{
                     
            if (resp.status == 200){
                window.location.href = '/verification?next=restore&phone='+phone;
            }
            else{
                this.setState({error:'Ýalňyşlyk ýüze çykdy'});

            }
         
        })
    }

    render(){
       
        return <div className="m-[10px] shadow-md text-slate-700 max-w-[400px] justify-self-center mx-auto border mt-[5%]
                        p-[20px] text-center rounded-md text-[14px] grid">
            <label className="text-[18px] font-bold">Açar sözüni dikeldiş</label>
                <label  >Açar sözüni dikeltmek üçin telefon belgiňizi giriziň. Görkezilen belgä SMS kody ugradylar</label >
                
                <div className="phone">               
                    <label>+993</label><input id="phone_number" type="number" placeholder="6x xxxxxx"></input>
                </div>
                <button className="bg-sky-700 text-white p-[5px]" onClick={()=>{this.sendCode()}}>Tassyklaýyş kody ugratmak</button>    
        </div>
    }
}

export default SendCode;
