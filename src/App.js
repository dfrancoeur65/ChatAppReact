import React from 'react'

function reducer(state,action){
  if(action.type ==='ADD-MESSAGE'){
  return {
        messages: state.messages.concat(action.message),
        users:["Daniel","Michael"]
      };
  } else if (action.type ==='DELETE-MESSAGE'){
    return{messages: [
        ...state.messages.slice(0,action.index),
        ...state.messages.slice(action.index+1,state.messages.length )  ],
      users:["Daniel","Michael"]};

  } else {
    return state
  };
};


const initialState = {
  messages:[
    {text:"This is awesome",user:"Daniel"},],
    users:["Daniel","Michael"]
  };

const store = createStore(reducer,initialState);

function createStore(reducer,initialState) {
  let state = initialState;

  const listeners = [];
  const getState = () => (state);

  const subscribe = (listener) =>{
    listeners.push(listener);
  }
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l=>l());
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default class App extends React.Component {
  componentDidMount(){
    store.subscribe(() => this.forceUpdate());
  }

  render(){
    const messages = store.getState().messages;
    const users = store.getState().users;
    return(
      <div className = 'ui segment'>
        <MessageView
          messages = {messages}
        />
        <InputView
          users = {users}
        />
      </div>
    );
  }
}

class InputView extends React.Component{


  render(){
    const users  = this.props.users.map((user,index) =>(
      <div className='row'>
      <div className = 'column'>

        <MessageInput
        user = {user}
        key = {index}
        />
      </div>
      </div>
     ));
  return(
    <div className='ui one column grid'>
      {users}
    </div>
  );
  }
}

class MessageView extends React.Component {

  handleClick = (index) =>{
    store.dispatch({
      type: 'DELETE-MESSAGE',
      index:index
    });
  }


  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className='ui comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
      <div className='content'>
        <a className = 'user'>{message.user}</a>
          <div className='text'>
            {message.text}
          </div>
        </div>
      </div>
    ));
    return (
      <div className='ui comments'>
      <h3 className='ui dividing header'>Chat Feed</h3>
        {messages}
      </div>
    );
  }
}

class MessageInput extends React.Component {

  state = {
    value: '',
    user:this.props.user
  };

  onChange = (e) => {
    this.setState({
      value:e.target.value,
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type:'ADD-MESSAGE',
      message: {
        text:this.state.value,
        user: this.state.user
      }
    });

    this.setState({
      value:'',
    });
  };

  render(){
    return(

    <div className ='ui left icon input'>
      <a className = 'ui label'>{this.state.user}</a>
      <input
        type='text'
        placeholder='Message...'
        value={this.state.value}
        onChange={this.onChange}
        />
      <button
        onClick={this.handleSubmit}
        className='ui primary button'
        type='submit'
        > Submit
      </button>
    </div>
  );
}

}
