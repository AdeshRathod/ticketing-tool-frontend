
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Skeleton, TextField, TablePagination } from "@mui/material";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../../hooks/UserData/useUser";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const HRAdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    avgResolutionTime: 0,
    totalRunningTickets: 0,
    maxSolutionsByAssignee: "",
  });
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [priorityData, setPriorityData] = useState([]);


  // const { organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;

  const fetchTicketsByOrganization = async (organisationId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/tickets-by-organization`,
        { organisationId }
      );
      return response.data.tickets;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  };

  const calculateMetrics = (tickets) => {
    const resolvedTickets = tickets.filter((ticket) => ticket.closedAt);
    const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
      const resolutionTime =
        new Date(ticket.closedAt).getTime() -
        new Date(ticket.createdAt).getTime();
      return sum + resolutionTime;
    }, 0);
    const avgResolutionTime =
      resolvedTickets.length > 0
        ? totalResolutionTime / resolvedTickets.length
        : 0;

    const totalRunningTickets = tickets.filter(
      (ticket) => ticket.status !== "Closed"
    ).length;

    const assigneeCounts = tickets.reduce((counts, ticket) => {
      const assigneeName = ticket.activityLog?.[ticket.activityLog.length - 1]?.user
        ? `${ticket.activityLog[ticket.activityLog.length - 1].user.first_name} ${
            ticket.activityLog[ticket.activityLog.length - 1].user.last_name || ""
          }`.trim()
        : "Unassigned";

      counts[assigneeName] = (counts[assigneeName] || 0) + 1;
      return counts;
    }, {});
    const maxSolutionsByAssignee = Object.keys(assigneeCounts).reduce(
      (max, assignee) =>
        assigneeCounts[assignee] > (assigneeCounts[max] || 0)
          ? assignee
          : max,
      ""
    );

    setMetrics({
      avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)),
      totalRunningTickets,
      maxSolutionsByAssignee,
    });
  };

  const generatePriorityData = (tickets) => {
    const priorityCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});
    
    const formattedData = Object.keys(priorityCounts).map(priority => ({
      priority,
      count: priorityCounts[priority]
    }));
    setPriorityData(formattedData);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "tickets.xlsx");
  };

  useEffect(() => {
    const loadTickets = async () => {
      const fetchedTickets = await fetchTicketsByOrganization(organisationId);

      const updatedTickets = fetchedTickets.map((ticket) => {
        const latestAssignee = ticket.activityLog?.[ticket.activityLog.length - 1]?.user
          ? `${ticket.activityLog[ticket.activityLog.length - 1].user.first_name} ${
              ticket.activityLog[ticket.activityLog.length - 1].user.last_name || ""
            }`.trim()
          : "Unassigned";
        return {
          ...ticket,
          latestAssignee,
        };
      });

      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);
      calculateMetrics(updatedTickets);
      generatePriorityData(fetchedTickets);

      setLoading(false);
    };

    loadTickets();
  }, [organisationId]);

  const handleFilterChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setFilter(searchValue);
    const filtered = tickets.filter(
      (ticket) =>
        ticket.ticketId.toLowerCase().includes(searchValue) ||
        ticket.title.toLowerCase().includes(searchValue) ||
        ticket.latestAssignee.toLowerCase().includes(searchValue) ||
        ticket.priority.toLowerCase().includes(searchValue) ||
        ticket.status.toLowerCase().includes(searchValue)
    );
    setFilteredTickets(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>HR Admin Dashboard</h1>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            style={{
              background: "#f39c12",
              borderRadius: "8px",
            }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            style={{
              background: "#3498db",
              borderRadius: "8px",
            }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
            style={{
              background: "#2ecc71",
              borderRadius: "8px",
            }}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          style={{ borderRadius: "8px" }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
     <HeadingOneLineInfo
        heading={
          <span style={{ color: "#A4A4A4", fontSize: "20px", fontWeight: "bold" }}>
            Status Overview
          </span>
        }
        info={""} // No additional info needed
      />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(to bottom right, #d48a08, #e6a000)",
              color: "#fff",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>Open</h3>
            <h2>{metrics.totalRunningTickets ?? 0}</h2>
          </div>
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(to bottom right, #1d68ff, #337dff)",
              color: "#fff",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>Assigned</h3>
            <h2>{metrics.assigned ?? 0}</h2>
          </div>
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(to bottom right, #5ed0df, #7bdff2)",
              color: "#fff",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>In Progress</h3>
            <h2>{metrics.inProgress ?? 0}</h2>
          </div>
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(to bottom right, #c6552b, #e87e42)",
              color: "#fff",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>Resolved</h3>
            <h2>{metrics.resolved ?? 0 }</h2>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

       
      <TextField
        label="Filter tickets"
        variant="outlined"
        fullWidth
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: "20px" }}
      />

      <div>
        <h2>Tickets</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#ecf0f1" }}>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Ticket ID
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Title
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Assignee
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Priority
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <tr key={ticket._id}>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {ticket.ticketId}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {ticket.title}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {ticket.latestAssignee}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {ticket.priority}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {ticket.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={filteredTickets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
        <button
          style={{
            padding: "10px 20px",
            background: "#16a085",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default HRAdminDashboard;
