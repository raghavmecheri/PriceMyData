import React, {Component} from 'react';
import Home from "./components/Home"
import PriceData from "./components/PriceData"
import RevealPrice from "./components/RevealPrice"

Object.prototype.hasElements = function() {
    for (var prop in this) if (this.hasOwnProperty(prop)) return true;
    return false;
};

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            priceMe: false,
            priceData: {}
        }
    }

    priceMeClicked = () => {
        this.setState({
            priceMe: true,
            priceData: {}
        });
    }

    backClicked = () => {
        this.setState({
            priceMe: false,
            priceData: {}
        });
    }

    priceFound = (response) => {
        this.setState({priceData:response})
    }

    render() {
        let {priceData, priceMe} = this.state;
        return (
            <div className="containerDiv">
                {
                    priceData.hasElements() ? (
                        <div className="center" style={{paddingTop:"3vh"}}>
                        <RevealPrice backHandler={this.backClicked} priceInfo={priceData}/>
                        </div>
                    ):
                        priceMe ? (
                            <div className="center" style={{paddingTop:"3vh"}}>
                            <PriceData backHandler={this.backClicked} handlePrice={this.priceFound}/>
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