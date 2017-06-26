/* eslint-disable */
import React, { Component } from 'react'
import QmSettingsStore from '../../stores/qmSettingsStore'
import Column from './Column.js';

class Graph extends Component {
    constructor (props) {
        super(props)
        this.state = {
            channels: QmSettingsStore.getChannels()
        }
    }
    
    render () {
        let i = -1;
        let linePointsX = [];
        let linePointsY = [];
        let topPathString = "M& 0";
        let bottomPathString = "M& 550";
        return (
           <g  id="graph">
                {Object.keys(this.state.channels).map((item) => {
                    let model = this.state.channels[item];
                    i++;
                    let shape = [];
                    Object.keys(model).map((it) =>{
                        shape.push(model[it].value);
                        
                 },this);
                    let x = this.getX(shape[1]);
                    let y = this.getY(shape[0]);
                    let width = this.getWidth(i);
                    if (i <= 7){
                        if (i === 0 ) 
                            topPathString = topPathString.replace("&", x);
                        topPathString += " L" + x + ", " + y + " L" +  (x + width-1) + ", " + y ;
                    }
                    else{
                        if( i === 8) 
                            bottomPathString = bottomPathString.replace("&", x);
                        bottomPathString += " L" + x + ", " + y + " L" +  (x + width-1) + ", " + y ;
                     };
                    console.log(bottomPathString);
                    return (
                        <Column key={item} x={x} height={y} color={'rgba(255,0,0,0.5)'} width={width}/>
                    )
                },this)}
                <g id="path">
                    <path d={topPathString} stroke="rgb(232,119,34)" fill="none" strokeWidth={2}/>
                    <path d={bottomPathString} stroke="rgb(232,119,34)" fill="none" strokeWidth={2}/>
                </g>
           </g>
        )
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.channels !== this.props.channels){
            this.setState({
                channels: nextProps.channels
            })
        }
    }

    shouldComponentUpdate(nextProps){
        return (this.props.channels !== nextProps.channels);
    }

    getY(a) {
        if (a===0)
            return 0;
        const numbers= [300, 200, 120, 100, 80, 60, 40, 20, 0, -20, -30];
        let i = 0;
        let number = 0;
        for (;i < numbers.length; i++) {
            if(numbers[i] <= a)
            break;
        }
        if(i>=1)
            number = ((a-numbers[i-1])/(numbers[i]-numbers[i-1]) *  (i*50 - (i-1)*50) + (i-1)*50);
        return Math.round(number);
    }

    getX(a){
        const numbers= [0, 10, 20, 30, 50, 80, 160, 320, 2000,10000];
        let i = 0;
        let number = 0;
        for(;i<numbers.length;i++){
            if (numbers[i] >= a)
                break;
        }
        if(i>=5)
            number = ((a - numbers[i-1]) / (numbers[i] - numbers[i-1]) *(i*70 -(i-1)*70)+(i-1)*70);
        else
            number =(a/numbers[i])*(i*70);
        return Math.round(number);
    }

    getWidth(e){
        let number = 0;
        let i = e + 1;
        let helpNum = -1;
        let actualItemValue;
        let helpArr = [];
        for (let key in this.state.channels) {
            helpArr = [];
            helpNum++;
            if(helpNum === e){
                let model = this.state.channels[key];
                Object.keys(model).map((item) => {
                    helpArr.push(model[item]);
                });
                actualItemValue = this.getX(helpArr[1].value);            
            }
             if (helpNum >= i && i < 8) {
                let model = this.state.channels[key];
                Object.keys(model).map((item) => {
                    helpArr.push(model[item]);
                });
                if (helpArr[1].value > 0) {
                    number = this.getX(helpArr[1].value);
                    break;
                }
            }
            else if (helpNum >= i && i > 8){
                let model = this.state.channels[key];
                Object.keys(model).map((item) => {
                    helpArr.push(model[item]);
                });
                if (helpArr[1].value > 0) {
                    number = this.getX(helpArr[1].value);
                    break;
                }
            }
        }
    return number === 0 ? (700 - actualItemValue) : ((number-actualItemValue)+ 1);
  }
}

export default Graph