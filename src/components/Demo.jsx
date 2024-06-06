import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchDates } from "../services/fetchDates";

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);

  const { data } = useQuery({
    queryKey: ["fetchDates"],
    queryFn: fetchDates,
  });

  console.log(data?.data);
  const datum = data?.data

  const dateExtractor = (date) => {
    const days = [];

    for (const ob of date) {
      if (ob && ob.Fecha) {
        const day = parseInt(ob.Fecha.slice(8, 10));
        days.push(day);
      }
    }

    return days;
  };

  function fakeFetch({ signal }) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const daysToHighlight = dateExtractor(datum);
        console.log("daysToHighlight", daysToHighlight);
        resolve({ daysToHighlight });
      }, 500);

      signal.onabort = () => {
        clearTimeout(timeout);
        reject(new DOMException("aborted", "AbortError"));
      };
    });
  }

  const fetchHighlightedDays = () => {
    const controller = new AbortController();
    fakeFetch({ signal: controller.signal })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays();
    return () => requestAbortController.current?.abort();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        loading={isLoading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
    </LocalizationProvider>
  );
}

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays?.indexOf(props.day.date()) >= 0;
  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? <span style={{ color: "green" }}>⬤</span> : undefined
      }
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}
