import React, {Component} from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import DropzoneWithoutClick from './DropzoneWithoutClick'
import Button from 'react-bootstrap/Button'

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import ReactLoading from 'react-loading';


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

const questionTypes = {
    "facebook": [
        {
            title: "Every Facebook like/reaction?",
            key: "f_likes"
        },{
            title: "Every website/app that you signed into?",
            key: "f_apps"
        },{
            title: "Every piece of advertiser information?",
            key: "f_ad"
        },{
            title: "Your location at each point in time",
            key: "f_loc"
        },{
            title: "Your facial data, friends and personal info?",
            key: "f_keyinfo"
        }
    ],
    "google": [
        {
            title: "Every piece of your browser data?",
            key: "g_bdata"
        },{
            title: "Every piece of your YouTube data?",
            //(Likes, subscriptions, etc)
            key: "g_youtube"
        },{
            //(locations visisted, popular places, etc)
            title: "Every piece of your maps data?",
            key: "g_ad"
        },{
            title: "Your location at any point in time?",
            key: "g_loc"
        },{
            // (Drive, Gmail, Adwords, Analytics)
            title: "Adwords, Gmail or other such Google data?",
            key: "g_services"
        }
    ]
}

const FIXED_DEFAULT = 2;

export default class PriceData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            toggleValue: 1,
            formValues: {}
        };
    }

    componentDidMount() {
        this.getDefaultValues();
    }

    getDefaultValues = () => {
        console.log("Getting facebook defaults")
        let formValues = {}
        let count = 0;
        console.log(questionTypes['facebook'])
        questionTypes['facebook'].forEach((element) => {
            count += 1;
            formValues[element.key] = FIXED_DEFAULT;
            if(count == (questionTypes['facebook'].length)) {
                console.log("Getting Google defaults")
                count = 0;
                questionTypes['google'].forEach((element) => {
                    count += 1;
                    formValues[element.key] = FIXED_DEFAULT;
                    if(count == (questionTypes['google'].length)) {
                        console.log(formValues)
                        this.setState({formValues:formValues})
                    }
                })
            }
        })   
    }

    valuetext = (value) => {
        return `$${value}`;
    }

    submitData = (event) => {
        // Append FB Entry HERE

        // Begin file evaluation here
        let {toggleValue} = this.state;
        let fileKey = "fbFile"
        let endpoint = "./valueFB"
        if(toggleValue == 2) {
            endpoint = './valueGoogle';
            fileKey = "googleFile";
        }

        console.log(this.state);
        var payload = new FormData()
        payload.append("username", "raghavmecheri");
        payload.append(fileKey, this.state.uploadFile);
        this.setState({isLoading:true})
        fetch(endpoint, {
            method: 'POST',
            body: payload,
            /*headers:{
                'Content-Type': 'application/json'
            },*/
            }).then(res => res.json()).then(response => {
                this.setState({isLoading:false})
                this.props.handlePrice(response);
                //alert(JSON.stringify(response))
          })
          .catch(
            error => console.log(error)
          );
    }

    setFile = (file) => {
        this.setState({
            uploadFile:file
        });
    }

    handleToggleChange = (value) => {
        this.setState({
            toggleValue: value
        })
        console.log(value);
    }

    verifyValue = (val) => {
        if(val) {
            return val;
        }
        return FIXED_DEFAULT;
    }

    render() {
        let {isLoading, toggleValue, formValues} = this.state;
        if(isLoading) {
            return <ReactLoading type={"spin"} color={"#007bff"} className="loadingSign" />
        }
        return (
            <React.Fragment>
            <Button className="backButton" onClick={this.props.backHandler}>Exit</Button>
            <h3 style={{marginTop:"-4vh"}}>Let's price your data</h3>
            <p className="readMore">Read more about this project <a href="#">here</a></p>
            <p className="readMore">Please upload your Facebook/Google data as a .zip file below</p>
            <ButtonToolbar className="buttonHold">
                <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.handleToggleChange}>
                    <ToggleButton className="toggled" value={1}>Facebook</ToggleButton>
                    <ToggleButton className="toggled" value={2}>Google</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
            <DropzoneWithoutClick handleFileSet={this.setFile}/>
            <h4 className="centerElement">How much would you charge for:</h4>
            <div className="centerElement">
                {
                    toggleValue == 1 ?
                        questionTypes.facebook.map((question) => (
                            <div className="sliderHold">
                                <Typography id="discrete-slider" gutterBottom>
                                    {question.title}
                                </Typography>
                                {console.log(`Getting value as: ${formValues[question.key]}`)}
                                <Slider className="sliderCustom" value={this.verifyValue(formValues[question.key])} valueLabelFormat={this.valuetext} aria-labelledby="discrete-slider" 
                                    valueLabelDisplay="auto" step={1} marks min={0} max={10}
                                    onChange={(event,value)=>{
                                        console.log(question.key);
                                        this.setState(prevState => ({
                                            formValues: {                   
                                                ...prevState.formValues,    
                                                [question.key]: value       
                                            }
                                        }))
                                        }} />
                            </div>
                        ))
                    :
                        questionTypes.google.map((question) => (
                            <div className="sliderHold">
                                <Typography id="discrete-slider" gutterBottom>
                                    {question.title}
                                </Typography>
                                <Slider className="sliderCustom" value={this.verifyValue(formValues[question.key])} valueLabelFormat={this.valuetext} aria-labelledby="discrete-slider" 
                                    valueLabelDisplay="auto" step={1} marks min={0} max={10}
                                    onChange={(event,value)=>{
                                        if(toggleValue == 1) {
                                            console.log(question.key);
                                            this.setState(prevState => ({
                                                formValues: {                   
                                                    ...prevState.formValues,    
                                                    [question.key]: value       
                                                }
                                            }))
                                        } else {
                                            this.setState(prevState => ({
                                                formValues: {                   
                                                    ...prevState.formValues,    
                                                    [question.key]: value       
                                                }
                                            }))
                                        }
                                        }} />
                            </div>
                        ))
                }
            <Button className="submitButton" onClick={this.submitData}>Price my data!</Button>
            </div>
            <p style={{marginTop:"1.5vh", textAlign:"left", fontSize:"0.6rem", marginLeft:"2vw"}}>By using us to price your data, you agree to our <a href="https://github.com/raghavmecheri/PriceMyDataDocuments/blob/master/TOC.md" target="_blank" style={{
                color: "#ffffff",
                textDecoration: "underline"
            }}>terms and conditions</a></p>
            </React.Fragment>
        );
    }
}