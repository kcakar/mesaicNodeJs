import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import DatePicker  from 'react-datepicker';
import Avatar from 'react-avatar-edit';
import { FormGroup,ControlLabel, FormControl, Button, Alert  } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Loading from './Loading';

const mode={
    Edit:0,
    Add:1
};

const defaultAvatarUrl="/img/default.png";

export class EditStudent extends Component {
    displayName = EditStudent.name

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            student: {
                firstName:"",
                lastName:"",
                hobbies:"",
                photoUrl:defaultAvatarUrl,
                birthDate:new Date()
            },
            preview: defaultAvatarUrl,
            loading: true,
            errorMessages:[],
            isNewPhoto: false,
            mode: mode.Edit
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCrop = this.onCrop.bind(this);
        this.renderEditForm = this.renderEditForm.bind(this);
        this.saveStudent = this.saveStudent.bind(this);
        this.saveStudentDetails = this.saveStudentDetails.bind(this);
        this.checkStudent = this.checkStudent.bind(this);
    }

    componentDidMount() {
        if (this.state.id) {
            fetch(`${window.ApiUrl}/api/students/Student/${this.state.id}`)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        this.setState({
                            loading: false,
                            student: result.student,
                            preview: result.student.photoUrl
                        });
                    } else {
                        this.setState({
                            loading: false,
                            errorMessages: "Could not retrieve the student"
                        });

                    }
                })
                .catch(error => {
                    this.setState({
                        loading: false,
                        errorMessages: "Could not retrieve the student"
                    });
                });
        } else {
            this.setState({
                loading: false,
                mode: mode.Add
            });
        }

    }

    onClose() {
        this.setState({
            preview: this.state.student.photoUrl,
            isNewPhoto: false
        });
    }

    onCrop(preview) {
        this.setState({
            preview: preview,
            isNewPhoto: true
        });
    }

    handleChange(date) {
        let student = this.state.student;
        student.birthDate = new Date(date);
        this.setState({
            student
        });
    }

    handleTextChange(event) {
        const target = event.target;
        let student = this.state.student;
        student[target.name] = target.value;
        this.setState({
            student
        });
    }

    checkStudent()
    {
        let errorMessages=[];
        if(!this.state.student.firstName || this.state.student.firstName.replace(/\s/g, '').length<=0)
        {
            errorMessages.push(<li key={errorMessages.length}>Please fill the first name field</li>);
        }
        if(!this.state.student.lastName || this.state.student.firstName.replace(/\s/g, '').length<=0)
        {
            errorMessages.push(<li key={errorMessages.length}>Please fill the last name field</li>);
        }
        this.setState({errorMessages});
        return errorMessages.length<=0;
    }

    saveStudent() {
        this.setState({
            isLoading: true
        });
        //if there is a new photo, upload it and get the url
        //then save rest of the student.
        if(this.checkStudent())//check if required areas are filled
        {
            if (this.state.isNewPhoto) {
                fetch(this.state.preview)
                    .then(res => res.blob())
                    .then(blob => {
                        let data = new FormData();
                        data.append("image", blob);

                        fetch(`${window.ApiUrl}/api/students/SaveProfilePicture`, {
                                method: "POST",
                                body: data
                            }).then(response => response.json())
                            .then(result => {
                                if (result.success) {
                                    let student = this.state.student;
                                    student.photoUrl = result.url;
                                    this.setState({
                                        student
                                    });
                                    this.saveStudentDetails();
                                } else {
                                    NotificationManager.error(result.message,"",1000);
                                }
                            });
                    });
            } else {
                this.saveStudentDetails();
            }
        }
    }

    saveStudentDetails() {
        let url = `${window.ApiUrl}/api/students/Student`;
        if (this.state.mode === mode.Add) {
            url = `${window.ApiUrl}/api/students/NewStudent`;
        }
        fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.student)
            })
            .then(response => response.json())
            .then(result => {
                this.setState({
                    isLoading: false
                });
                NotificationManager.success(result.message,"",1000);
                if (this.state.mode === mode.Add) {
                    let student=this.state.student;
                    student.id=result.id;
                    this.setState({mode:mode.Edit,student});
                }
            })
            .catch(error => {
                NotificationManager.error("Could not save the student","",1000);
            });
    }

    renderEditForm()
    {
        return (
            <div>
                <h1>{this.state.mode===mode.Add?"Add new student":`Edit ${this.state.student.firstName} ${this.state.student.lastName}`}</h1>
                <Alert bsStyle="danger" className={this.state.errorMessages.length>0?"":"hide"}>
                    <ul>
                        {this.state.errorMessages}
                    </ul>
                </Alert>
                <div className="profile-header">
                    <ReactCSSTransitionGroup transitionName="fade-in" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                        <div className="profile-container">
                            <img src={this.state.preview} alt="Preview" className="profile-picture"/>
                        </div>
                    </ReactCSSTransitionGroup>
                    <div className="profile-info-container">
                        <ReactCSSTransitionGroup transitionName="form-inputs" transitionAppear={true} transitionAppearTimeout={600} transitionEnterTimeout={600} transitionLeaveTimeout={600}>
                            <FormGroup controlId="txt-firstname" validationState={this.state.student.firstName.length>0?"success":"warning"}>
                                <ControlLabel>First name</ControlLabel>
                                <FormControl
                                type="text"
                                value={this.state.student.firstName}
                                placeholder="Enter first name"
                                name="firstName"
                                onChange={this.handleTextChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="txt-lastname" validationState={this.state.student.lastName.length>0?"success":"warning"}>
                                <ControlLabel>Last name</ControlLabel>
                                <FormControl
                                type="text"
                                value={this.state.student.lastName}
                                placeholder="Enter last name"
                                name="lastName"
                                onChange={this.handleTextChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>BirthDate</ControlLabel><br/>
                                <DatePicker
                                    id="date-birthday" 
                                    selected={new Date(this.state.student.birthDate)}
                                    name="birthDate"
                                    onChange={this.handleChange}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </FormGroup>
                            <FormGroup controlId="txt-hobbies">
                                <ControlLabel>Hobbies</ControlLabel>
                                <FormControl name="hobbies" componentClass="textarea" placeholder="Hobbies" value={this.state.student.hobbies} onChange={this.handleTextChange}/>
                            </FormGroup>
                            <FormGroup controlId="txt-photo" className="txt-photo-container">
                                <ControlLabel>Photo</ControlLabel>
                                    <Avatar
                                        width={200}
                                        height={150}
                                        onCrop={this.onCrop}
                                        onClose={this.onClose}
                                        onBeforeFileLoad={this.onBeforeFileLoad}
                                        src={this.state.src}
                                    />
                            </FormGroup>
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
                <div className="buttons">
                    <ReactCSSTransitionGroup transitionName="fade-in" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                        <Button  bsStyle="primary" onClick={this.saveStudent}>Save student</Button>
                    </ReactCSSTransitionGroup>
                </div>
                <NotificationContainer/>
            </div>
        );
    }

    renderLoading(){
        return (<Loading></Loading>);
    }

    render() {
        return (<div>{this.state.loading ? this.renderLoading() : this.renderEditForm()}</div>);
    }
}
