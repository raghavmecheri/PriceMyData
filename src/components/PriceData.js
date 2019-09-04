import React, {Component} from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import DropzoneWithoutClick from './DropzoneWithoutClick'
import Button from 'react-bootstrap/Button'

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import ReactLoading from 'react-loading';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
            key: "g_map"
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

const acceptedKeys = [
    ["f_likes", "f_apps", "f_ad", "f_loc", "f_keyinfo"],
    ["g_bdata", "g_youtube", "g_ad", "g_loc", "g_services"]
];

const FIXED_DEFAULT = 1;

const MAX_PRICE = 2;
const PRICE_STEP = 0.1;

export default class PriceData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            toggleValue: 1,
            formValues: {},
            content: "Upload your Facebook data as a .zip file below"
        };
    }

    componentDidMount() {
        this.getDefaultValues();
    }

    filterForm = (values, keyVal, cb) => {
        let index = keyVal - 1;
        let acceptedValues = acceptedKeys[index];
        let newForm = {}
        let counter = 0;
        let total = Object.keys(values).length;
        Object.keys(values).forEach((key) => {
            counter += 1;
            if(acceptedValues.includes(key)) {
                newForm[key] = values[key];
            }
            if(counter >= total) {
                newForm["type"] = (keyVal==1?"FB":"GOOGL");
                cb(newForm)
            }
        });
    }

    getDefaultValues = () => {
        // console.log("Getting facebook defaults")
        let formValues = {}
        let count = 0;
        // console.log(questionTypes['facebook'])
        questionTypes['facebook'].forEach((element) => {
            count += 1;
            formValues[element.key] = FIXED_DEFAULT;
            if(count == (questionTypes['facebook'].length)) {
                // console.log("Getting Google defaults")
                count = 0;
                questionTypes['google'].forEach((element) => {
                    count += 1;
                    formValues[element.key] = FIXED_DEFAULT;
                    if(count == (questionTypes['google'].length)) {
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
        if(this.state.uploadFile) {
                // Begin file evaluation here
            let {toggleValue} = this.state;

            let {formValues} = this.state;
            let sentForm = this.filterForm(formValues, toggleValue, (filteredForm) => {
                // Append FB Entry HERE
                let end = './api/appendEntry'
                let payload = {
                    entry: filteredForm
                };
                fetch(end, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    }).then(res => res.json()).then(response => {
                        console.log("Transmitted data");
                        console.log(filteredForm);
                })
                .catch(
                    error => console.log(error)
                );
            });

            let fileKey = "fbFile"
            let endpoint = "./valueFB"
            if(toggleValue == 2) {
                endpoint = './valueGoogle';
                fileKey = "googleFile";
            }

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
        } else {
            toast.error("Please upload a .zip file");
        }
    }

    setFile = (file) => {
        this.setState({
            uploadFile:file
        });
    }

    handleToggleChange = (value) => {
        let change = value==1?"Upload your Facebook data as a .zip file below":"Upload your Google data as a .zip file below"
        this.setState({
            toggleValue: value,
            content: change
        })
        // console.log(value);
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
            <ButtonToolbar className="buttonHold">
                <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.handleToggleChange}>
                    <ToggleButton className="toggled" value={1}>Facebook</ToggleButton>
                    <ToggleButton className="toggled" value={2}>Google</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
            <p style={{marginBottom:"2vh", marginTop:"1vh", fontSize:"1.1rem"}}><b>{this.state.content}</b></p>
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
                                <Slider className="sliderCustom" value={this.verifyValue(formValues[question.key])} valueLabelFormat={this.valuetext} aria-labelledby="discrete-slider" 
                                    valueLabelDisplay="auto" step={PRICE_STEP} marks min={0} max={MAX_PRICE}
                                    onChange={(event,value)=>{
                                        // console.log(question.key);
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
                                    valueLabelDisplay="auto" step={PRICE_STEP} marks min={0} max={MAX_PRICE}
                                    onChange={(event,value)=>{
                                        if(toggleValue == 1) {
                                            // console.log(question.key);
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
            <ToastContainer />
            </React.Fragment>
        );
    }
}