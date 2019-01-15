import React, { Component } from 'react';
import { Glyphicon, ButtonToolbar, ButtonGroup, Button ,OverlayTrigger,Tooltip,Modal} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import Loading from './Loading';

export class Students extends Component {
  displayName = Students.name

  constructor(props) {
    super(props);
    this.state = { 
      students: [], 
      loading: true,
      showModal:false,
      modal:this.getDeleteModal(),
      orderBy:"",
      orderAsc:false
    };

    this.setOrder=this.setOrder.bind(this);
  }

  componentDidMount()
  {
    this.getStudents();
  }

  setLoading(state)
  {
    this.setState({ loading: state });
  }

  getStudents(order="",orderAsc="")
  {
    this.setLoading(true);
    fetch(`${window.ApiUrl}/api/students/?order=${order}&asc=${orderAsc}`, 
      {mode: "cors"},
    ).then(response => response.json())
      .then(data => {
        this.setState({ students: data, loading: false });
      }).catch(ex=>{
        this.setLoading(false);
      });
  }

  showDeleteModal(student){
    this.setState({showModal:true,modal:this.getDeleteModal(student)});

  }

  deleteStudent(student){
    this.setState({showModal:false});
    this.setLoading(true);
      fetch(`${window.ApiUrl}/api/Students/Delete/${student.id}`,{method:'DELETE'})
    .then(respone=>respone.json()).then(result=>{
      if(result.success)
      {
        this.getStudents();
      }
    });
  }

  getTooltip(text){
    return (
      <Tooltip id="tooltip">{text}</Tooltip>
    )
  }

  getDeleteModal(student){
    return(
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>This student will be gone forever!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to remove <b>{student?student.firstName+" "+student.lastName:""}</b></Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={e=>this.deleteStudent(student)}>Yes</Button>
            <Button onClick={e=>this.setState({showModal:false})}>No</Button>
          </Modal.Footer>
        </Modal.Dialog>
    </div>
    );
  }

  setOrder(column){
    let current=this.state.orderBy;
    let asc=this.state.orderAsc;
    if(current===column)
    {
      asc=!this.state.orderAsc;
      this.setState({orderAsc:asc});
    }
    else
    {
      this.setState({orderBy:column});
    }
    this.getStudents(column,asc);
  }

  renderStudentsTable(students) {
    let ascGlyph=(<Glyphicon  glyph={!this.state.orderAsc?'triangle-bottom':'triangle-top'}></Glyphicon>)
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Photo</th>
            <th onClick={e=>this.setOrder("firstName")} className="th-first-name sort">First name {this.state.orderBy=="firstName"?ascGlyph:""}</th>
            <th onClick={e=>this.setOrder("lastName")} className="sort">Last name {this.state.orderBy=="lastName"?ascGlyph:""}</th>
            <th onClick={e=>this.setOrder("birthDate")} className="sort">Birth date {this.state.orderBy=="birthDate"?ascGlyph:""}</th>
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
                                  <Button onClick={e=>this.showDeleteModal(student)}>
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
      <div className="students">
        <h1>Students</h1>
        <p>You can see the list of students here</p>
            <LinkContainer to={`/Add/`} exact>
                <Button>Add new student</Button>
            </LinkContainer>
        {contents}
        {this.state.showModal?this.state.modal:""}
      </div>
    );
  }
}
