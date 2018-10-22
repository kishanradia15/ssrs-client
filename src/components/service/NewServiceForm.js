import React, {Component} from 'react';
import {defaultService} from "../../constants/constants"
import {withRouter} from "react-router-dom";
import Header from "../Header";
import NavigationBar from "../NavigationBar";
import {getServiceFromState, handleArrayUpdate, handleChange, handlePaymentModeChange} from "../../helper/StateUpdate"
import Form from "./Form";
import {makeCall} from "../../helper/caller";
import _ from 'lodash'

class NewServiceForm extends Component {
    constructor(props) {
        super(props);
        this.state = defaultService;
        this.handleChange = handleChange.bind(this)
        this.handleArrayUpdate = handleArrayUpdate.bind(this)
        this.handlePaymentModeChange = handlePaymentModeChange.bind(this);
        this.getServiceFromState = getServiceFromState.bind(this);
    }

    componentDidMount() {
        this.getUserInfoDistinct();
        this.getAllParameter();
        this.getAllCollectionType();
    }

    getAllCollectionType = () => {
        makeCall({
            jobType: "GET",
            urlParams: '/collectionType'
        })
            .then((response) => {
                this.setState({
                    collectionType: response.collectionType
                })
            })
    }

    getAllParameter = () => {
        makeCall({
            jobType: "GET",
            urlParams: '/parameter'
        })
            .then((response) => {
                this.setState({
                    parameter: response.parameter
                })
            })
    }

    addService = () => {
        makeCall({
            jobType: 'POST',
            urlParams: '/service/',
            params: this.getServiceFromState()
        })
            .then(() => this.props.history.push('/service'))
    }

    getUserInfoDistinct = () => {
        makeCall({
            jobType: "GET",
            urlParams: '/userInfo/distinct'
        })
            .then((response) => {
                this.setState({
                    batches: _.map(response.batches, (o) => ({name: o, isSelected: true})),
                    userTypes: _.map(response.userTypes, (o) => ({name: o, isSelected: true})),
                    programmes: _.map(response.programmes, (o) => ({name: o, isSelected: true}))
                })
            })
    }

    makeServiceApplicationSpecific = ({target}) => {
        console.log(target);
        this.setState({
            isApplicationSpecific: target.value
        })
    }

    makeServiceSpecial = ({target}) => {
        this.setState({
            isSpecialService: target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.addService()
    }

    changeRadioButtonState = ({target}) => {
        this.setState({
            [target.name]: target.value
        })
    }


    render() {
        return (
            <div>
                <NavigationBar/>
                <Header title={"Add New Service"}/>
                <div className="container container-custom">
                    <Form state={this.state}
                          handleChange={this.handleChange}
                          handleArrayUpdate={this.handleArrayUpdate}
                          handleSubmit={this.handleSubmit}
                          makeServiceSpecial={this.makeServiceSpecial}
                          changeRadioButtonState={this.changeRadioButtonState}
                          makeServiceApplicationSpecific={this.makeServiceApplicationSpecific}
                          handlePaymentModeChange={this.handlePaymentModeChange}/>
                </div>
            </div>
        );
    }
}

export default withRouter(NewServiceForm);

