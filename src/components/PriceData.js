import React, {Component} from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import DropzoneWithoutClick from './DropzoneWithoutClick'
import Button from 'react-bootstrap/Button'

export default class PriceData extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            <h3 className="centerTitle">Let's price your data</h3>
            <p className="readMore">Read more about this project <a href="#">here</a></p>
            <p className="readMore">Please upload your Facebook/Google data as the downloaded .zip file. For more details on how to download the file you need, please read <a href="#">this short guide.</a></p>
            <ButtonToolbar className="buttonHold">
                <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton className="toggled" value={1}>Facebook</ToggleButton>
                    <ToggleButton className="toggled" value={2}>Google</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
            <DropzoneWithoutClick />
            <h3 className="centerTitle">How much would you pay?</h3>
            <Button className="circularButton">i</Button>
            <Button className="backButton" onClick={this.props.backHandler}>Exit</Button>
            </React.Fragment>
        );
    }
}