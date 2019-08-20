import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import "../styles/HomeStyle.css"

export default function Home(props) {
    return(
        <React.Fragment>
            <h3 className="centerTitle">How much is your data really worth?</h3>
            <h6 className="centerSubtitle">Crowdfunding data valuations, for a safer, friendlier and more secure tomorrow.</h6>
            <div className="buttons">
                <Button className="buttonStyle" onClick={props.priceHandler}>Price my data!</Button>
            </div>
            <p className="readMore">Read more about this project <a href="#">here</a></p>
            <Button className="circularButton">i</Button>
        </React.Fragment>
    );
}