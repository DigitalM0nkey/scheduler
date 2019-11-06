import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

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
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const newDays = spotsRemaining(state, action);
      let newState = { ...state, days: newDays, appointments };
      return newState;

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
  const updatedDays = [...state.days];

  updatedDays.forEach((day, index) => {
    if (day.appointments.includes(action.id)) {
      if (action.func === "create") {
        updatedDays[index] = { ...day, spots: day.spots - 1 };
      } else if (action.func === "delete") {
        updatedDays[index] = { ...day, spots: day.spots + 1 };
      } else {
        updatedDays[index] = { ...day, spots: day.spots };
      }
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
    const isUpdate = state.appointments[id].interview;

    const func = isUpdate && isUpdate.student ? "update" : "create";

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview, func: func }));
  };

  const cancelInterview = id => {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() =>
        dispatch({ type: SET_INTERVIEW, id, interview: null, func: "delete" })
      );
  };

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  return { state, setDay, bookInterview, cancelInterview };
}
