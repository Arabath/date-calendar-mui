import { TableCell, Typography, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from "react";

import dayjs from 'dayjs';

const DynamicCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayjsSelectedDate = dayjs(selectedDate);

  const doctorAvailability = [
    { date: new Date(2024, 5, 5), availability: "high" }, // June 5th (high availability)
    { date: new Date(2024, 5, 6), availability: "medium" }, // June 6th (medium availability)
    { date: new Date(2024, 5, 7), availability: "none" }, // June 7th (no availability)
  ];

  const renderCell = (date, value) => {
    const availability = doctorAvailability.find(
      (availability) => availability.date.getTime() === date.getTime()
    );

    const color = availability?.availability === "high"
      ? "green"
      : availability?.availability === "medium"
        ? "yellow"
        : "red";

    return (
      <TableCell style={{ backgroundColor: color }}>
        <Typography variant="body2">{value}</Typography>
      </TableCell>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Appointment Date"
        value={dayjs(selectedDate)}
        onChange={(newValue) => {
          setSelectedDate(newValue);
        }}
        // Removed renderInput prop
        slots={{
          textField: CustomTextField // Define a custom TextField component
        }}
        views={["month"]}
        renderDay={(date, value) => renderCell(date, value)}
      />
    </LocalizationProvider>
  );
};

const CustomTextField = ({ inputProps, ...params }) => (
  <TextField {...inputProps} {...params} />
);

export default DynamicCalendar;
