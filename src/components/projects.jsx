import React, {Component} from 'react'
import Ajax from './ajax'
import { Multiselect } from 'multiselect-react-dropdown';


class Projects extends Component {

  constructor(props) {
    super(props)
    this.state = {
      options: this.data,
      error: 'Не все формы заполненны',
      data: []
    };
  }

  // async componentDidUpdate(prevProps) {
  //   if (this.props.idWorker !== prevProps.idWorker) {

  //     console.log('allo')

  //     Ajax(`http://localhost:8010/proxy/projects/byUser/${this.props.idWorker}`)
  //       .then(data => {
  //         //this.data = data; //работает
  //         console.log(data)
  //         this.setState({
  //           data //отдельно не работает, но без этого тоже
  //         })
  //       })

  //   }
  // }

  async componentDidMount() {
    Ajax(`http://localhost:8010/proxy/projects/`)
      .then(data => {
        this.setState({
          data
        })
      })
  }


  onSelect = (selectedList, selectedItem, props) => {
      console.log(selectedItem)
    console.log(typeof(Object.entries(selectedList)))
    this.selectedItems = selectedList;
      this.props.getProjects(this.selectedItems)
  }

  onRemove(selectedList, removedItem) {
      console.log('ok')
  }

  render() {
    return (
      <>
        <label htmlFor="projects">
          <b>Проекты</b>
        </label>
        {/* <div className="col-2">
          <input className="btn btn-primary mt-4" type="submit" value="добавить" onClick={this.updateProjects} />
        </div>
        <div className="col-2">
          <input className="btn btn-primary mt-4" type="submit" value="удалить" onClick={this.updateProjects} />
        </div> */}
        <Multiselect
          options={this.state.data} // Options to display in the dropdown
          selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
          onSelect={this.onSelect} // Function will trigger on select event
          onRemove={this.onRemove} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
          //displayValue="key"
          showCheckbox={true}
          placeholder="..."
          closeOnSelect={false}
          id={
            this.state.data.map(item => (
            item.id
          ))
        }
        />
      </>
    )
  }
}


export default Projects;