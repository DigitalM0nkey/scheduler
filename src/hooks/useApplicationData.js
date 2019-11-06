import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.value
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value[0].data,
        appointments: action.value[1].data,
        interviewers: action.value[2].data
      };
    case SET_INTERVIEW:
      return { ...state, appointments: action.value };
    case SET_SPOTS:
      const newDays = spotsRemaining(state, action);
      return { ...state, days: newDays };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const initialValue = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

const spotsRemaining = (state, action) => {
  const updatedDays = state.days;

  updatedDays.forEach(day => {
    if (day.appointments.includes(action.value)) {
      action.func ? day.spots-- : day.spots++;
    }
  });
  return updatedDays;
};

export default function useApplicationData(props) {
  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: all
      });
    });
  }, []);

  const bookInterview = (id, interview) => {
    const isUpdate = state.appointments[id];
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => {
        if (!isUpdate) {
          dispatch({ type: SET_SPOTS, value: id, func: true });
        }
      });
  };

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => dispatch({ type: SET_SPOTS, value: id, func: false }));
  };

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  return { state, setDay, bookInterview, cancelInterview };
}
