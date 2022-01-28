import React, {Component} from 'react';
import {render} from 'react-dom';
import css from './style.css'


class App extends Component {
    constructor(){
        super()
        this.state = {
            eng: [],
            tir: [],
            bra: [],
            tra: [],
            coo: [],
            air: [],
            cab: [],
            dif: [],
        };
        this.log = this.log.bind(this);
    }

     log (input){
        fetch('/server',{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({'id': input})    
        })
        .then((res) => res.json())
        .then((data) => {
            
            this.setState(data[0]);
           
        })
        
    }
     
    render(){
        
        const options = [];
        function list (num){
            for(let i = 1 ; i <= num ; i++){
              options.push(<option class='number' value={i} >{i * 5 + ','+ 0+0+0 + ' miles'}</option>)  
              
            }
        }

        list(10)
        
        return (
            <>
                <h1>Car Service Interval</h1>

                <div id='container'>
                    
                    <div id='question'>
                   
                    <select name='miles' id='miles' required>
                    <option disabled selected hidden>Approx. Mileage</option>
                    {options}
                    </select> 
                    <button id='submit' value='submit' onClick={()=>{ this.log(document.getElementById('miles').value)}}>Submit</button>
                   
                </div>

                <div id='table'>
                
                    <table>
                    <th>Type of Service</th>
                    <th>Gasoline</th>
                    <th>Electric Vehicles</th>
                    <th>Hybrids</th>

                    <tbody>
                    <tr>
                        <td id='eng'>Engine Oil</td>
                        <td>{this.state.eng[0] ? String(this.state.eng[0]) : null}</td>
                        <td>{this.state.eng[1] ? String(this.state.eng[1]) : null}</td>
                        <td>{this.state.eng[2] ? String(this.state.eng[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='tir'>Tire Rotation</td>
                        <td>{this.state.tir[0] ? String(this.state.tir[0]) : null}</td>
                        <td>{this.state.tir[1] ? String(this.state.tir[1]) : null}</td>
                        <td>{this.state.tir[2] ? String(this.state.tir[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='bra'>Brake Fluid</td>
                        <td>{this.state.bra[0] ? String(this.state.bra[0]) : null}</td>
                        <td>{this.state.bra[1] ? String(this.state.bra[1]) : null}</td>
                        <td>{this.state.bra[2] ? String(this.state.bra[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='dif'>Differential Fluid</td>
                        <td>{this.state.dif[0] ? String(this.state.dif[0]) : null}</td>
                        <td>{this.state.dif[1] ? String(this.state.dif[1]) : null}</td>
                        <td>{this.state.dif[2] ? String(this.state.dif[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='tra'>Transmisson Fluid</td>
                        <td>{this.state.tra[0] ? String(this.state.tra[0]) : null}</td>
                        <td>{this.state.tra[1] ? String(this.state.tra[1]) : null}</td>
                        <td>{this.state.tra[2] ? String(this.state.tra[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='coo'>Coolant</td>
                        <td>{this.state.coo[0] ? String(this.state.coo[0]) : null}</td>
                        <td>{this.state.coo[1] ? String(this.state.coo[1]) : null}</td>
                        <td>{this.state.coo[2] ? String(this.state.coo[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='air'>Air Filter</td>
                        <td>{this.state.air[0] ? String(this.state.air[0]) : null}</td>
                        <td>{this.state.air[1] ? String(this.state.air[1]) : null}</td>
                        <td>{this.state.air[2] ? String(this.state.air[2]) : null}</td>
                    </tr>  
                    <tr>
                        <td id='cab'>Cabin Filter</td>
                        <td>{this.state.cab[0] ? String(this.state.cab[1]) : null}</td>
                        <td>{this.state.cab[1] ? String(this.state.cab[1]) : null}</td>
                        <td>{this.state.cab[2] ? String(this.state.cab[2]) : null}</td>
                    </tr>  
                    
                    </tbody>
                </table>
                </div>
                </div>
            </>
        )
    }
}
render(<App/>, document.querySelector('#main-app'));