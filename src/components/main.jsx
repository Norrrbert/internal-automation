import React from 'react';
import WeekPicker from './Calendar/calendar';
import Table from './table';
import Workers from './workers';
import Projects from './projects';


export default class Main extends React.Component {

  state = {
    selectedDays: {},
    selectedWorker: {},
    selectedProjects: []
  }

  getDays = value => {
    this.setState({
      selectedDays: value
    })
  }
  getWorker = value => {
    this.setState({
      selectedWorker: value
    })
  }
  getProjects = (value) => {
    console.log(value)
    this.setState({
      selectedProjects: value
    })
    console.log(this.state.selectedProjects)
  }

  render() {
    return (
      <div className="App-main">
        {console.log(this.state.selectedProjects)}
        <section className="App-sec-1 container-fluid">
          <div className="row">
            <div className="col-2 full-width">
              <Workers getWorker={this.getWorker}/>
            </div>
            <div className="col-4">
              <b>Неделя</b> <WeekPicker getDays={this.getDays} />
            </div>
          </div>
        </section>
        <section className="App-sec-2 container-fluid">
          <hr />
          <Table selectedDays={this.state.selectedDays}
                 selectedProjects={this.state.selectedProjects}
                 selectedWorker={this.state.selectedWorker}
          />
          <div className="row">
            <div className="col-2">
              <Projects getProjects={this.getProjects} idWorker={this.state.selectedWorker} />
            </div>
          </div>
        </section>
      </div>
    )

  }
  
  
}
