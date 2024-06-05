import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useQuery } from '@tanstack/react-query'
import { fetchDates } from '../services/fetchDates';

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */

//
function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();//cantidad total de días mes seleccionado
      const daysToHighlight = [1,2,3,4,5,6,7].map(() => getRandomNumber(3, daysInMonth));
      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

//devuelve un array de 3 espacios con numeros aleatorios entre 3 y el numero de dias totales del mes seleccionado 
//[10,16,20]

const time = new Date().toISOString();
const initialValue = dayjs(time);

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !props.outsideCurrentMonth && highlightedDays?.indexOf(props.day.date()) >= 0;
  
  // console.log("props-->",props.day.toString())

  return (
    <Badge
    key={props.day.toString()}
    overlap="circular"
    badgeContent={isSelected ? (
      <span style={{ color: 'green' }}>⬤</span>
    ) : undefined}
  >
    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
  </Badge>
  );
}
//devuelve los dias que son marcados '🌚'

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  
  const {data} = useQuery({
    queryKey: ['fetchDates'],
    queryFn: fetchDates
  })


   const datum = [
    { Fecha: '2024-06-08', TurnosDisponibles: 45, HorariosDisponibles: 16 },
    { Fecha: '2024-06-10', TurnosDisponibles: 84, HorariosDisponibles: 30 },
    { Fecha: '2024-06-11', TurnosDisponibles: 84, HorariosDisponibles: 30 },
  ];

  // const datum =  data?.data
  // console.log('datum', datum)
  const dateExtractor = (datum) => {
    const fechas = [];

    for(const ob of datum ) {
      if (ob && ob.Fecha) {
        fechas.push(ob.Fecha)
      }
    }
    return fechas;
  }

  const fechasExtraidas = dateExtractor(datum)
  console.log("fechasExtraidas",fechasExtraidas)
  console.log(typeof(fechasExtraidas))

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
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
