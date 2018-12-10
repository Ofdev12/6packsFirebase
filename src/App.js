import React, { useState, useEffect } from 'react'

import firebase from 'firebase/app'
import 'firebase/firestore'
import './app.css'

const apiKey =
  process.env.REACT_APP_API_KEY || 'AIzaSyBgjQ-aMPoMk4y802oM57HUwAFSEBBlk10'
const projectId = process.env.REACT_APP_PROJECT_ID || 'yo-todo-d1229'

export const config = {
  apiKey: apiKey,
  authDomain: 'yo-todo-d1229.firebaseapp.com',
  databaseURL: 'https://yo-todo-d1229.firebaseio.com',
  projectId: projectId,
  storageBucket: 'yo-todo-d1229.appspot.com',
  messagingSenderId: '471773751736'
}

firebase.initializeApp(config)

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([])

  useEffect(() => {
    // update state when 'todos' collection changes
    const unsubscribe = db.collection('todos').onSnapshot(snap => {
      const todos = snap.docs.map(doc => doc.data())
      setTodos(todos)
    })
    return unsubscribe
  }, [])

  const handleSubmit = e => {
    e.preventDefault()

    const todo = {
      value: inputValue,
      quantity: 1,
      archived: false
    }

    db.collection('todos')
      .doc(todo.value)
      .set(todo)
    e.preventDefault()
    setInputValue('')
  }

  const handleChange = e => {
    setInputValue(e.target.value)
  }

  return (
    <div className="App">
      <div className="shop">
        <div className="block">
          <h2>Shopping list</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange={handleChange} />
            <input type="submit" value="add" />
          </form>
        </div>

        <div className="block">
          {todos &&
            todos.map((todo, i) => (
              <ul key={i}>
                <li>
                  <button
                    onClick={e =>
                      db
                        .collection('todos')
                        .doc(todo.value)
                        .update({ quantity: todo.quantity - 1 })
                    }
                  >
                    -
                  </button>
                  <span>( {todo.quantity} )</span>
                  <button
                    onClick={e =>
                      db
                        .collection('todos')
                        .doc(todo.value)
                        .update({ quantity: todo.quantity + 1 })
                    }
                  >
                    +
                  </button>
                  <span
                    className={todo.archived ? 'archived' : ''}
                    onClick={e =>
                      db
                        .collection('todos')
                        .doc(todo.value)
                        .update({ archived: !todo.archived })
                    }
                  >
                    {' '}
                    {todo.value}{' '}
                  </span>
                  <button
                    onClick={e =>
                      db
                        .collection('todos')
                        .doc(todo.value)
                        .delete()
                    }
                  >
                    x
                  </button>
                </li>
              </ul>
            ))}
        </div>
      </div>
    </div>
  )
}
export default App
