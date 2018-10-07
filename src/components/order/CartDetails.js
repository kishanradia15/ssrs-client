import React, {Component} from 'react';
import {Redirect, withRouter} from 'react-router-dom'
import {cartStatus, orderStatus} from "../../constants/status";
import {camelCaseToWords} from "../../helper/String";
import {isSuperAdmin} from "../../helper/userType";

function getDateString(date) {
    const dateObj = new Date(Date.parse(date))
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
}

class CartDetails extends Component {
    constructor(props) {
        super(props);
    }

    redirect = () => {
        this.props.history.push({
                pathname: this.props.location.pathname + "/" + this.props.cart._id,
                state: {
                    id: this.props.cart._id,
                    user: this.props.user
                }
            })
    }

    render() {
        const {cart, ...others} = this.props;
        return (
            <tr onClick={this.redirect}>
                <td className="column1" class="text-center">{`${cart.orderId}`}</td>
                <td className="column2">
                    <strong>{cart.orders[0].serviceName}</strong> <br/>
                    {getDateString(cart.createdOn)}
                    {
                        cart.orders.length > 1
                            ? <div > + {cart.orders.length - 1} More Items</div>
                            : ''
                    } <br/>
                </td>
                <td className="column3" class="text-center">{camelCaseToWords(cartStatus[cart.status])}</td>
                <td className="column4" class="text-center">{`₹ ${cart.ordersCost}`}</td>
                {
                    isSuperAdmin(others.user)
                        ? <td className="column5" class="text-center">{cart.requestedBy}</td>
                        : ''
                }
                <td className="column6" class="text-center">{`₹ ${cart.totalCost}`}</td>
            </tr>

        );
    }
}

export default withRouter(CartDetails);
