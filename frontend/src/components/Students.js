import React, { Component } from 'react';
import { Glyphicon, ButtonToolbar, ButtonGroup, Button ,OverlayTrigger,Tooltip} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import Loading from './Loading';

export class Students extends Component {
  displayName = Students.name

  constructor(props) {
    super(props);
    this.state = { students: [], loading: true };
  }

  componentDidMount()
  {
    this.getStudents();
  }

  setLoading(state)
  {
    this.setState({ loading: state });
  }

  getStudents()
  {
    this.setLoading(true);
    fetch(`${window.ApiUrl}/api/students/`, {mode: "cors"})
      .then(response => response.json())
      .then(data => {
        this.setState({ students: data, loading: false });
      }).catch(ex=>{
        this.setLoading(false);
      });
  }

  deleteStudent(student){
    if (window.confirm(`Are you sure you want to delete "${student.firstName} ${student.lastName}"`)) {
      this.setLoading(true);
        fetch(`${window.ApiUrl}/api/Students/Delete/${student.id}`,{method:'DELETE'})
      .then(respone=>respone.json()).then(result=>{
        if(result.success)
        {
          this.getStudents();
        }
      });
    }
  }

  getTooltip(text){
    return (
      <Tooltip id="tooltip">{text}</Tooltip>
    )
  }

  renderStudentsTable(students) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Photo</th>
            <th className="th-first-name">First name</th>
            <th>Last name</th>
            <th>Birth date</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
          <tbody>
            {students.map((student,index) =>
            {
              const birthay=new Date(student.birthDate);
              return (
                  <ReactCSSTransitionGroup key={student.id} component={React.Fragment} transitionName="table-rows" transitionAppear={true} transitionAppearTimeout={600} transitionEnterTimeout={600} transitionLeaveTimeout={600}>
                    <tr key={student.id} style={ {"transitionDelay": index*20+'ms'}}>
                        <td><img alt={student.firstName+" "+student.lastName} src={student.photoUrl}/></td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{moment(birthay).format('DD/MM/YYYY')}</td>
                        <td>{student.hobbies}</td>
                        <td>
                          <ButtonToolbar>
                            <ButtonGroup>
                              <LinkContainer to={`/Edit/${student.id}`} exact>
                              <OverlayTrigger placement="bottom" overlay={this.getTooltip("Edit")}>
                                  <Button>
                                    <Glyphicon glyph="edit" />
                                  </Button>
                                </OverlayTrigger>
                              </LinkContainer>
                                <OverlayTrigger placement="bottom" overlay={this.getTooltip("Delete")}>
                                  <Button onClick={e=>this.deleteStudent(student)}>
                                    <Glyphicon glyph="trash"  />
                                  </Button>
                                </OverlayTrigger>
                            </ButtonGroup>
                          </ButtonToolbar>
                        </td>
                    </tr>
                  </ReactCSSTransitionGroup>
                )
            }
            )}
          </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? (<Loading></Loading>)
        : this.renderStudentsTable(this.state.students);
    return (
      <div>
        <h1>Students</h1>
        <p>You can see the list of students here</p>
            <LinkContainer to={`/Add/`} exact>
                <Button>Add new student</Button>
            </LinkContainer>
        {contents}
      </div>
    );
  }
}
