import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
    };
  }

  componentDidMount() {
    this.initWs();
  }

  initWs = () => {
    const ws = new WebSocket('ws://localhost:1234/ws');

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const newMessages = this.state.messages.slice(); // copy 
      newMessages.push(data.message);
      this.setState({
        messages: newMessages,
      });
      console.log(data);
    };

    ws.onclose = () => {
      console.log('socket closed :(');
    };
  }

  send = () => {
    const data = {
      message: this.state.value,
    };
    axios.post('/api/sendmessage', data)
      .then(() => {
        console.log('message sent!')
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input value={this.state.value} onChange={(e) => { this.setState({ value: e.target.value }); }} />
          <button onClick={this.send}>Send</button>
          {this.state.messages.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </header>
      </div>
    );
  }
}

export default App;
