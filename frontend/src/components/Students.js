import React, { Component } from 'react';
import { Glyphicon, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

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

  renderStudentsTable(students) {
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Photo</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Birth date</th>
            <th>Hobbies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student =>
            <tr key={student.id}>
              <td><img alt={student.firstName+" "+student.lastName} src={student.photoUrl}/></td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.birthDate}</td>
              <td>{student.hobbies}</td>
              <td>
                <ButtonToolbar>
                  <ButtonGroup>
                    <LinkContainer to={`/Edit/${student.id}`} exact>
                      <Button>
                        <Glyphicon glyph="edit" />
                      </Button>
                    </LinkContainer>
                    <Button onClick={e=>this.deleteStudent(student)}>
                      <Glyphicon glyph="trash"  />
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
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
