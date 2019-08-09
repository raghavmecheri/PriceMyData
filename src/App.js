import React, {Component} from 'react';
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
                <h3>
                    Value my data
                </h3>
            </div>
        );
        return(general);
    }
}