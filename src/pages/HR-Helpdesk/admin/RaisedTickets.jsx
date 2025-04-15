
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserProfile from '../../../hooks/UserData/useUser';
import LeftNav from './leftnav';
import TicketDetails from './TicketDetails';
import TicketDetailsHR from './ticketdetailsHR';
import LeftNavHR from './leftnavHR';

const fetchTicketsByOrganization = async (organisationId) => {
  const response = await axios.post(`${process.env.REACT_APP_API}/route/tickets-by-organization`, {
    organisationId,
  });
  return response.data.tickets;
};

const RaisedTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { organisationId } = useParams();

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const adminId = user?._id;
  const userRole = user?.profile || []; // Assuming `profile` contains an array of roles (e.g., ['HR', 'Hr-Admin'])

  const { data: tickets, error, isLoading, isError } = useQuery(
    ['tickets', organisationId],
    () => fetchTicketsByOrganization(organisationId),
    { enabled: !!organisationId }
  );

  const handleTicketSelect = (ticket) => setSelectedTicket(ticket);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '93%',
        width: '100%',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {/* Left Navigation */}
      <div
        style={{
          flex: '0 0 300px', // Fixed width for LeftNav
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #ddd',
          overflow: 'hidden',
        }}
      >
        {userRole.includes('Hr-Admin') ? (
          <LeftNav
            tickets={tickets}
            isLoading={isLoading}
            isError={isError}
            error={error}
            selectedTicket={selectedTicket}
            onSelectTicket={handleTicketSelect}
          />
        ) : 
          <LeftNavHR
            tickets={tickets}
            isLoading={isLoading}
            isError={isError}
            error={error}
            selectedTicket={selectedTicket}
            onSelectTicket={handleTicketSelect}
          />
          }
      </div>

      {/* Ticket Details */}
      <div
        style={{
          flex: 1, // Fill the remaining space
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {userRole.includes('Hr-Admin') ? (
          <TicketDetails ticket={selectedTicket} adminId={adminId} />
        ) : 
          <TicketDetailsHR ticket={selectedTicket} adminId={adminId} />
        }
      </div>
    </div>
  );
};

export default RaisedTickets;

