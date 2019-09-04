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
            <p style={{position:"absolute", bottom:"5px", textAlign:"left", fontSize:"0.8rem", marginLeft:"2vw"}}>By using us to price your data, you agree to our <a href="https://github.com/raghavmecheri/PriceMyDataDocuments/blob/master/TOC.md" target="_blank" style={{
                color: "#ffffff",
                textDecoration: "underline"
            }}>terms and conditions</a></p>
            <Button className="circularButton">i</Button>
        </React.Fragment>
    );
}