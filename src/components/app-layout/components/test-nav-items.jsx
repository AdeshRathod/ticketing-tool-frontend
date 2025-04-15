/* eslint-disable no-unused-vars */
import {
  Category,
  LocationOn,
  MonetizationOn,
  Dashboard,

} from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import {useLocation } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import { useDrawer } from "./Drawer";
import TestAccordian from "./TestAccordian";
const TestNavItems = () => {
  // to define the route and pass the dynamic organization id
  const [openIndex, setOpenIndex] = useState(null);
  const { pinned, setPinned } = useDrawer();
  const handleAccordianClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const location = useLocation();
  const [decodedToken, setDecodedToken] = useState("");
  const [emp, setEmp] = useState();
  const { decodedToken: decoded } = useGetUser();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();

  const empId = user?._id;
  // const isVendor =  resp?.data?.user?.isVendor === true;
  const isVendor = user?.isVendor === true;

  const role = useGetCurrentRole();
  console.log("user in test", role);
  const queryClient = useQueryClient();


  //////////////////////////////////////////////////

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp?.data?.employee?.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);
  const check = emp?.packageInfo === "Intermediate Plan";

  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      if (parts[orgIndex + 1] === null || undefined) {
        orgId = decoded?.user?.organizationId;
      } else {
        orgId = parts[orgIndex + 1];
      }
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });
  console.log("data......", data);

  //git communication employee survey permission
  const organisationId = data?.organisation?._id;

  // Update organization ID when URL changes
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }

    // eslint-disable-next-line
  }, [location.pathname]);

  const [isVisible, setisVisible] = useState(true);

  useEffect(() => {
    setisVisible(location.pathname.includes("/organisation"));
  }, [location.pathname, organisationId]);

  useEffect(() => {
    queryClient.invalidateQueries("survey-permission");
  }, [queryClient]);

  let navItems = useMemo(
    () => {
        return {

          Home: {
            open: false,
            icon: <Category style={{ fontSize: "20px" }} />,
            isVisible: true,
            routes: [
              {
                key: "dashboard",
                isVisible: true,
                link: "/",
                icon: <Dashboard style={{ fontSize: "20px" }} />,
                text: "Dashboard",
              },
            ],
          },

          "HR Helpdesk": {
            open: true,
            isVisible: true,
              // data?.organisation?.packageInfo === "Enterprise Plan" &&
              // ["Hr-Admin", "HR", "Employee"].includes(role) &&
              // data?.organisation?.packages?.includes("HR Help Desk"),

            icon: <MonetizationOn style={{ fontSize: "20px" }} />,
            routes: [
              {
                key: "Tickets",
                // isVisible: ["HR", "Hr-Admin", "Employee"].includes(role),
                isVisible: true,

                link: `/organisation/${orgId}/tickets`,
                icon: <LocationOn style={{ fontSize: "20px" }} />,
                text: "Tickets",
              },
              {
                key: "How To",
                // isVisible: ["HR", "Hr-Admin", "Employee"].includes(role),
                isVisible: true,


                link: `/organisation/${orgId}/How-to-Doc`,
                icon: <LocationOn style={{ fontSize: "20px" }} />,
                text: "How To",
              },
            ],
          },
        };
    },
    // eslint-disable-next-line
    [
      isVisible,
      orgId,
      check,
      data?.organisation?.packageInfo,
      location.pathname,
      role,
    ]
  );

  useEffect(() => {
    try {
      if (token) {
        const newToken = jwtDecode(token);

        setDecodedToken(newToken);
        if (decodedToken && decodedToken?.user?.profile) {
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, [token]);

  // Assuming response is accessible here

  const finalNavItems =  navItems;
  //const roles = ["Home", "Attendance", "Self Help", "Payroll", "Employee", "Machine Punching", "Organisation", "Department", "Recruitment", "Communication", "Report", "Performance", "Department", "Recruitment", "Communication", "Organisation", "Records", "Training", "Remote Punch", "Geo Fencing", "Catering and food",]

  //fav item add
  const employeeId = user?._id;
  const authToken = cookies["aegis"];

  return (
    <>

      {Object.keys(finalNavItems)?.map((role, index) => {
        const { icon, routes, isVisible } = finalNavItems[role];
        return (
          <TestAccordian
            key={index}
            role={role}
            icon={icon}
            routes={routes}
            isVisible={isVisible}
            valueBoolean={openIndex === index}
            handleAccordianClick={() => handleAccordianClick(index)}
            pinned={pinned}
            setPinned={setPinned}
          />
        );
      })}
    </>
  );
};

export default TestNavItems;
