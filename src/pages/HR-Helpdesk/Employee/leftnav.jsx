import { useState } from "react";
import TicketForm from "./TicketForm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // for ChevronDown
import AddIcon from "@mui/icons-material/Add";

export default function LeftNav({
  tickets,
  isLoading,
  isError,
  error,
  selectedTicket,
  onSelectTicket,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  // Sort tickets by latest update (most recent first)
  const sortedTickets = tickets?.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-800 font-medium"
        >
          Open Tickets <ExpandMoreIcon className="ml-1 h-4 w-4" />
        </button>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-700 text-white px-3 py-2 rounded flex items-center text-sm"
        >
          Create <AddIcon className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="text-gray-500 p-4">Loading tickets...</p>}

        {isError && !tickets?.length && (
          <p className="text-gray-500 p-4">No tickets available.</p>
        )}

        {isError && tickets?.length === 0 && (
          <p className="text-red-500 p-4">
            {error?.message || "An error occurred"}
          </p>
        )}

        <div className="divide-y divide-gray-100">
          {sortedTickets?.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => onSelectTicket(ticket)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="text-xs text-gray-500">{ticket.ticketId}</div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TicketForm onClose={handleFormClose} />
        </div>
      )}
    </div>
  );
}
