import React, { Component } from 'react';
import { FormGroup,ControlLabel,FormControl,Button  } from 'react-bootstrap';
import  DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Avatar from 'react-avatar-edit';


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
        id:this.props.match.params.id, 
        student:{},
        preview:null,
        loading:true ,
        errorMessage:"",
        isNewPhoto:false,
        mode:mode.Edit
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleTextChange=this.handleTextChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCrop = this.onCrop.bind(this);
    this.renderEditForm = this.renderEditForm.bind(this);
    this.saveStudent = this.saveStudent.bind(this);
    this.saveStudentDetails = this.saveStudentDetails.bind(this);
  }

  componentDidMount(){
      if(this.state.id)
      {
        fetch(`${window.ApiUrl}/api/students/Student/${this.state.id}`)
        .then(response=>response.json())
        .then(result=>{
            if(result.success)
            {
                this.setState(
                    {
                        loading:false,
                        student:result.student,
                        preview:result.student.photoUrl
                    });
            }
            else{
                this.setState({ loading: false, errorMessage: "Could not retrieve the student" });

            }
        })
         .catch(error => {
             this.setState({ errorMessage : "Could not retrieve the student" });
        });
      }
      else{
        this.setState({ loading: false, mode:mode.Add,student:{photoUrl:defaultAvatarUrl},preview:defaultAvatarUrl });
      }

  }

  onClose() {
      this.setState({ preview: this.state.student.photoUrl, isNewPhoto: false });
  }
  
    onCrop(preview) {
        this.setState({ preview: preview, isNewPhoto: true });
  }

    handleChange(date) {
      let student=this.state.student;
      student.birthDate=date.toLocaleString().replace(".","/").replace(".","/").replace("00:00:00","");
        this.setState({student});
  }

  handleTextChange(event){
        const target=event.target;
        let student=this.state.student;
        student[target.name]=target.value;
        this.setState({student});
  }

  saveStudent(){
      this.setState({ isLoading: true });
      //if there is a new photo, upload it and get the url
      //then save rest of the student.

      if (this.state.isNewPhoto) {
          fetch(this.state.preview)
              .then(res => res.blob())
              .then(blob => {
                  let data = new FormData();
                  data.append("image", blob);

                  fetch(`${window.ApiUrl}/api/students/SaveProfilePicture`,
                      {
                          method: "POST",
                          body: data
                      }).then(response => response.json())
                      .then(result => {
                          if (result.success) {
                              let student = this.state.student;
                              student.photoUrl = result.url;
                              this.setState({ student });
                              console.log(student)
                              this.saveStudentDetails();
                          }
                          else {
                              alert(result.message);
                          }
                      });
              });
      }
      else {
          this.saveStudentDetails();
      }
    }

    saveStudentDetails() {
        let url = `${window.ApiUrl}/api/students/Student`;
        if (this.state.mode === mode.Add) {
            url = `${window.ApiUrl}/api/students/NewStudent`;
        }
        fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.student)
            })
            .then(response => response.json())
            .then(result => {
                this.setState({ isLoading: false });
                alert(result.message);
                if (this.mode === mode.Add) {
                    this.mode = mode.Edit;
                }
            })
            .catch(error => {
                alert("Could not save the student");
            });
    }

  renderEditForm()
  {
      //convert date format
    let birthDate = new Date();
    if (this.state.student.birthDate) {
        birthDate = new Date(this.state.student.birthDate.replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3"));
    }

    return (
        <div>
            <h1>{this.state.mode===mode.Add?"Add new student":`Edit ${this.state.student.firstName} ${this.state.student.lastName}`}</h1>
            <div className="profile-header">
                <div className="profile-container">
                        <img src={this.state.preview} alt="Preview" className="profile-picture"/>
                </div>
                <div className="profile-info-container">
                    <FormGroup controlId="txt-firstname">
                        <ControlLabel>First name</ControlLabel>
                        <FormControl
                        type="text"
                        value={this.state.student.firstName}
                        placeholder="Enter first name"
                        name="firstName"
                        onChange={this.handleTextChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="txt-lastname">
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
                            selected={birthDate}
                            name="birthDate"
                            onChange={this.handleChange}
                            dateFormat="dd/MM/yyyy"
                        />
                    </FormGroup>
                    <FormGroup controlId="txt-hobbies">
                        <ControlLabel>Hobbies</ControlLabel>
                        <FormControl name="hobbies" componentClass="textarea" placeholder="Hobbies" value={this.state.student.hobbies} onChange={this.handleTextChange}/>
                    </FormGroup>
                    <FormGroup controlId="txt-hobbies">
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
                </div>
            </div>
            <div className="buttons">
                <Button  bsStyle="primary" onClick={this.saveStudent}>Save student</Button>
            </div>
        </div>
      );
  }

  renderLoading(){
      return (<p><em>Loading...</em></p>);
    }

    render() {
        if (this.state.errorMessage.length > 0) {
            return (<p><em>{this.state.errorMessage}</em></p>);
        }
        else {
            return (<div>{this.state.loading ? this.renderLoading() : this.renderEditForm()}</div>);
        }
  }
}
