import React, {Component} from 'react';
import {render} from 'react-dom';
import css from './style.css'


class App extends Component {
    render(){

        let options = []
        
        function list (num){
            for(let i = 1 ; i <= num ; i++){
              options.push(<option class='numbers' id={i}>{i * 5 + ','+ 0+0+0 + ' miles'}</option>)  
            }
        }

        list(15)
        
        return (
            <>
                <h1> Welcome to Car Service Interval</h1>
                
                    <div id='question'>
                
                <h2>What's the approximate mileage on your car?</h2>
                
                    <select id='miles' required>
                    <option value='' disabled selected hidden>Current mileage</option>
                    {options}
                    </select> 
                    <button id='submit'>Submit</button>
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
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='tir'>Tire Rotation</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='bra'>Brake Fluid</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='dif'>Differential Fluid</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='tra'>Transmisson Fluid</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='coo'>Coolant</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='air'>Air Filter</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    <tr>
                        <td id='cab'>Cabin Filter</td>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                    </tr>  
                    
                    </tbody>
                </table>
                </div>
            </>
        )
    }
}
render(<App/>, document.querySelector('#main-app'));