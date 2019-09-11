import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import CountUp from 'react-countup';
import "../styles/HomeStyle.css"

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users:0
        }
    }

    componentDidMount() {
        const endpoint = "./fetchUserCount";
        fetch(endpoint, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            }).then(res => res.json()).then(response => {
                let {count} = response;
                console.log(count);
                this.setState({users:count})
        })
        .catch(
            error => console.log(error)
        );
    }

    render() {
        let {users} = this.state;
        return(
            <React.Fragment>
                <h3 className="centerTitle">How much is your data really worth?</h3>
                <h6 className="centerSubtitle">Crowdfunding data valuations, for a safer, friendlier and more secure tomorrow.</h6>
                <div className="buttons">
                    <Button className="buttonStyle" onClick={this.props.priceHandler}>Price my data</Button>
                </div>
                <p className="readMore">Read more about this project <a href="#">here</a></p>
                <p style={{position:"absolute", bottom:"5px", textAlign:"left", fontSize:"0.8rem", marginLeft:"2vw"}}>By using us to price your data, you agree to our <a href="https://github.com/raghavmecheri/PriceMyDataDocuments/blob/master/TOC.md" target="_blank" style={{
                    color: "#ffffff",
                    textDecoration: "underline"
                }}>terms and conditions</a></p>
                <CountUp className="counter" delay={2} end={users} prefix="Users: "/>
            </React.Fragment>
        );
    }
}