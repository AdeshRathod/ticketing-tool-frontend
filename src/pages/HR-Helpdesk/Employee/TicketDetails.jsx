import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import { useQueryClient } from "react-query";

export default function TicketDetails({ ticket, employeeId }) {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (ticket) {
      const initialMessages = [
        {
          id: 1,
          sender: "user",
          text: ticket.description || "No description available.",
          timestamp: new Date(ticket.createdAt).toLocaleString(),
        },
        ...ticket.activityLog.map((log, index) => ({
          id: index + 2,
          sender:
            log.action === "Admin Message"
              ? "admin"
              : log.action === "Message"
              ? "user"
              : "system",
          text: log.comments || "No comments provided.",
          timestamp: new Date(log.date).toLocaleString(),
          user: log.user || {
            name: "System",
            email: "system@argantechnology.com",
          },
        })),
      ];
      setMessages(initialMessages);
    }
  }, [ticket]);

  const handleSendReply = async () => {
    if (reply.trim()) {
      setIsReplyLoading(true);

      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: reply,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setReply("");

      try {
        await axios.put(
          `${process.env.REACT_APP_API}/route/tickets/activity/employee`,
          {
            ticketId: ticket.ticketId,
            employeeId: employeeId,
            comment: reply,
          }
        );

        await queryClient.invalidateQueries(["ticketsforemp"]);
      } catch (error) {
        console.error("Error updating ticket activity:", error);
      }

      // Simulate API call
      setTimeout(() => {
        setIsReplyLoading(false);
      }, 500);
    }
  };

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a ticket to view details
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Ticket header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-medium text-gray-900">{ticket.title}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span>{ticket.ticketId}</span>
          <span className="mx-2">•</span>
          <span>
            Created:{" "}
            {new Date(ticket.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Conversation area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={message.id} className="space-y-2">
            {/* Message timestamp and sender info */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {message.sender === "user"
                    ? "U"
                    : message.sender === "admin"
                    ? "A"
                    : "S"}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {message.user?.name ||
                      (message.sender === "user"
                        ? "User"
                        : message.sender === "admin"
                        ? "Admin"
                        : "System")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {message.user?.email ||
                      (message.sender === "user"
                        ? user?.email
                        : message.sender === "admin"
                        ? "admin@company.com"
                        : "system@company.com")}
                  </div>
                </div>
              </div>
              <div className="ml-auto text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>

            {/* Message content */}
            <div className="pl-10">
              <p className="text-gray-700">{message.text}</p>

              {/* Show attachments for the first message */}
              {index === 0 && ticket.attachments.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-gray-500 mb-2">
                    {ticket.attachments.length} attachment(s)
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {ticket.attachments.map((attachment, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded p-2 flex flex-col items-center gap-2"
                      >
                        {attachment.endsWith(".jpg") ||
                        attachment.endsWith(".jpeg") ||
                        attachment.endsWith(".png") ||
                        attachment.endsWith(".gif") ? (
                          <img
                            src={attachment}
                            alt={`Attachment ${i + 1}`}
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : (
                          <div className="text-xs text-gray-500">
                            <a
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View File
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Add a reply..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendReply}
            disabled={!reply.trim() || isReplyLoading}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
