import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

import UserProfile from "../../../hooks/UserData/useUser";



import HRAdminDashboard from "../../HR-Helpdesk/Dashboard/hradmindashboard";


const useNotification = () => {
  //testing code for dev branch on git hub
  const { organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const { data: orgData } = useSubscriptionGet({ organisationId });
  
  //------Food catering count
  const { data: foodcateringdata } = useQuery({
    queryKey: ["ordernotifications", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/notifications/${employeeId}`
        );
        console.log("API Response:", res.data); // Log full API response
        return res.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return { data: [] }; // Return an empty array to handle gracefully
      }
    },
    enabled: !!employeeId,
  });

  // Debug: Log fetched notifications data
  console.log("foodcateringdata:", foodcateringdata);

  // Calculate unread notification count
  const foodcateringCount = foodcateringdata?.data?.reduce(
    (count, notification) => {
        return !notification.notification.vendorRead ? count + 1 : count;
     
    },
    0
  );

  // Debug: Log the unread notification count
  console.log("Unread notifications count:", foodcateringCount);



  const dummyData = [
    {
      name: "Food & Catering",
      tooltipName: "Attendance & Leave Requests",
      count: typeof foodcateringCount === "number" ? foodcateringCount : 0,
      color: "#FF7373",
      visible: orgData?.organisation?.packageInfo === "Enterprise Plan",
      page: < HRAdminDashboard/>,
      empPage: <HRAdminDashboard />,
    },
  ];
  return { dummyData };
};

export default useNotification;
