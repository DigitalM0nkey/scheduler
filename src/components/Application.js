import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "../helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      // .then(response => {
      //   return setState(prev => ({ ...prev, days: response.data }));
      // }),
      axios.get(`http://localhost:8001/api/appointments`)
      // .then(response => {
      //   return setState(prev => ({ ...prev, appointments: response.data }));
      // })
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data
      }));
      console.log(all);
    });
  }, []);

  // axios.get(`http://localhost:8001/api/days`).then(response => {
  //   setState(prev => ({ ...prev, days: response.data }));
  // }),

  const setDay = day => setState(prev => ({ ...prev, day }));

  const scheduledAppointments = getAppointmentsForDay(state, state.day).map(
    appointment => {
      return <Appointment key={appointment.id} {...appointment} />;
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {scheduledAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
