import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useQueryClient } from "react-query";
import UserProfile from "../../../hooks/UserData/useUser";

const HRAdminDashboard = () => {
  const [activeView, setActiveView] = useState("All tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ticketListCollapsed, setTicketListCollapsed] = useState(false);

  const queryClient = useQueryClient();
  const [reply, setReply] = useState(""); // New state for reply
  const [messages, setMessages] = useState([]); // New state for messages
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const adminId = user?._id;

  const [tickets, setTickets] = useState([]);
  const [ticketViews, setTicketViews] = useState([
    { name: "All tickets", count: 0 },
    { name: "My tickets", count: 0 },
    { name: "Unassigned", count: 0 },
    { name: "High priority", count: 0 },
    { name: "Past due", count: 0 },
  ]);
  const [statusData, setStatusData] = useState([
    { name: "Open", count: 0, color: "bg-amber-400" },
    { name: "Assigned", count: 0, color: "bg-blue-500" },
    { name: "In Progress", count: 0, color: "bg-cyan-500" },
    { name: "Resolved", count: 0, color: "bg-orange-500" },
  ]);
  const [chartData, setChartData] = useState([
    { day: "Mon", low: 0, medium: 0, high: 0 },
    { day: "Tue", low: 0, medium: 0, high: 0 },
    { day: "Wed", low: 0, medium: 0, high: 0 },
    { day: "Thu", low: 0, medium: 0, high: 0 },
    { day: "Fri", low: 0, medium: 0, high: 0 },
    { day: "Sat", low: 0, medium: 0, high: 0 },
    { day: "Sun", low: 0, medium: 0, high: 0 },
  ]);

  const fetchTicketsByOrganization = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/tickets-by-organization`
      );
      return response.data.tickets;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  };

  const updateTicket = async (ticketId, updates) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/ticket/priority`,
        {
          ticketId, // Pass the ticketId explicitly
          priority: updates.priority, // Ensure priority is included in the request body
        }
      );

      // Update the local state with the updated ticket
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, ...updates } : ticket
        )
      );

      // If the selected ticket is being updated, update its state as well
      if (selectedTicket?.ticketId === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, ...updates }));
      }

      console.log("Ticket updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  useEffect(() => {
    const loadTickets = async () => {
      const data = await fetchTicketsByOrganization();
      setTickets(data);

      // Process tickets to calculate counts for ticketViews
      const myTickets = data.filter(
        (ticket) => ticket.assignee?.email === "pradnya@gmail.com"
      );
      const unassignedTickets = data.filter((ticket) => !ticket.assignee);
      const highPriorityTickets = data.filter(
        (ticket) => ticket.priority.toLowerCase() === "high"
      );

      setTicketViews([
        { name: "All tickets", count: data.length },
        { name: "My tickets", count: myTickets.length },
        { name: "Unassigned", count: unassignedTickets.length },
        { name: "High priority", count: highPriorityTickets.length },
        { name: "Past due", count: 0 }, // Add logic for past due if needed
      ]);

      const statusCounts = data.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {});

      setStatusData([
        {
          name: "Open",
          count: statusCounts["Open"] || 0,
          color: "bg-amber-400",
        },
        {
          name: "Assigned",
          count: statusCounts["Assigned"] || 0,
          color: "bg-blue-500",
        },
        {
          name: "In Progress",
          count: statusCounts["In Progress"] || 0,
          color: "bg-cyan-500",
        },
        {
          name: "Resolved",
          count: statusCounts["Resolved"] || 0,
          color: "bg-orange-500",
        },
      ]);

      // Process tickets to calculate chartData
      const priorityCountsByDay = data.reduce((acc, ticket) => {
        const day = new Date(ticket.createdAt).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!acc[day]) {
          acc[day] = { low: 0, medium: 0, high: 0 };
        }
        if (ticket.priority.toLowerCase() === "low") {
          acc[day].low += 1;
        } else if (ticket.priority.toLowerCase() === "medium") {
          acc[day].medium += 1;
        } else if (
          ticket.priority.toLowerCase() === "high" ||
          ticket.priority.toLowerCase() === "critical"
        ) {
          acc[day].high += 1;
        }
        return acc;
      }, {});

      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const updatedChartData = daysOfWeek.map((day) => ({
        day,
        low: priorityCountsByDay[day]?.low || 0,
        medium: priorityCountsByDay[day]?.medium || 0,
        high: priorityCountsByDay[day]?.high || 0,
      }));

      setChartData(updatedChartData);
    };

    loadTickets();
  }, []);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTicketList = () => {
    setTicketListCollapsed(!ticketListCollapsed);
  };

  const filteredTickets = () => {
    if (activeView === "My tickets") {
      return tickets.filter(
        (ticket) => ticket.assignee?.email === "pradnya@gmail.com"
      );
    }
    if (activeView === "Unassigned") {
      return tickets.filter((ticket) => !ticket.assignee);
    }
    if (activeView === "High priority") {
      return tickets.filter(
        (ticket) => ticket.priority.toLowerCase() === "high"
      );
    }
    return tickets; // Default to "All tickets"
  };
  const handleStatusChange = async (newStatus) => {
    if (selectedTicket) {
      try {
        // Update the ticket status in the backend
        await axios.put(`${process.env.REACT_APP_API}/route/ticket/status`, {
          ticketId: selectedTicket.ticketId,
          status: newStatus,
          userId: adminId,
        });

        // Update the local state for the selected ticket
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));

        // Update the tickets list to reflect the new status
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.ticketId === selectedTicket.ticketId
              ? { ...ticket, status: newStatus }
              : ticket
          )
        );

        // Optionally, invalidate queries to refresh data
        await queryClient.invalidateQueries(["tickets"]);
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    }
  };

  const handleSendReply = async () => {
    if (reply.trim()) {
      setIsReplyLoading(true);
      const newMessage = {
        id: messages.length + 1,
        sender: "admin",
        text: reply,
        timestamp: new Date().toLocaleString(),
      };

      // Optimistic UI update
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setReply("");

      try {
        await axios.put(
          `${process.env.REACT_APP_API}/route/tickets/activity/admin`,
          {
            ticketId: selectedTicket.ticketId,
            adminId: adminId, // Replace with actual adminId
            comment: reply,
          }
        );

        // Invalidate query to refresh the data
        await queryClient.invalidateQueries(["tickets"]);
      } catch (error) {
        console.error("Error updating ticket activity:", error);
      } finally {
        setIsReplyLoading(false);
      }
    }
  };

  const handlePriorityChange = (newPriority) => {
    if (selectedTicket) {
      updateTicket(selectedTicket.ticketId, { priority: newPriority });
      setSelectedTicket((prev) => ({ ...prev, priority: newPriority }));
    }
  };

  const handleAssigneeChange = async (newAssignee) => {
    if (selectedTicket) {
      setSelectedTicket((prev) => ({ ...prev, assignee: newAssignee }));
    }
    try {
      await axios.put(`${process.env.REACT_APP_API}/route/ticket/assign`, {
        ticketId: selectedTicket.ticketId,
        assigneeEmail: newAssignee?.email,
      });

      // Invalidate query to refresh the data
      await queryClient.invalidateQueries(["tickets"]);
    } catch (error) {
      console.error("Error assigning ticket:", error);
    } finally {
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 bg-slate-50 relative">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-12" : "w-56"
          } bg-white border-r border-slate-200 py-4 transition-all duration-300 ease-in-out relative`}
        >
          {/* Sidebar collapse toggle button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 flex items-center justify-center w-6 h-12 bg-white border border-slate-200 rounded-r-md shadow-sm z-10"
          >
            {sidebarCollapsed ? (
              <ExpandMoreIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>

          <div
            className={`px-4 ${
              sidebarCollapsed ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
          >
            <div className="flex justify-between items-center mb-4 text-slate-500 text-xs">
              <h3 className="uppercase">Ticket Views</h3>
              <span className="arrow-down">▼</span>
            </div>
            <ul className="list-none">
              {ticketViews.map((view) => (
                <li
                  key={view.name}
                  className={`flex justify-between px-4 py-3 my-1 rounded cursor-pointer text-sm ${
                    activeView === view.name ? "bg-blue-600 text-white" : ""
                  }`}
                  onClick={() => setActiveView(view.name)}
                >
                  <span>{view.name}</span>
                  <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs">
                    {view.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Collapsed sidebar content */}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center pt-4 h-full">
              {ticketViews.map((view) => (
                <div
                  key={view.name}
                  className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center text-xs cursor-pointer ${
                    activeView === view.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100"
                  }`}
                  onClick={() => setActiveView(view.name)}
                  title={view.name}
                >
                  {view.name.charAt(0)}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Ticket list panel */}
        <div
          className={`${
            ticketListCollapsed ? "w-12" : "flex-1 max-w-xl"
          } bg-white border-r border-slate-200 transition-all duration-300 ease-in-out relative`}
        >
          {/* Ticket list collapse toggle button */}
          <button
            onClick={toggleTicketList}
            className="absolute -right-3 top-6 flex items-center justify-center w-6 h-12 bg-white border border-slate-200 rounded-r-md shadow-sm z-10"
          >
            {ticketListCollapsed ? (
              <ExpandMoreIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>

          {!ticketListCollapsed && (
            <>
              <div className="flex items-center p-4 border-b border-slate-200">
                <div className="flex items-center gap-2 px-4 py-2 rounded bg-white shadow-sm">
                  <span>{activeView}</span>
                </div>
                <div className="flex-1 ml-4">
                  <input
                    type="text"
                    placeholder="Search tickets"
                    className="w-full px-4 py-2 border border-slate-200 rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between p-4 border-b border-slate-200 text-sm">
                <h3>Ticket name (Title)</h3>
                <span>Mar 15</span>
              </div>

              <ul className="list-none overflow-auto max-h-[calc(100vh-180px)]">
                {filteredTickets().map((ticket) => (
                  <li
                    key={ticket.ticketId}
                    className={`flex justify-between p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${
                      selectedTicket?.ticketId === ticket.ticketId
                        ? "border-l-4 border-l-blue-600"
                        : ""
                    }`}
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <div>
                      <h4 className="text-sm mb-1">{ticket.title}</h4>
                      <span className="text-xs text-slate-500">
                        {ticket.ticketId}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          ticket.status === "Done"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {ticket.date}
                      </span>
                      <button
                        className="bg-transparent border-none cursor-pointer text-slate-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ⭕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Collapsed ticket list content */}
          {ticketListCollapsed && (
            <div className="flex flex-col items-center pt-4">
              {tickets.slice(0, 8).map((ticket, index) => (
                <div
                  key={ticket.id}
                  className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center text-xs cursor-pointer ${
                    selectedTicket?.id === ticket.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100"
                  }`}
                  onClick={() => handleTicketClick(ticket)}
                  title={ticket.name}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket details or dashboard */}
        <main className="flex-1 p-4 overflow-auto">
          {!selectedTicket ? (
            <div className="w-full flex flex-col gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-base mb-4 text-slate-500">
                  Status Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {statusData.map((status) => (
                    <div
                      key={status.name}
                      className={`p-4 rounded-lg text-white ${status.color}`}
                    >
                      <div className="text-sm mb-2">{status.name}</div>
                      <div className="text-2xl font-bold">{status.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-base mb-4 text-slate-500">
                  Priority wise Weekly Overview
                </h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>High</span>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#F5B14C"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="medium"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#E74C3C"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg shadow-sm p-4 flex flex-col">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-medium">
                      {selectedTicket.name}
                    </h2>
                    <div className="text-xs text-slate-500">
                      {selectedTicket.id} Created:{" "}
                      {new Date(selectedTicket.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTicket?.status || "To Do"} // Default to "To Do" if no status is set
                        onChange={(e) => handleStatusChange(e.target.value)} // Handle status change
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center cursor-pointer"
                      >
                        <option value="To Do">To Do</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <ChevronRightIcon className="w-4 h-4 ml-1 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4 grid grid-cols-2 gap-4 border-b border-slate-200">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Priority</div>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Assignee</div>
                  <select
                    value={selectedTicket.assignee?.email || ""}
                    onChange={(e) =>
                      handleAssigneeChange({ email: e.target.value })
                    }
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="">Unassigned</option>
                    <option value="pradnya@gmail.com">Pradnya</option>
                    <option value="john.doe@example.com">John Doe</option>
                    <option value="jane.doe@example.com">Jane Doe</option>
                  </select>
                  <button
                    onClick={() =>
                      handleAssigneeChange({ email: "pradnya@gmail.com" })
                    }
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
                  >
                    Assign to Me
                  </button>
                </div>
              </div>

              <div className="py-4 flex items-start gap-3 border-b border-slate-200">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={
                      selectedTicket?.employee?.user_logo_url ||
                      "/abstract-user-icon.png"
                    }
                    alt={selectedTicket?.employee?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {selectedTicket?.employee?.name}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    {selectedTicket?.employee?.email}
                  </div>
                  <p className="text-sm text-slate-700">
                    {selectedTicket.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="py-4 flex flex-col gap-4 border-b border-slate-200">
                <h3 className="text-base text-slate-500">Activity Log</h3>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {selectedTicket.activityLog.map((log, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        log.action === "Admin Message"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg text-sm ${
                          log.action === "Admin Message"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="font-medium">
                          {log.user?.name || "Unknown User"}
                        </p>
                        <p className="mt-1">
                          {log.comments || "No comments provided."}
                        </p>
                        <span className="text-xs text-gray-500 block mt-2">
                          {new Date(log.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 relative">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full border rounded-lg p-3 pr-10"
                  disabled={isReplyLoading}
                />
                <button
                  onClick={handleSendReply}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
                  disabled={isReplyLoading}
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRAdminDashboard;
