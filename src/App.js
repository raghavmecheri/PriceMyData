import React, {Component} from 'react';
import Home from "./components/Home"
import PriceData from "./components/PriceData"

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            priceMe: false
        }
    }

    priceMeClicked = (e) => {
        this.setState({priceMe: true});
    }

    backClicked = (e) => {
        this.setState({priceMe: false});
    }

    render() {
        let {priceMe} = this.state;
        return (
            <div className="containerDiv">
                
                {
                    priceMe ? (
                        <div className="center" style={{paddingTop:"3vh"}}>
                        <PriceData backHandler={this.backClicked} />
                        </div>
                    ) : (
                        <div className="center">
                        <Home priceHandler={this.priceMeClicked}/>
                        </div>
                    )
                } 
            </div>
        );
    }
}