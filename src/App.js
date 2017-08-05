import React, { Component } from 'react';
import fire from './fire';
import octo from './octo.svg';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import InputGroupButton from 'react-bootstrap/lib/InputGroupButton';
import Alert from 'react-bootstrap/lib/Alert';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

// https://react-bootstrap.github.io/components.html

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {taskList:[], alert:null}
  }

  addTask = (task) => {
    let alertMsg = "You will be reminded to "+task+"."
    let newList = this.state.taskList
    newList.push(task)


    this.setState ({
      taskList: newList,
      //alert: <Alert bsStyle="success"><strong>Added! </strong>You will be reminded to {task}.</Alert>
      alert: <AlertBox message={alertMsg}/>
    })
  }

  deleteTask = (task) => {
    let alertMsg = "You are done with "+task+"."
    let newList = this.state.taskList
    newList.splice(newList.indexOf(task),1)

    this.setState ({
      taskList: newList,
      //alert: <Alert bsStyle="success"><strong>Deleted! </strong>You are done with {task}.</Alert>
      alert: <AlertBox message={alertMsg}/>
    })
  }

  render() {
    return (
      <div className="App">
      <div>
        <div className="App-header">
          <img src={octo} className="App-logo" alt="logo" />
          <img src={octo} className="App-logo" alt="logo" />
          <img src={octo} className="App-logo" alt="logo" />
          <img src={octo} className="App-logo" alt="logo" />
          <img src={octo} className="App-logo" alt="logo" />
          <img src={octo} className="App-logo" alt="logo" />
        </div>
        </div>
        <div className="container">
        <ListOfStuff/>
          {this.state.alert}
          <InputBox addTask={this.addTask} />
          <TaskList taskList={this.state.taskList} deleteTask={this.deleteTask} />
        </div>
      </div>
    );
  }
}

class InputBox extends Component {

  constructor(props) {
    super(props)
    this.state = {text:''}
  }

  addItem = () => {
    if (this.state.text.length > 0) {
      // add task to list
      this.props.addTask(this.state.text)
      this.setState({text:''})
    }
  }

  handleChange = (e) => {
      this.setState({text: e.target.value})
  }


  render() {
    return (
 
    <div className="todo-list">
      <FormGroup bsSize="large" onSubmit={this.addItem} >
      <InputGroup >
      <FormControl value={this.state.text} type="text" onChange={this.handleChange} autoFocus placeholder="I need to..."></FormControl>
        <InputGroupButton><Glyphicon glyph="align-left" /><Button id="submit-btn" bsStyle="primary" onClick={this.addItem} value="submit">Add Task</Button></InputGroupButton>
      </InputGroup>
      </FormGroup>
    </div>

    );
  }
}

class TaskList extends Component {

  deleteTask = (e) => {
    //alert("deleting "+e.target.form.id)
    this.props.deleteTask(e.target.form.id)
  }

  render() {
    let tList = this.props.taskList.map( i => ( 
      <form id={i}>
      <ListGroupItem className="listItem">
        {i}
        <Button onClick={this.deleteTask} bsSize="xsmall">x</Button>
      </ListGroupItem>
      </form>
      )
    )

    if (tList.length === 0) {
      tList = <i>Your task list is empty.</i>
    }

    return (

      <ListGroup className="todo-list">
        <h1>My tasks</h1>
        {tList}
      </ListGroup>

    )
  }
}

class AlertBox extends Component {
  constructor(props) {
    super(props)
    this.state = {alertVisible: true}
  }

  handleAlertDismiss = (e) => {
    this.setState({alertVisible: false});
  }

  render() {
    if (this.state.alertVisible) {

      return (
        <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
          <h4>Success!</h4>
          <p>{this.props.message}</p>
        </Alert>
      ) 
    } else {
        return <p></p>
      }
  }
}

class ListOfStuff extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
  }

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }

  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }

  render() {
    return (
      <form onSubmit={this.addMessage.bind(this)}>
        <input type="text" ref={ el => this.inputEl = el }/>
        <input type="submit"/>
        <ul>
          { /* Render the list of messages */
            this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
          }
        </ul>
      </form>
    );
  }
}


export default App;
