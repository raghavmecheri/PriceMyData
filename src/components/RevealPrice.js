import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import "../styles/HomeStyle.css"

export default function RevealPrice(props) {
    return(
        <React.Fragment>
            <h3 className="centerTitle">How much is your data really worth?</h3>
            <h3 className="centerTitle">{JSON.stringify(props.priceInfo)}</h3>
        </React.Fragment>
    );
}