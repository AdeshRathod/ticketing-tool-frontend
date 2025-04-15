

import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Carousel from "react-multi-carousel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import aegislogo from "../../assets/argan-logo.svg";
import login1 from "../../assets/login1.svg";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import UserProfile from "../../hooks/UserData/useUser";

const SignIn = () => {
  // hooks
  const { handleAlert } = useContext(TestContext);
  const location = useLocation();
  // state
  const [time, setTime] = useState(1);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);

  const redirect = useNavigate();
  


 // State to track password strength
//  const [passwordStrength, setPasswordStrength] = useState([false, false, false]);
//  const [passwordMessage, setPasswordMessage] = useState('');

 // Regex for password validation
 const passwordRegex = /^(?=.*[a-z])(?=.*\d)/;  // Lowercase + Number (mandatory conditions)

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

  // to get current user
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  // navigate
  const navigate = useNavigate("");

  useEffect(() => {
    if (user?._id) {
      navigate(-1);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (time > 0) {
      interval = setInterval(() => {
        setTime((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsTimeVisible(false);
    }

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [time, isTimeVisible]);

  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  // define the validation using zod
  const SignUpSchema = z
    .object({
      first_name: z
        .string()
        .min(2, { message: "Minimum 2 character " })
        .max(15),

      email: z.string().email(),
      mobileno: z
        .string()
        .min(10, { message: "Phone Number must be 10 digit" })
        .regex(/^[0-9]+$/),
      password: z.string().min(8).max(16).refine((value) => passwordRegex.test(value), {
        message: "Password must contain one lowercase letter and one number",
      }),
      confirmPassword: z.string(),
      isChecked: z.boolean().refine((value) => value === true, {
        message: "Please accept the Terms and Conditions to sign up.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  // use useForm
  const {
    handleSubmit,
    control,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

   // Track password changes
  //  const password = watch("password");


  // const checkPasswordStrength = (password) => {
  //   const conditions = [
  //     password?.length >= 8 && password?.length <= 16,  // Length condition
  //     /[a-z]/.test(password),  // Lowercase condition
  //     /\d/.test(password),  // Number condition
  //     /[!@#$%^&*(),.?":{}|<>]/.test(password),  // Special character condition (optional)
  //   ];

  //   const fulfilledConditions = conditions.filter(Boolean).length;
  //   setPasswordStrength([fulfilledConditions >= 1, fulfilledConditions >= 2, fulfilledConditions >= 4]);
    
  //   if (fulfilledConditions === 4) {
  //     setPasswordMessage("Good job, you have set a strong password");
  //   } else if (fulfilledConditions === 3) {
  //     setPasswordMessage("Your password is decent, but can be improved.");
  //   } else if (fulfilledConditions === 2) {
  //     setPasswordMessage("Password is weak, try adding more criteria.");
  //   } else {
  //     setPasswordMessage("Password is very weak, please meet the required conditions.");
  //   }
  // };

  // // Listen to password changes to update the strength
  // React.useEffect(() => {
  //   checkPasswordStrength(password);
  // }, [password]);


  const onSubmit = async (data) => {
    try {

      const password = data.password;
      const conditions = [
        password.length >= 8 && password.length <= 16,
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
      ];
      const passedConditions = conditions.filter(Boolean).length;
    
      if (passedConditions === 4) {
        
      } else if (passedConditions >= 3) {
      }
    
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/signup`,
        data
      );
      handleAlert(true, "success", response.data.message);
      return redirect("/sign-in")
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to sign up. Please try again."
      );
    }
  };


  return (
    <Grid container>
      <Grid
        className="h-screen"
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        sx={{
          overflow: "hidden",
          p: "2%",
          display: { lg: "block", md: "none", sm: "none", xs: "none" },
        }}
      >
        <div className="flex h-[80vh] flex-col items-center justify-center">
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
        className=" overflow-scroll  h-screen   border  border-l-[.5px]"
        sx={{
          display: "flex",
          justifyContent: "center",

          p: { xs: "5%", sm: "5%", md: "5%", lg: "2% 5% 5% 5%" },

          overflowY: "auto",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full"
        //className="flex   my-16 sm:!px-20 px-6 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
        >
        
      <div className="flex flex-col items-center">
        
        <img
          src={aegislogo}
          alt="logo"
          className="h-[60px] object-cover mix-blend-multiply"
        />
        <Typography component="h1" sx={{ fontSize: "30px",  mt: 2 }}>
          Create an account
        </Typography>
        <Typography component="p" className="text-gray-500 text-center">
          Sign up now and unlock exclusive access!
        </Typography>
      </div>
      
      <div className="flex flex-col items-center mb-4">
     
          </div>
            {/* First Name */}
            <AuthInputFiled
              name="first_name"
              control={control}
              type="text"
              placeholder="Enter your full name"
              label="Your Name *"
              maxLimit={15}
              errors={errors}
              error={errors.first_name}
            />
            {/* <AuthInputFiled
            name="last_name"
            icon={DriveFileRenameOutlineOutlined}
            control={control}
            type="text"
            label="Last Name *"
            placeholder="Last Name"
            errors={errors}
            maxLimit={15}
            error={errors.last_name}
          /> */}
          
          <AuthInputFiled
              name="mobileno"
              control={control}
              type="tel"
              placeholder="Enter your phone number"
              label="Phone number"
              errors={errors}
              error={errors.mobileno}
              className="w-full mt-4"
            />
          <div className="flex sm:flex-row flex-col w-full sm:items-center items-start gap-0 sm:gap-2 sm:mb-0 mb-3">
            
          </div>
          <AuthInputFiled
            name="email"
            control={control}
            type="email"
            placeholder="Email"
            label="Email Address *"
            errors={errors}
            error={errors.email}
          />


          <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
            <AuthInputFiled
              name="password"
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              control={control}
              type="Password1"
              placeholder="****"
              label="Password *"
              errors={errors}
              error={errors.password}
            />

              {/* Password Strength Meter */}
     
            <AuthInputFiled
              name="confirmPassword"
              visible={visibleCPassword}
              setVisible={setVisibleCPassword}
              control={control}
              type="Password1"
              placeholder="****"
              label="Confirm Password *"
              errors={errors}
              error={errors.confirmPassword}
            />
          </div>

         {/* { password && ( <div className="grid md:grid-cols-2 grid-cols-1  gap-2 ">
            <div className="flex flex-col space-y-1">
              <div className="flex space-x-1">
                <div
                  className={`h-1 w-1/3 ${passwordStrength[0] ? 'bg-red-500' : 'bg-gray-300'}`}
                />
                <div
                  className={`h-1 w-1/3 ${passwordStrength[1] ? 'bg-yellow-500' : 'bg-gray-300'}`}
                />
                <div
                  className={`h-1 w-1/3 ${passwordStrength[2] ? 'bg-green-500' : 'bg-gray-300'}`}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{passwordMessage}</p>
            </div>
          </div>)} */}


          <div className="flex items-center ">
            <div className="w-max">
              <AuthInputFiled
                name="isChecked"
                control={control}
                type="checkbox"
                label={`I accept the`}
                errors={errors}
                error={errors.isChecked}
              />
            </div>
          </div>

          {/* Signup Button */}
          <div className="flex  mb-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md text-lg font-semibold hover:opacity-90 transition"

            >
              Create account
            </button>
          </div>
          {/* <button
            type="submit"
            className="flex group justify-center text-lg w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 font-semibold text-white bg-[#1414fe]"
          >
            Register Account
          </button> */}

      <div className="flex flex-col items-center ">
        

          <Typography
            className="text-gray-500"
            component="p"
            sx={{ fontSize: "18px" , mt: 2}}
          >
            {" "}
            Already have an account?{" "}
            <Link
              to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
              className="font-medium text-[060606] hover:underline  transition-all "
            >
              Log In
            </Link>
          </Typography>
      </div>

        </form>
      </Grid>
    </Grid>
  
  );
};

export default SignIn;




