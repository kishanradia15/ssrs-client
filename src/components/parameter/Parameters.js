import React, {Component} from 'react';
import NavigationBar from "../NavigationBar";
import Header from "../Header";
import ParameterList from "./ParameterList";
import {asyncFetch} from "../../helper/FetchData";
import Spinner from "../Spinner";
import {domainUrl} from "../../config/configuration";
import * as HttpStatus from "http-status-codes";


class Parameters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
            parameter: []
        }
        this.asyncFetch = asyncFetch.bind(this);
    }

    componentDidMount() {
        this.asyncFetch('parameter');
    }

    toggleParameter = (index) => {
        this.setState({
            showSpinner: true
        });
        const parameter = this.state.parameter[index];
        const that = this;
        const url = domainUrl + '/parameter/changeStatus/' + parameter._id;
        const request = new XMLHttpRequest();
        request.open('PATCH', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status == HttpStatus.OK) {
                const response = JSON.parse(request.response);
                const parameterList = that.state.parameter;
                parameterList[index] = response.parameter;
                that.setState({
                    parameter: parameterList,
                    showSpinner: false
                });
            }
        };
        request.send(JSON.stringify({isActive: !parameter.isActive}));
    };

    deleteParameter = (index) => {
        this.setState({
            showSpinner: true
        });
        const that = this;
        const url = domainUrl + '/parameter/' + this.state.parameter[index]._id;
        const request = new XMLHttpRequest();
        request.open('DELETE', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status === HttpStatus.OK) {
                const parameter = that.state.parameter;
                that.setState({
                    parameter: [...parameter.slice(0,index),...parameter.slice(index+1)]
                })
            }
            that.setState({
                showSpinner: false
            })
        }
        request.send();
    }

    render() {
        return (
            <div>
                <NavigationBar/>
                <Header title={'Parameters'}/>
                <ParameterList parameters={this.state.parameter}
                               user={this.props.user}
                               toggleParameter={this.toggleParameter}
                               deleteParameter={this.deleteParameter}/>
                <Spinner open={this.state.showSpinner}/>
            </div>

        );
    }
}

export default Parameters;
