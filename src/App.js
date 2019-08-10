import React, {Component} from 'react';
import "./styles/HomeStyle.css"
import Button from 'react-bootstrap/Button'
import FacebookValue from "./components/FacebookValue"

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            fbValue: false
        }
    }
    render() {
        const general = (
            <div>
                <div className="containerDiv">
                    <div className="center">
                    <h3 className="centerTitle">How much is your data really worth?</h3>
                    <h6 className="centerSubtitle">Crowdfunding data valuations, for a safer, friendlier and more secure tomorrow.</h6>
                    <div className="buttons">
                        <Button className="buttonStyle">Check Facebook</Button>
                        <Button className="buttonStyle" style={{marginLeft:"1vw"}}>Check Google</Button>
                    </div>
                    <p className="readMore">Read more about this project <a href="#">here</a></p>
                    <Button className="circularButton">i</Button>
                    </div>
                </div>
            </div>
        );
        return(general);
    }
}