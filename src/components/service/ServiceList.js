import React, {Component} from 'react';
import _ from "lodash"
import ServiceDetails from "./ServiceDetails";
import {asyncFetch} from "../../helper/FetchData"
import EditButton from "../EditButton";
import Switch from "./Switch";
import AuthorizedComponent from "../AuthorizedComponent";
import {domainUrl} from '../../config/configuration'
import * as HttpStatus from "http-status-codes";
import ButtonLink from "./ButtonLink";
import Spinner from "../Spinner";
import OrderForm from "../order/cart/OrderForm";
import ConfirmModal from "../ConfirmModal";
import DeleteButton from "../DeleteButton";
import {isStudent, isSuperAdmin} from "../../helper/userType";
import ApplyButton from "./ApplyButton";

class ServiceList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            service: [],
            showSpinner: false,
            isModalOpen: false
        };
        this.asyncFetch = asyncFetch.bind(this);
    }

    componentDidMount() {
        this.asyncFetch('service');
    }

    openConfirmationModal = () => {
        this.setState({
            isModalOpen: true
        })
    };

    closeConfirmationModal = () => {
        this.setState({
            isModalOpen: false
        })
    };

    onYes = (index) => {
        this.deleteService(index);
        this.closeConfirmationModal();
    };

    deleteService = (index) => {
        this.setState({
            showSpinner: true
        });
        const that = this;
        const url = domainUrl + '/service/' + this.state.service[index]._id;
        const request = new XMLHttpRequest();
        request.open('DELETE', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status === HttpStatus.OK) {
                const service = that.state.service;
                that.setState({
                    service: [...service.slice(0,index),...service.slice(index+1)]
                })
            }
            that.setState({
                showSpinner: false
            })
        }
        request.send();
    }

    toggleService = (index) => {
        this.props.showSpinner();
        const service = this.state.service[index];
        const that = this;
        const url = domainUrl + '/service/changeStatus/' + service._id;
        const request = new XMLHttpRequest();
        request.open('PATCH', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status == HttpStatus.OK) {
                const response = JSON.parse(request.response)
                const serviceList = that.state.service;
                serviceList[index] = response.service;
                that.setState({
                    service: serviceList,
                });
            }
            that.props.hideSpinner();
        }
        request.send(JSON.stringify({isActive: !service.isActive}));
    }

    render() {
        return (
            <div className={'container container-custom'}>
                <div id="accordion">
                    {
                        _.map(this.state.service, (service, i) => {
                            return (
                                <div key={service._id} className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center p-0">
                                        <a className="collapsed card-link text-dark w-100 h-100 p-3 ml-2"
                                           data-toggle="collapse"
                                           href={"#collapse" + i}>
                                            <h4 className={'m-0'}> {service.name}</h4>
                                        </a>
                                        <div className='d-flex p-2 align-items-center justify-content-center'>
                                            <AuthorizedComponent component={ApplyButton}
                                                                 service={service}
                                                                 permission={isStudent(this.props.user)}/>
                                            <AuthorizedComponent
                                                component={EditButton}
                                                permission={isSuperAdmin(this.props.user)}
                                                data={service}
                                                path={'/service/edit/' + i}/>
                                            <AuthorizedComponent
                                                component={Switch}
                                                handleClick={this.toggleService}
                                                index={i}
                                                isChecked={service.isActive ? true : false}
                                                permission={isSuperAdmin(this.props.user)}/>
                                            <AuthorizedComponent permission={isSuperAdmin(this.props.user)}
                                                                 openConfirmationModal={this.openConfirmationModal}
                                                                 component={DeleteButton}/>
                                            <ConfirmModal open={this.state.isModalOpen}
                                                          onYes={() => this.onYes(i)}
                                                          close={this.closeConfirmationModal}/>

                                        </div>
                                    </div>
                                    <div id={'collapse' + i} className="collapse" data-parent="#accordion">
                                        <div className="card-body">
                                            <ServiceDetails service={service}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <AuthorizedComponent
                    component={ButtonLink}
                    permission={isSuperAdmin(this.props.user)}
                />
                <Spinner open={this.state.showSpinner}/>
            </div>
        );
    }
}

export default ServiceList;

