import React, {Component} from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import DropzoneWithoutClick from './DropzoneWithoutClick'
import Button from 'react-bootstrap/Button'

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const marks = [
    {
      value: 0,
      label: '$0',
    },{
        value: 1,
        label: '$1',
    },{
        value: 2,
        label: '$2',
    },{
        value: 3,
        label: '$3',
    },{
        value: 4,
        label: '$4',
    },{
        value: 5,
        label: '$5',
    },{
        value: 6,
        label: '$6',
    },{
        value: 7,
        label: '$7',
    },{
        value: 8,
        label: '$8',
    },{
        value: 9,
        label: '$9',
    },{
        value: 10,
        label: '$10',
    },
];

const questionTypes = [
    {
        title: "Sell your location?",
        key: "loc"
    },{
        title: "Sell your privacy?",
        key: "priv"
    },{
        title: "Sell your ad?",
        key: "ad"
    },{
        title: "Sell your something?",
        key: "sm"
    }
]

const FIXED_DEFAULT = 2;

export default class PriceData extends Component {

    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        this.getDefaultValues();
    }

    getDefaultValues = () => {
        console.log("Getting defaults")
        let formValues = {}
        let count = 0;
        questionTypes.forEach((element) => {
            count += 1;
            formValues[element.key] = FIXED_DEFAULT;
            if(count == (questionTypes.length)) {
                console.log(formValues)
                this.setState({formValues:formValues})
            }
        })
    }

    valuetext = (value) => {
        return `${value}`;
    }

    submitData = (event) => {
        alert(JSON.stringify(this.state));
    }

    render() {
        return (
            <React.Fragment>
            <Button className="backButton" onClick={this.props.backHandler}>Exit</Button>
            <h3>Let's price your data</h3>
            <p className="readMore">Read more about this project <a href="#">here</a></p>
            <p className="readMore">Please upload your Facebook/Google data as the downloaded .zip file. For more details on how to download the file you need, please read <a href="#">this short guide.</a></p>
            <ButtonToolbar className="buttonHold">
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton className="toggled" value={1}>Facebook</ToggleButton>
                    <ToggleButton className="toggled" value={2}>Google</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
            <DropzoneWithoutClick />
            <h3 className="centerElement">How much would you pay?</h3>
            <div className="centerElement">
                {
                    questionTypes.map((question) => (
                        <div className="sliderHold">
                            <Typography id="discrete-slider" gutterBottom>
                                {question.title}
                            </Typography>
                            <Slider className="sliderCustom" defaultValue={FIXED_DEFAULT} getAriaValueText={this.valuetext} aria-labelledby="discrete-slider" 
                                valueLabelDisplay="auto" step={0.5} marks min={0} max={10}
                                onChange={(event,value)=>{
                                    this.setState(prevState => ({
                                        formValues: {                   
                                            ...prevState.formValues,    
                                            [question.key]: value       
                                        }
                                    }))
                                    }} />
                        </div>
                    ))
                }
            <Button className="submitButton" onClick={this.submitData}>Price my data!</Button>
            </div>
            </React.Fragment>
        );
    }
}