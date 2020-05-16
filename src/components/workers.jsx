import React, { Component } from 'react';
import Ajax from './ajax.js';
//import Loader from './Loader/loader';
//import formInput from './componenrs/formInput';

class Workers extends Component {

  constructor(props) {
    super(props)
    this.data = [];
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      error: 'Не все формы заполненны',
      value: '...'
    };
  }
  
  handleChange(event, props) {
    this.setState({ value: event.target.value })
    this.props.getWorker(event.target.value)
  }

  async componentDidMount() {
    Ajax(`http://localhost:8010/proxy/users`)
    .then(data => {
      this.data = data; //работает
      this.setState({
        data //не работает
      })
    })
  }
  
  render() {
    return (
      <>
        <label htmlFor="workers">
          <b>Сотрудник</b>
        </label>
        <div className="wworkers">

          <select className="form-control" id="workers"  onChange={this.handleChange}>
            <option value={0} selected>{'...'}</option>
            {
              this.data.map(item => (
                <option value={item.id}>{item.fullName}</option>
              ))
            }
          </select>
          
        </div>
      </>
    )
  }
}

export default Workers;