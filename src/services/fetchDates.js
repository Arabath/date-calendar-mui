import axios from 'axios';

export const fetchDates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/dates/RE');
      const data = response.data;
      //console.log("the response body from fetchDates -->", data);
      return data;
    } catch (error) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    }
  };
  