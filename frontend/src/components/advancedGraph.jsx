import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { calculateBookingLength } from './Helpers';
import { BackendUrl } from './BackendUrl';

const AdvancedGraph = ({ userHostedListings }) => {
  const [data, setData] = useState([]);
  const [cumulativeProfit, setCumulativeProfit] = useState(null);
  const [title, setTitle] = useState('');
  const token = localStorage.getItem('token');
  let userEmail = null;
  if (token) {
    userEmail = JSON.parse(localStorage.getItem('userinfo')).email;
  }

  useEffect(() => {
    // Fetch all bookings data
    fetch(`${BackendUrl}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error('Failed: ' + response.status);
        }
        return response.json();
      })
      .then((bookingData) => {
        const userBookings = bookingData.bookings;

        // Filter bookings made to the host's listings and has status 'accepted'
        const acceptedBookings = userBookings.filter((booking) => {
          const hostedListingIds = userHostedListings.map((hostedListing) => String(hostedListing.id));
          return hostedListingIds.includes(String(booking.listingId)) && booking.status === 'accepted';
        });

        // Calculate cumulative profit per day in the past 30 days
        const today = new Date();
        const profitData = [];
        let totalProfit = 0;

        for (let i = 0; i < 31; i++) {
          const currentDate = new Date();
          currentDate.setDate(today.getDate() - i);

          const dailyProfit = acceptedBookings
            .filter((booking) => {
              const bookingStartDate = new Date(booking.dateRange.start);
              const bookingEndDate = new Date(booking.dateRange.end);
              // Check if the booking spans the currentDate, A booking's length (in days) is defined based on how many nights a user spends at the listed property
              // e.g. a booking from the 15th to the 17th of November consists of 2 days in length
              // thus we count profit from startdate to the day before enddate
              return (
                bookingStartDate <= currentDate &&
                currentDate < bookingEndDate
              );
            })
            .reduce((sum, booking) => {
              const nights = calculateBookingLength(
                booking.dateRange.start,
                booking.dateRange.end
              );

              return sum + booking.totalPrice / nights;
            }, 0);
          totalProfit += dailyProfit;
          profitData.push({
            day: i,
            profit: dailyProfit.toFixed(2), // Round to 2 decimal places
          });
        }

        setData(profitData);
        setCumulativeProfit(totalProfit.toFixed(2));
        // Format current date and date 30 days ago
        const formattedCurrentDate = today.toLocaleDateString('en-GB');
        let formattedPastDate = new Date();
        formattedPastDate.setDate(formattedPastDate.getDate() - 30);
        formattedPastDate = formattedPastDate.toLocaleDateString('en-GB');

        // Set the title with formatted dates
        setTitle(`Listing Profits Graph (Past Month ${formattedCurrentDate} to ${formattedPastDate})`);
      })
      .catch((error) => {
        console.error('Error fetching booking data:', error);
      });
  }, [userEmail]);

  return (
    <Box marginY={3} marginLeft={2} marginRight={2} maxWidth="100%">
      <Typography variant="h6"> {title} </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" label={{ value: 'How many days ago', position: 'insideBottom', offset: -10 }} />
          <YAxis label={{ value: 'Total $$ made', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      {cumulativeProfit !== null && (
        <Typography variant="body1">Cumulative Profit in past 30 days: ${cumulativeProfit}</Typography>
      )}
    </Box>
  );
};

export default AdvancedGraph;
