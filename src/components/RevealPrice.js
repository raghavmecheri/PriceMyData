import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    RedditShareButton
  } from 'react-share';

import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import "../styles/HomeStyle.css"

const CHANGE_URL = "https://binit.in";

const priceHoldStyle = {
    paddingRight: "1vh",
    paddingLeft: "1vh"
}

// https://www.jangronauts.co.uk/img/common/social_icons.svg

export default function RevealPrice(props) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
    return(
        <div className="vertCenter">
            <h4 className="centerTitle" style={priceHoldStyle}>Your Data's Value: {formatter.format(props.priceInfo.value.dataValue)}</h4>
            <h4 className="centerTitle" style={priceHoldStyle}>Advertisers who interact with your information: {props.priceInfo.value.advertisers}</h4>
            <div>
                <div className="logoHold">
                <FacebookShareButton style={{"float":"left"}} url="https://pricemydata.com" quote={`PriceMyData says that my ${props.platformName} data is worth ${formatter.format(props.priceInfo.value.dataValue)}! Check out how much your data is worth at PriceMyData`} hashtag="#dataHasValue">
                    <svg className="shareLogo" viewBox="110 60 30 30">
                        <path fill="#ffffff" d="M130.5,67.3l-2,0c-1.6,0-1.9,0.7-1.9,1.8v2.4h3.7l-0.5,3.8h-3.2v11h-3.9v-11h-3.3v-3.8h3.3v-2.8   c0-3.2,2-5,4.8-5c1.4,0,2.6,0.1,2.9,0.1V67.3z"/>
                    </svg> 
                </FacebookShareButton>
                <LinkedinShareButton style={{"float":"left"}} url="https://pricemydata.com">
                    <svg className="shareLogo" viewBox="60 60 30 30">
                        <path fill="#ffffff" d="M85.1,84.9h-4.5v-7.7c0-1.8-0.6-3-2.1-3c-1.2,0-1.9,0.8-2.2,1.6c-0.1,0.3-0.2,0.7-0.2,1.1v8h-4.2v-9.4   c0-1.7,0-3.1-0.1-4.3h3.7l0.2,1.8h0.1c0.6-0.9,2-2.2,4.3-2.2c2.8,0,5,1.9,5,5.9V84.9z M67.1,69.4c-1.3,0-2.2-1-2.2-2.1   c0-1.2,0.9-2.1,2.3-2.1s2.2,0.9,2.2,2.1C69.4,68.4,68.5,69.4,67.1,69.4z M69.2,84.9h-4.2V71.1h4.2V84.9z"/>
                    </svg>
                </LinkedinShareButton>
                <TwitterShareButton style={{"float":"left"}} url="https://pricemydata.com" title={`PriceMyData says that my ${props.platformName} data is worth ${props.priceInfo.value.dataValue}! Check out how much your data is worth at PriceMyData!.`} hashtags={["dataHasValue"]}>
                    <svg className="shareLogo" viewBox="10 60 30 30">
                        <path fill="#ffffff" d="M33.2,70.8c0,0.2,0,0.4,0,0.5c0,5.6-4.2,12-12,12c-2.4,0-4.6-0.7-6.5-1.9c0.3,0,0.7,0.1,1,0.1   c2,0,3.8-0.7,5.2-1.8c-1.8,0-3.4-1.3-4-2.9c0.3,0,0.5,0.1,0.8,0.1c0.4,0,0.7-0.1,1-0.1c-1.9-0.4-3.5-2.1-3.5-4.1v-0.1   c0.6,0.3,1.3,0.5,2,0.5c-1.1-0.8-1.8-2-1.8-3.5c0-0.8,0.2-1.5,0.6-2.1c2.1,2.6,5.2,4.2,8.7,4.4c-0.1-0.3-0.1-0.6-0.1-1   c0-2.3,1.9-4.2,4.2-4.2c1.2,0,2.3,0.5,3.1,1.3c1-0.2,1.9-0.5,2.7-1c-0.3,1-1,1.8-1.9,2.3c0.9-0.1,1.7-0.3,2.4-0.7   C34.7,69.5,34,70.2,33.2,70.8z"/>
                    </svg>
                </TwitterShareButton>
                </div>
            </div>
            <div className="buttons">
                <Button className="middleButtonStyle" style={{marginRight:"1vh"}} onClick={() => window.open(CHANGE_URL, '_blank')}>Where's my money?</Button>
                <Button className="middleButtonStyle" style={{marginLeft:"1vh"}} onClick={props.backHandler}>Price more data</Button>
            </div> 
        </div>
    );
}