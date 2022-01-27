import React, {Component} from 'react';
import {render} from 'react-dom';
import css from './style.css'


class App extends Component {
    render(){
        function log (input){
            fetch('/server',{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({'id': input})    
            })
            // .then((data) => data.json())
            // .then((data) => /* populate the table with incoming data */ console.log(data))
            
        }

        let options = []
        
        function list (num){
            for(let i = 1 ; i <= num ; i++){
              options.push(<option class='number' value={i} >{i * 5 + ','+ 0+0+0 + ' miles'}</option>)  
              console.log(i)
            }
        }

        list(10)
        
        return (
            <>
                <h1>Car Service Interval</h1>

                <div id='container'>
                    
                    <div id='question'>
                   
                    <select name='miles' id='miles' required>
                    <option disabled selected hidden>Current Mileage</option>
                    {options}
                    </select> 
                    <button id='submit' value='submit' onClick={()=>{ log(document.getElementById('miles').value)}}>Submit</button>
                   
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
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='tir'>Tire Rotation</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='bra'>Brake Fluid</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='dif'>Differential Fluid</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='tra'>Transmisson Fluid</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='coo'>Coolant</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='air'>Air Filter</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>  
                    <tr>
                        <td id='cab'>Cabin Filter</td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
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