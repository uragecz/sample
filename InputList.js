/**
 * Created by urunzl on 20.10.2016.
 */
import React,{Component} from 'react';
import Input from './Input';
import ModalWin from '../ModalWindow/ModalWin';
import './InputList.css';

/* eslint-disable */

class InputList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        return ((this.props.list !== nextProps.list) || (this.state !== nextState) || (!this.arraysEqual(nextProps.header,this.props.header)))
    }

    render(){
        const{modal, list, type, multiple, header} = this.props;
        let counter = -1;
        let even = true;
        const passProps = Object.assign({}, this.props, {modal: true});
        return(
            <div className={this.props.modal? 'modalInputs-root': 'inputs-root'}>
                <div className={'inputs-container'} onClick={!modal ? this.handleClick.bind(this,true) : false}  >
                    <div className={ modal ? "inputList" : "inputList disable"} >
                        <table cellSpacing="0" className="table-list">
                            <thead>
                                <tr className="head-row">
                                    {header.map((item) =>{
                                        counter++;
                                        return(
                                            <th key={item + counter} className={"header-cell " + (counter === 0 ? "caption" : false)}>
                                                {item}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody >
                                {Object.keys(list).map((item) => {
                                    even = !even;
                                    let model = list[item];
                                    if(multiple){
                                        let values = [];
                                        let units = [];
                                        let itemId = [];
                                        Object.keys(model).map((item) => {
                                            values.push(model[item].value);
                                            units.push(model[item].unit);
                                            itemId.push(item);
                                        });
                                        return (
                                            <Input key={item} firstId={itemId[0]} secondId={itemId[1]} type={type} modal={modal} even={even} changeValue={this.changeValue.bind(this)} enable={model.enable}
                                                       name={item} value={values[0]} value1={values[1]} value2={values[2]}  unit1={units[0]} unit2={units[1]}/>
                                        )
                                    }
                                    return(
                                        <Input key={item} type={type} modal={modal} even={even} changeValue={this.changeValue.bind(this)}
                                                   name={item} value={model.value} unit1={model.unit} enable={model.enable}/>
                                    )
                                },this)}
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.clicked ?
                    <ModalWin save={this.saveValues.bind(this)} update={this.handleClick.bind(this)}>
                        <InputList {...passProps} />
                    </ModalWin>
                    : false
                }
            </div>
        )
    }

    cloneObject(obj) {
        let copy = {};
        if (null == obj || "object" != typeof obj) return obj;
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObject(obj[attr]);
        }
        return copy;
    }

    handleClick(){
        this.setState({
            clicked: !this.state.clicked
        })
    }

    arraysEqual(arr1, arr2){
        for(let i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }

    changeValue(name, value, enable, itemId) {   // return new object with new values
        let newStates = this.cloneObject(this.props.list);
        let model = newStates[name];
        model.enable = enable;
        if(value){
            if (this.props.multiple)
                model[itemId].value = value;
            else
                model.value = value;
        }
        this.props.changeValue(newStates);
    }

    saveValues(list){ 
        this.setState({
            clicked: !this.state.clicked,
        });
        if (list)
            this.props.save(list,this.props.name);
    }
}

export default InputList;