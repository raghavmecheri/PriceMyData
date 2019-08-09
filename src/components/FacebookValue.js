import React, {Component} from 'react';
import Button from 'react-bootstrap'

export default class FacebookValue extends Component {
    constructor() {
        super();
        this.state = {
            fbValue: false
        }
    }
    render() {
        return (
            <div>
                Value my FB data
            </div>
        );
        
    }
}