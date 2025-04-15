import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import UserProfile from "../../../hooks/UserData/useUser";
import useAuthToken from "../../../hooks/Token/useAuth";
import useCreateTicket from "../useCreateTicket";
import { useQueryClient } from "react-query";

export default function TicketForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;
  const authToken = useAuthToken();

  const { createTicket, loading, error, success } = useCreateTicket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries("ticketsforemp");
      onClose(); // Close the modal when the ticket is successfully created
    }
    //eslint-disable-next-line
  }, [success, onClose]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadStudentImage = async (file) => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }

    try {
      setUploading(true);
      const {
        data: { url },
      } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/Tickets-${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setUploading(false);
      return url.split("?")[0]; // Return the uploaded file URL
    } catch (error) {
      setUploading(false);
      console.error("Image upload failed:", error.message);
      throw new Error("Failed to upload the image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let attachmentUrl = null;

      // Upload the file if one is selected
      if (selectedFile) {
        attachmentUrl = await uploadStudentImage(selectedFile);
      }

      // Create the ticket
      await createTicket({
        title,
        description,
        module: project,
        attachments: attachmentUrl ? [{ url: attachmentUrl }] : [],
        employeeId,
      });
    } catch (err) {
      console.error("Error creating ticket:", err.message);
    }
  };

  const Projects = ["AEGIS", "HR Connector"];

  return (
    <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  >
                    <option value="" disabled>
                      Select project
                    </option>
                    {Projects.map((proj, index) => (
                      <option key={index} value={proj}>
                        {proj}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ExpandMoreIcon className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="attachment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Attachment
                </label>
                <div className="relative">
                  <input
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center">
                    {selectedFile ? selectedFile.name : "Choose file"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || uploading}
            >
              {loading || uploading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && (
            <p className="text-green-500 mt-4">Ticket created successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}
