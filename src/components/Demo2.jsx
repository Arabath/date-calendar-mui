import React, { useState } from 'react';
import { Calendar, DateObject } from 'react-multi-date-picker';
import { enUS } from 'date-fns/locale';
import { Paper, Box, Grid } from '@mui/material';

const available = 'background-color: green;'
const limited = 'background-color: yellow' 
const unavailable = 'background-color: red;'

const generateRandomAvailability = () => {
  const availabilityOptions = ['available', 'limited', 'unavailable'];
  const randomIndex = Math.floor(Math.random() * availabilityOptions.length);
  return availabilityOptions[randomIndex];
};

const generateAvailabilityData = () => {
  const availabilityData = {};
  for (let i = 1; i <= 31; i++) {
    const availability = generateRandomAvailability();
    availabilityData[i] = availability;
  }
  return availabilityData;
};

const DoctorCalendar = () => {
  const [availability, setAvailability] = useState(generateAvailabilityData());

  const handleDateChange = (value) => {
    // Handle date change if needed
  };

  const renderDayColor = (date) => {
    const dayOfMonth = DateObject(date).day();
    const availabilityStatus = availability[dayOfMonth];
    switch (availabilityStatus) {
      case 'available':
        return available;
      case 'limited':
        return limited;
      case 'unavailable':
        return unavailable;
      default:
        return '';
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box p={2}>
              <Calendar
                multiple
                value={[]}
                onChange={handleDateChange}
                locale={enUS}
                renderDayColor={renderDayColor}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DoctorCalendar;
