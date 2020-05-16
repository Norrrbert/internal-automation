import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ru';
import moment from 'moment';


export default class WeekPicker extends React.Component {
  
  state = {
    hoverRange: undefined, //диапазон наведения
    selectedDays: [],
  };


  handleWeekClick = (weekNumber, days, e) => {
    // this.setState({
    //   selectedDays: days,
    // });

    if (days[0] === days[1]) {
      days = []
      var startOfWeek = moment().startOf('week');
      var endOfWeek = moment().endOf('week');

      var day = startOfWeek;

      while (day <= endOfWeek) {
        days.push(day.toDate());
        day = day.clone().add(1, 'd');
      }
    }
    console.log(days)

    console.log(weekNumber)

    this.props.getDays(days);
    console.log('v calendar, days: ' + typeof(days))
    //(weekNumber, days, e) => { this.props.updateData(this.state.selectedDays) }
  };

  render() {
    const { hoverRange, selectedDays } = this.state;

    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
    };

    return (
      <div className="SelectedWeek ">
        <DayPicker
          //selectedDays={selectedDays}
          showWeekNumbers
          showOutsideDays
          modifiers={modifiers}
          onWeekClick = {this.handleWeekClick}
          localeUtils={MomentLocaleUtils}
          locale="ru"

        />
      </div>
    );
  }
}


/* <div className="row justify-content-center">
          <input type="text" name='calendar' 
            className="form-control w-auto" 
            Value={
            `${moment(selectedDays[0]).format('LL')} - ${moment(selectedDays[6]).format('LL')}`
          } onChange={
            this.handleChange
          } />
        </div> */
