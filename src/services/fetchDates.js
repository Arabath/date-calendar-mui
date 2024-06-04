import axios from 'axios';

export const fetchTime = async ({ fecha }) => {
    try {
        const response = await axios.get(`http://localhost:3000/timeservice/${fecha}`)
        return response.data
    } catch(error) {
        throw new Error(`HTTP error! status: ${error.response.status}`)
    }
}