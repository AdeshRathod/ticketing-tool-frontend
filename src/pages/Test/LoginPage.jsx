import {  Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { default as React, useContext, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import aegislogo from "../../assets/argan-logo.svg"; // Adjust import according to your structure
import arganlogo from "../../assets/arganlogo.png"
import login1 from "../../assets/login1.svg"; // Adjust import according to your structure
import { TestContext } from "../../State/Function/Main";
// import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";
import UserProfile from "../../hooks/UserData/useUser";

const LoginPage = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // navigate
  const redirect = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // to get current user information and user role
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  if (user && role) {
    redirect("/");
  }

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // useEffect(() => {
  //   if (user?._id) {
  //     if (role === "Super-Admin" || role === "Delegate-Super-Admin")
  //       return redirect("/");
  //     else if (role === "HR")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
  //       );
  //     else if (
  //       role === "Delegate-Department-Head" ||
  //       role === "Department-Head"
  //     )
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
  //       );
  //     else if (role === "Accountant")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
  //       );
  //     else if (role === "Manager")
  //       return redirect(
  //         `/organisation/${user?._id}/dashboard/manager-dashboard`
  //       );
  //     else if (role === "Employee")
  //       return redirect(
  //         `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
  //       );
  //   }
  //   // eslint-disable-next-line
  // }, [role, window.location.pathname]);

  // to define the funciton for handle role
  const handleRole = useMutation(
    async (data) => {
      setIsLoading(true); // Set loading to true when role change starts
      const res = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/changerole`,
        data
      );
      return res;
    },
    {
      onSuccess: (response) => {
        // Cookies.set("role", response?.data?.roleToken);

        Cookies.set("role", response.data.roleToken, {
          expires: 4 / 24,
        });
        setIsLoading(false); // Set loading to false when role change is successful
        window.location.reload();
      },
      onError: () => {
        setIsLoading(false); // Set loading to false when role change fails
      },
    }
  );

  // to define the fuction for logged in
  const handleLogin = useMutation(
    async (data) => {
      // if (isLoading) return; // Prevent duplicate requests
      setIsLoading(true); // Set loading to true when login starts
      const res = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/login`,
        data
      );

      return res;
    },

    {
      onSuccess: async (response) => {
        Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );
        if (response.data.user?.profile?.includes("Admin")) {
          handleRole.mutate({
            role: "Admin",
            email: response.data.user?.email,
          });
          return redirect("/Admin");
        } else if (response.data.user?.profile?.includes("user")) {
          handleRole.mutate({
            role: "user",
            email: response.data.user?.email,
          });
          return redirect("/organisation/ticket-history");
        }
        setIsLoading(false); // Set loading to false when login is successful
        window.location.reload();
      },

      onError: (error) => {
        console.error(error);

        handleAlert(
          true,
          error?.response.status !== 401 ? "success" : "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
        setIsLoading(false); // Set loading to false when login fails
      },
    }
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    // Prevent multiple submissions while loading
    // if (isLoading || handleLogin.isLoading) {
    //   return;
    // }
    if (isLoading) return;
    if (!email || !password) {
      handleAlert(true, "warning", "All fields are manadatory");
      return false;
    }
    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      handleAlert(true, "warning", "Email must be in lowercase");
      return false;
    }
    const data = { email, password };
    handleLogin.mutate(data);
  };

  const [visible, setVisible] = useState(false);

  return (
    <Grid container>
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-50 w-full h-[90vh]">
          <div className="grid place-items-center gap-2">
            <CircularProgress />
            <h1 className="text-center text-xl w-full">Authenticating...</h1>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            sx={{
              p: "2%",
              display: { lg: "block", md: "none", sm: "none", xs: "none" },
            }}
          >
            <div className="flex h-[80vh] flex-col items-center justify-center">
              <img
                src={arganlogo} // Update this with the correct logo variable
                alt="Argan Technology Services Logo"
                className="h-[150px] mb-6 object-contain"
              />

              <div className="h-1/2 w-[80%]">
            
                <Carousel
                  swipeable={true}
                  draggable={false}
                  showDots={true}
                  responsive={responsive}
                  infinite={true}
                  autoPlay={true}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  customTransition="all .5"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  arrows={false}
                >
                  {Array.from({ length: 3 }).map((_, index) => (
                    <img
                      src={login1}
                      alt="logo"
                      //className="h-[300px] object-cover"
                    />
                  ))}
                </Carousel>
              </div>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
            className="border h-screen border-l-[.5px] bg-white flex justify-center items-center"
            sx={{
              display: "flex",
              justifyContent: "center",
    
              p: { xs: "5%", sm: "5%", md: "5%", lg: "2% 5% 5% 5%" },
    
              overflowY: "auto",
            }}
          >
            <form onSubmit={onSubmit} autoComplete="off" className="w-full max-w-md">
              

              <div className="flex flex-col items-center">
        
                <img
                  src={aegislogo}
                  alt="logo"
                  className="h-[60px] object-cover mix-blend-multiply"
                />
                <Typography component="h1" sx={{ fontSize: "30px",  mt: 2 }}>
                Welcome Back
                </Typography>
                <Typography component="p" className="text-gray-500 text-center" sx={{ mb: 3 }}>
                Enter your email address and password to access your account.
                </Typography>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Remember me</span>
                </div>
                <Link to="/forgot-password" className="text-[696969] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md text-lg font-semibold hover:opacity-90 transition"
              >
                {handleLogin.isLoading ? <CircularProgress size={20} color="inherit" /> : "Log in"}
              </button>

             <div className="flex flex-col items-center ">

              <Typography className="text-center text-gray-500 "
               sx={{ fontSize: "18px" , mt: 2}}
               >
                Don’t have an account? 
                <Link to="/sign-up" className="text-[060606] hover:underline ml-1">
                  Sign Up
                </Link>
              </Typography>
            </div>

            </form>
          </Grid>

        </>
      )}
    </Grid>
  );
};

export default LoginPage;
