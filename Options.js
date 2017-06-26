import React,{Component} from 'react';
import NumpadModal from '../ModalWindow/NumpadModal';
import ListModal from '../ModalWindow/ListModal';
import selectionStore from '../../stores/selectionStore';
import selectionActions from '../../actions/selectionActions';
import Option from './Option';

//styles and images
import './Options.css';

class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: parseInt(selectionStore.getUnit(), 10),
            group: selectionStore.getGroup(),
            shift: selectionStore.getShift(),
            step: selectionStore.getUnitStep(),
            minUnit: selectionStore.getMinUnit(),
            maxUnit: selectionStore.getMaxUnit(),
            shiftList: selectionStore.getShiftList(),
            groupList: selectionStore.getGroupList(),
            activeItem: selectionStore.getActiveItem(),
            showList: false,
            showOption: false,
            activeShift: selectionStore.isShiftActive(),
            openItem: null
        };
        this.handleOpenList = this.handleOpenList.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.changeActiveOption = this.changeActiveOption.bind(this);
        this.update = this.update.bind(this);
        this.pageClick = this.pageClick.bind(this);
        this.openOptions = this.openOptions.bind(this);
        this.handleChangeValueByOne = this.handleChangeValueByOne.bind(this);
    }

    componentWillMount() {
        selectionStore.addChangeListener(this.update);
    }

    update() {
        this.setState({
            unit: selectionStore.getUnit(),
            shift: selectionStore.getShift(),
            group: selectionStore.getGroup(),
            shiftList: selectionStore.getShiftList(),
            groupList: selectionStore.getGroupList(),
            step: selectionStore.getUnitStep(),
            minUnit: selectionStore.getMinUnit(),
            maxUnit: selectionStore.getMaxUnit(),
            activeShift: selectionStore.isShiftActive(),
            activeItem: selectionStore.getActiveItem()
        });
    }

    componentWillUnmount() {
        selectionStore.removeChangeListener(this.update);
    }

    render() {
        const {options, data, mobile} = this.props;
        let angle = 270;
        let optionSize = 180/options.length;
        return (
            <div id="shadowBox-option" className={(mobile && this.state.showOption ? "opacityBoxMenu" : false)}>
                <div className="right panel">
                    {this.state.showOption  || !mobile ? 
                        <div id="optionPanel">
                            {this.state.activeShift ?
                                <div className="optionIcon down" >
                                    <svg className="mark bottom left" height="30" width="30" fill="rgba(36, 76, 90, 0.7)" stroke={mobile ? "white" : "rgb(36,76,90)"} strokeWidth="2" onClick={this.handleChangeValueByOne.bind(this, '+',"shift-article")}>
                                        <path d="M7 15 L23 15" />
                                        <path d="M15 7 L15 23" />
                                    </svg>
                                    <svg className="mark bottom right" height="30" width="30" fill="rgba(36, 76, 90, 0.7)" stroke={mobile ? "white" : "rgb(36,76,90)"} strokeWidth="2" onClick={this.handleChangeValueByOne.bind(this, '-',"shift-article")}>
                                        <path d="M7 15 L23 15" />
                                    </svg>
                                </div>
                            : false}
                            <div className="optionCircle">
                                <svg id="svgOption" className="rightOption" width={252} height={252}>
                                    {options.map((item) => {
                                        let prevAngle = angle;
                                        angle -= item === this.state.activeItem  ? optionSize + (optionSize / 3) : optionSize - (optionSize / 6);
                                        return (
                                            <Option key={item}
                                                    count={options.length} 
                                                    changeActive={this.changeActiveOption} type={item}
                                                    openItem={this.handleOpenList} mobile={mobile}
                                                    activeItem={item === 'shift' ? this.state.activeShift : item === this.state.activeItem }
                                                    value={item === 'shift' ? this.state.shiftList[this.state.shift] : item === 'group' ? this.state.groupList[this.state.group] : this.state.unit}
                                                    fromAngle={prevAngle} angle={angle} outerSize={115} center={125}
                                                    changeValue={this.handleChangeValueByOne}
                                                    />
                                        )
                                    }, this)}
                                    <circle cx="125" cy="125" r="35" strokeWidth="0" fill={mobile ? "#d7e165" : "#d3dbde"} />
                                </svg>
                            </div>
                            {this.state.showList ?
                                (() => {
                                    switch (this.state.openItem) {
                                        case "unit":
                                            return <NumpadModal onUpdate={this.handleOpenList} min={this.state.minUnit}
                                                                max={this.state.maxUnit} value={this.state.unit}
                                                                editValue={this.changeValue}/>;
                                        case "group":
                                            return <ListModal type="group" title={data.option.group} list={this.state.groupList}
                                                              onUpdate={this.handleOpenList} item={this.state.group}/>;
                                        case "shift":
                                            return <ListModal type="shift" title={data.option.shift} list={this.state.shiftList} 
                                                              onUpdate={this.handleOpenList} item={this.state.shift}/>;
                                        default:
                                            return false;
                                    }
                                })()
                                : false
                            }
                        </div> :
                        <div id="optionArrow" onClick={this.openOptions.bind(this)}>
                            <svg width="60px" height="60px">
                                <circle cx="30" cy="30" r="30" fill="rgba(0, 0, 0, 0.59)"/>
                                <path d="M40,10 L15,30 L40,50" stroke="white" fill="none" strokeWidth="5"/>
                            </svg>
                        </div>
                    }{this.state.activeShift ?
                    <div id="option-time">
                        {this.state.shiftList[this.state.shift][2]} - {this.state.shiftList[this.state.shift][3]} <br />
                        {this.state.shiftList[this.state.shift][4]}
                    </div>
                    : null}
                </div>
            </div>
        )
    }

    openOptions() {
        this.setState({
            showOption: true
        })
    }

    changeValue(value){
        selectionActions.switchUnit(parseInt(value,10));
        this.setState({
            showList: !this.state.showList
        })
    }

    changeActiveOption(type) {
        if(type === "shift")
            selectionActions.setShiftActive();
        else
            selectionActions.setActiveItem(type);
    }

    handleOpenList(type){
        this.setState({
            showList: !this.state.showList,
            openItem: type
        })
    }

    handleChangeValueByOne(operation,item){
        if(item === "group" || item === "unit"){
            if (this.state.activeItem === "unit"){
                let number = operation === '+' ? this.state.unit + this.state.step : this.state.unit - this.state.step;
                if (number <= this.state.maxUnit && number >= this.state.minUnit)
                    selectionActions.switchUnit(number);
            }
            else if (this.state.activeItem === "group")
                operation === "+" ? selectionActions.switchGroup(this.state.group+1) : selectionActions.switchGroup(this.state.group-1)
        }
        else
            operation === "+" ?selectionActions.switchShift(this.state.shift+1): selectionActions.switchShift(this.state.shift-1);
    }

    componentDidMount() {
        this.props.mobile ? window.addEventListener('click', this.pageClick, false) : false;
    }

    componentWillUnmount(){
        this.props.mobile ? window.removeEventListener('click', this.pageClick, false) : false;
    }
    
    pageClick(e) {
        if (e.target.id === 'shadowBox-option') {
            this.setState({
                showOption : false
            })
        }
    }
}

export default Options;