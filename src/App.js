import React, { Component } from 'react'

import firebase from 'firebase/app'
import 'firebase/firestore'
import "./app.css"

const apiKey    = process.env.REACT_APP_API_KEY || "AIzaSyBgjQ-aMPoMk4y802oM57HUwAFSEBBlk10"
const projectId = process.env.REACT_APP_PROJECT_ID || "yo-todo-d1229"

var config = {
    apiKey: "AIzaSyBgjQ-aMPoMk4y802oM57HUwAFSEBBlk10",
    authDomain: "yo-todo-d1229.firebaseapp.com",
    databaseURL: "https://yo-todo-d1229.firebaseio.com",
    projectId: "yo-todo-d1229",
    storageBucket: "yo-todo-d1229.appspot.com",
    messagingSenderId: "471773751736"
  };
firebase.initializeApp(config)

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

class App extends Component {

  state = {
    inputValue: '',
    todos: []
  }

  handleSubmit = e => {
    e.preventDefault()

    const todo = {
      value: this.state.inputValue,
      quantity: 1,
      archived: false
    }

    db.collection('todos').doc(todo.value).set(todo)
    e.preventDefault()
    this.setState({ inputValue: ''})
  }

  handleChange = e => {
    this.setState({ inputValue: e.target.value })
  }


  componentDidMount() {
    // update state when 'todos' collection changes
    this.unsubscribe = db.collection('todos')
      .onSnapshot(snapshot => {
        const todos = []
        snapshot.forEach(doc => todos.push(doc.data()))

        this.setState({ todos })
      })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <div className="App">
        <div className="shop">

          { /* Add a new entry */ }
          <div className="block">
            <h2>Shopping list</h2>
            <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.inputValue} onChange={this.handleChange} />
              <input type="submit" value="add" />
            </form>
          </div>

          { /* Modify an entry */ }
          <div className="block">
            { this.state.todos.map((todo, i) =>
              <ul key={i}>
                <li>
                  <button onClick={e => db.collection('todos').doc(todo.value).update({ quantity: todo.quantity - 1 })}>-</button>
                  <span>( {todo.quantity} )</span>
                  <button onClick={e => db.collection('todos').doc(todo.value).update({ quantity: todo.quantity + 1 })}>+</button>
                  <span className={ todo.archived ? "archived" : "" } onClick={e => db.collection('todos').doc(todo.value).update({ archived : !todo.archived })}> {todo.value} </span>
                  <button onClick={e => db.collection('todos').doc(todo.value).delete()}>x</button>
                </li>
              </ul>) }
          </div>

        </div>
      </div>
    )
  }
}
export default App
