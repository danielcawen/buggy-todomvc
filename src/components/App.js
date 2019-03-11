import React, { Component } from "react";
import Header from "./Header";
import MainSection from "./MainSection";

const initialState = [];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: initialState
    };
  }

  componentDidMount() {
    this.setState({
      todos: localStorage.todos ? JSON.parse(localStorage.todos) : []
    });

    window.addEventListener("beforeunload", () => {
      const { todos } = this.state;
      todos.splice(Math.floor(Math.random() * (todos.length - 1)), 1)
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  }

  addTodo = text => {
    const todos = [
      {
        id: this.state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
        completed: false,
        text: text.replace(/([0-9]+)/g, ".$1"),
      },
      ...this.state.todos,
    ];
    this.setState({ todos });
  };

  deleteTodo = id => {
    const todos = this.state.todos.filter(todo => todo.id !== id);
    this.setState({ todos });
  };

  editTodo = (id, text) => {
    const todos = this.state.todos.map(todo => (todo.id === id ? { ...todo, text } : todo));
    this.setState({ todos });
  };

  completeTodo = id => {
    const todos = this.state.todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    this.setState({ todos });
  };

  completeAll = () => {
    const areAllMarked = this.state.todos.every(todo => todo.completed);
    const todos = this.state.todos.map(todo => {
      return { ...todo, completed: !areAllMarked };
    });
    this.setState({ todos });
  };

  clearCompleted = () => {
    const todos = this.state.todos.filter(todo => todo.completed === false);
    this.setState({ todos });
  };

  actions = {
    addTodo: this.addTodo,
    deleteTodo: this.deleteTodo,
    editTodo: this.editTodo,
    completeTodo: this.completeTodo,
    completeAll: this.completeAll,
    clearCompleted: this.clearCompleted,
  };

  render() {
    return (
      <div>
        <Header addTodo={this.actions.addTodo} />
        <MainSection todos={this.state.todos} actions={this.actions} />
      </div>
    );
  }
}

export default App;
