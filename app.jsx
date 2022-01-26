import React, {Component} from 'react';
import {render} from 'react-dom';
import css from './style.css'


class App extends Component {
    render(){
        let options = []
        function list (num){
            for(let i = 1 ; i <= num ; i++){
              options.push(<option class='numbers' id={i}>{i * 5000}</option>)  
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

                <div>

                </div>
            </>
        )
    }
}
render(<App/>, document.querySelector('#main-app'));