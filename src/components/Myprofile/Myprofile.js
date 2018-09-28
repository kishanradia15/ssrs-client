import React, {Component} from 'react';
import NavigationBar from "../NavigationBar";
import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import "../../styles/ViewProfile.css";

function changeIsEdit(){
    this.setState({
        isEdit : !this.state.isEdit
    });
}

class Myprofile extends Component{
    constructor(props) {
        super();
        this.state = { 
            firstName : props.user.name.firstName,
            lastName : props.user.name.lastName,
            gender : props.user.gender,
            programme : props.user.programme,
            isEdit : false
        }
    }
    render(){
        console.log(this.props.user);
        return (
            <div>
                <NavigationBar/>
                <div>
                    {this.state.isEdit ? <EditProfile user={this.props.user}/> :<ViewProfile user={this.props.user}/>}
                </div>
                {this.state.isEdit ? <button type="button" class="btn btn-primary style-btn" onClick={changeIsEdit.bind(this)}>Save</button> :<button type="button" class="btn btn-primary style-btn" onClick={changeIsEdit.bind(this)}>Edit</button>}
            </div>
        );
    }
}

export default Myprofile;