import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchDates } from "../services/fetchDates";

export default function DateCalendarServerRequest() {
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedDays, setHighlightedDays] = useState([]);

  const { data } = useQuery({
    queryKey: ["fetchDates"],
    queryFn: fetchDates,
  });

  useEffect(() => {
    if (data) {
      const daysToHighlight = dateExtractor(data.data);
      setHighlightedDays(daysToHighlight);
      setIsLoading(false);
    }
  }, [data]);

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

  const ServerDay = (props) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected =
      !outsideCurrentMonth && highlightedDays?.includes(day.date());
    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? <span style={{ color: "green" }}>⬤</span> : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  };

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
