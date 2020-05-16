import React from 'react'
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Ajax from './ajax';
import moment from 'moment';


export default class Table extends React.Component {
  
  constructor(props, event) {
    super(props);

    //Копия собранной таблицы, чтобы отправить в state
    this.dataTable = [];
    //Копия загаловков проектов, чтобы отправить в state
    this.rowHeadersString = [];
    //Шаблон для строки таблицы
    this.rowTableExample = 
    {
      1: { value: '', comment: '' },
      2: { value: '', comment: '' },
      3: { value: '', comment: '' },
      4: { value: '', comment: '' },
      5: { value: '', comment: '' },
      6: { value: '', comment: '' },
      7: { value: '', comment: '' },
      total: ``
    };
    //Шаблон для шаблона строки таблицы
    this.rowTableSample = 
    {
      1: { value: '', comment: '' },
      2: { value: '', comment: '' },
      3: { value: '', comment: '' },
      4: { value: '', comment: '' },
      5: { value: '', comment: '' },
      6: { value: '', comment: '' },
      7: { value: '', comment: '' },
      total: 0
    };

    //Значения для каждого проекта
    this.valuesForProject = [];

    //Дни из запроса для определенного проекта
    this.daysForValues = [];

    //Все изменения
    this.allChanges = [];
    //Шаблон для сохранения
    this.changeString = {
      date: '',
      employeeId: 0,
      projectId: 0,
      value: 0
    }
    
    
    this.state = {
      
      //Вверхняя навигация
      nestedHeadersDate: [
        { day: 'day1' }, { day: 'day2' }, { day: 'day3' },
        { day: 'day4' }, { day: 'day5' }, { day: 'day6' },
        { day: 'day7' },
      ], 

      //Боковая навигация
      rowHeadersString: [],
      projects: [],

      //Запрос
      dataRequest: [],

      //Дни с каллендаря 
      selectedDays: {},
      //Выбранные проекты
      selectedProjects: {},
      
      //Данные, которые вносятся в таблицу
      dataTable: this.rowTableExample,

      updateButton: null,

      //Длина для стобца проектов
      rowHeaderWidth: 50,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot,props) {
    if (prevProps.selectedProjects !== this.props.selectedProjects ) {
      this.setState(props => {
        return {
         selectedProjects: this.props.selectedProjects,
        }
      })
    }
    if ( (prevProps.selectedWorker !== this.props.selectedWorker) || //prevState.selectedWorker !== this.state.selectedWorker) ||
         prevProps.selectedDays !== this.props.selectedDays //|| prevState.selectedDays !== this.state.selectedDays
       ) 
    { 
      //console.log(this.props)
      //console.log(prevProps)

      this.setState((state, props) => {return {
        //selectedDays: props.selectedDays,
        selectedWorker: this.props.selectedWorker,

        nestedHeadersDate: [
          {  day: `${moment(this.props.selectedDays[0]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[1]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[2]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[3]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[4]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[5]).format('YYYY-MM-DD')}`},
          {  day: `${moment(this.props.selectedDays[6]).format('YYYY-MM-DD')}`}
        ],
  
      }})

      
      //Создание таблицы
      Ajax(`http://localhost:8010/proxy/projects/byUser/${this.props.selectedWorker}`)
        .then(data => {
          console.log(data)
          if (data.length !== 0) {
            
            this.maxLength = 3;
            for (let i = 0; i < data.length; i++) {
              this.rowHeadersString.push(data[i].name)
              this.dataTable.push(this.rowTableExample)

              if (data[i].name.length > this.maxLength)
                this.maxLength = data[i].name.length
            }
            //console.log(this.maxLength)
            this.setState({
              rowHeaderWidth: this.maxLength * 10,
              rowHeadersString: this.rowHeadersString,
              projects: data,
              dataTable: this.dataTable
            })
            
            this.rowHeadersString = [];
            this.dataTable = [];
          }

          else {
            this.setState({
              rowHeadersString: 'Добавьте проект',
              rowHeaderWidth: 200,
              dataTable: this.rowTableExample
            })
          }

            
        })


      //Заполнение данных таблицы
      Ajax(`http://localhost:8010/proxy/costs/byUser/${this.props.selectedWorker}/${moment(this.props.selectedDays[0]).format('YYYY-MM-DD')}/${moment(this.props.selectedDays[6]).format('YYYY-MM-DD')}`)
        .then(req => {
          this.setState({
            dataRequest: req
          })
          console.log('--1 Данные таблицы: '); console.log(this.state.dataRequest);
        })
        .then(
          (result) => {
            if (this.state.dataRequest.length !== 0 && this.state.dataRequest[0].date) {
              console.log('Projects: ');console.log(this.state.projects)
              this.state.projects.map((item,i) => {
                this.number = i;
                this.state.dataRequest.forEach( item => {
                  console.log('work')
                  if (item.projectId === this.state.projects[this.number].id) {
                    console.log('--2 dataRequest:');console.log(item)
                    this.valuesForProject.push(item)
                  }
                })
                if (this.valuesForProject.length !== 0) {
                  console.log('--3 valuesForProject:'); console.log(this.valuesForProject)
                  this.valuesForProject.forEach((item, i) => {
                    this.ii = i;
                    this.state.nestedHeadersDate.forEach((item, i) => {
                      if (item.day === this.valuesForProject[this.ii].date) {
                        this.rowTableSample[(i + 1)].value = this.valuesForProject[this.ii].value;
                      }
                    })
                    if (this.rowTableExample !== this.rowTableSample) {
                      this.summ = 0;
                      for (let i=1; i <= 7; i++) {
                        if(typeof(this.rowTableSample[i].value) == typeof(0) ) 
                        this.summ += this.rowTableSample[i].value 
                      }
                      this.rowTableSample.total = this.summ;  
                    }
                    //console.log('--4 dataTableEx:'); console.log(this.dataTableExampleVirtual)
                    //console.log('--5 dataTable'); console.log(this.dataTable)
                  })
                  this.dataTable.push(this.rowTableSample);
                  this.rowTableSample = {
                    1: { value: '', comment: '' },
                    2: { value: '', comment: '' },
                    3: { value: '', comment: '' },
                    4: { value: '', comment: '' },
                    5: { value: '', comment: '' },
                    6: { value: '', comment: '' },
                    7: { value: '', comment: '' },
                    total: 0
                  };
                }
                else {
                  this.dataTable.push(this.rowTableSample)
                }
                this.valuesForProject = [];
                return null;
              })
              this.setState({
                dataTable: this.dataTable
              })
            }
            // else {

            // }
          },
          (error) => {
            console.log(error)
          }
        )
      
    }
  }

  saveTable = () => {
    console.log('allChanges: ');console.log(this.allChanges)
    Ajax(`http://localhost:8010/proxy/costs/save`, 'POST', this.allChanges)
    
  }

  updateProjects = () => {
    // {
    //   "fullName": "string",
    //     "id": 0,
    //       "projects": [
    //         {
    //           "checked": true,
    //           "id": 0,
    //           "name": "string"
    //         }
    //       ]
    // }
    this.updateProjectsString = {
      id: 0,
      projects: []
    }
    //console.log(this.props.selectedWorker);
    this.updateProjectsString.id = this.props.selectedWorker;
    this.state.selectedProjects.forEach((item,i) => {
      //this.updateProjectsString.fullName = worker
      item.checked = true
      this.updateProjectsString.projects.push(item)
    })
    console.log(this.updateProjectsString)
    Ajax(`http://localhost:8010/proxy/users/saveSettings`, 'POST',this.updateProjectsString)
  }
  
  render() {
    
    return (
      <>
        <HotTable 
          data={this.state.dataTable}
          
          //Настройки handsontable
          width= "auto"
          height= "auto"
          licenseKey= "non-commercial-and-evaluation"
          formulas= 'true'
          contextMenu= 'true'
          rowHeaderWidth = {this.state.rowHeaderWidth}

          //Валидация
          columns= {[
            { data: '1.value', type: 'numeric' },
            { data: '1.comment', type: 'text' },

            { data: '2.value', type: 'numeric' },
            { data: '2.comment', type: 'text' },

            { data: '3.value', type: 'numeric' },
            { data: '3.comment', type: 'text' },

            { data: '4.value', type: 'numeric' },
            { data: '4.comment', type: 'text' },

            { data: '5.value', type: 'numeric' },
            { data: '5.comment', type: 'text' },

            { data: '6.value', type: 'numeric' },
            { data: '6.comment', type: 'text' },

            { data: '7.value', type: 'numeric' },
            { data: '7.comment', type: 'text' },

            { data: 'total', type: 'numeric', readOnly: true }
          ]}
                      
          rowHeaders = {this.state.rowHeadersString}
          nestedHeaders= {
            [[
              { label: this.state.nestedHeadersDate[0].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[1].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[2].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[3].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[4].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[5].day, colspan: 2 },
              { label: this.state.nestedHeadersDate[6].day, colspan: 2 },
              { label: 'Итого', colspan: 1 }
            ]]
          }

          //Слежение за изменениями
          observeChanges='true'
          afterChange = {(changes) => {
            if (!changes) {
              return;
            }
            if (changes !== null) {
              console.log(`Изменения:`); console.log(changes)

              if (changes[0][1].slice(2) === 'value') {
                //projectId
                this.state.projects.forEach((item, i) => {
                  if (i === changes[0][0])
                    this.changeString.projectId = item.id
                })
                //date
                this.state.nestedHeadersDate.forEach((item, i) => {
                  if ((i + 1) === Number(changes[0][1][0]))
                    this.changeString.date = item.day
                })
                //employeeId
                this.changeString.employeeId = Number(this.state.selectedWorker)
                //value
                this.changeString.value = changes[0][3]
              }
              
              // if (changes[0][1].slice(2) === 'comment') {
              //   //projectId
              //   this.state.projects.forEach((item, i) => {
              //     if (i === changes[0][0])
              //       this.changeString.projectId = item.id
              //   })
              //   //date
              //   this.state.nestedHeadersDate.forEach((item, i) => {
              //     if ((i + 1) === Number(changes[0][1][0]))
              //       this.changeString.date = item.day
              //   })
              //   //employeeId
              //   this.changeString.employeeId = this.state.selectedWorker
              //   //value
              //   this.changeString.value = changes[0][3]
              // }
            
            
            this.allChanges.push(this.changeString)
            this.changeString = {
              date: '',
              employeeId: 0,
              projectId: 0,
              value: 0
            }
            this.setState({
                updateButton: true
              })
            }

            //changes.array - [номер строки, индификатор столбца, прошлое значение, новое значение]
            
          }}
        />
        {
          this.state.updateButton &&
            <div className="col">
              <input className="btn btn-primary mt-4" type="submit" value="Сохранить" onClick={this.saveTable}/>
            </div>
        }
        { 
          //console.log(this.props.selectedProjects)}{
          //console.log(this.state.selectedProjects)}{
          this.state.selectedProjects.length > 0 &&
            <div className="col-2">
              <input className="btn btn-primary mt-4" type="submit" value="добавить" onClick={this.updateProjects} />
            </div>
        }
      </>
      
      
    )
  }
}