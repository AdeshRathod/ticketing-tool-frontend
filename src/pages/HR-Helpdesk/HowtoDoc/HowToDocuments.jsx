import React, { useState } from "react";
import registerImage1 from "../../../assets/How-To/register/register1.png";
import registerImage2 from "../../../assets/How-To/register/register2.png";
import loginImage1 from "../../../assets/How-To/login/login1.png";
import loginImage2 from "../../../assets/How-To/login/login2.png";
import creatorg1 from "../../../assets/How-To/createorg/createorg1.png"
import createorg2 from "../../../assets/How-To/createorg/createorg2.png"
import createorg3 from "../../../assets/How-To/createorg/createorg3.png"
import createorg4 from "../../../assets/How-To/createorg/createorg4.png"
import setup1 from "../../../assets/How-To/setup/setup1.png"
import setup2 from "../../../assets/How-To/setup/setup2.png"


const HowToDocuments = () => {
  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  const sections = [
    {
      id: "register",
      title: "How to Register with AEGIS HRMS Software",
      content: (
        <div>
          <ol>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 1:</span>
              Click on the link to open the registration page:{" "}
              <a
                href="https://app.aegishrms.com/sign-up"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Here
              </a>
              .
            </li>
          </ol>
          <div style={{ margin: "10px 0" }}>
            <img
              src={registerImage1}
              alt="Registration Step 1"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
          <ol start={2}>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 2:</span>
              Enter all the mandatory fields, such as first name, last name, etc.
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 3:</span>
              Verify your contact number using the OTP process.
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 4:</span>
              Verify your email address using the link sent to your email.
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 5:</span>
              Enter a strong password and confirm it (e.g., Xityu@1211).
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 6:</span>
              Read the terms and conditions, and check the box to agree.
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 7:</span>
              Click the "Register Account" button to complete registration.
            </li>
          </ol>
          <div style={{ margin: "10px 0" }}>
            <img
              src={registerImage2}
              alt="Registration Step 7"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "login",
      title: "How to Log in to AEGIS HRMS Software",
      content: (
        <div>
          <ol>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 1:</span>
              Click on the link:{" "}
              <a
                href="https://app.aegishrms.com/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Log In Here
              </a>
              .
            </li>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 2:</span>
              Use valid credentials to log in.
            </li>
          </ol>
          <div style={{ margin: "10px 0" }}>
            <img
              src={loginImage1}
              alt="Login Step 2"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
          <ol start={3}>
            <li>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 3:</span>
              After login, you'll be navigated to the welcome page.
            </li>
          </ol>
          <div style={{ margin: "10px 0" }}>
            <img
              src={loginImage2}
              alt="Login Step 3"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      ),
    },
    {
        id: "organization",
        title: "How to Create an Organization",
        content: (
          <div>
            <ol>
              <li>
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 1:</span>
                Click on the "Create Organization" button to open the organization form.
              </li>
              <li>
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 2:</span>
                Enter all mandatory fields, such as organization name, email ID, foundation date, website address, etc.
                <div style={{ margin: "10px 0" }}>
                  <img
                    src={creatorg1}
                    alt="Organization Creation Step 2"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </li>
              <li>
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 3:</span>
                Choose a package from Essential, Basic, Intermediate, or Enterprise plans.
                <div style={{ margin: "10px 0" }}>
                  <img
                    src={createorg2}
                    alt="Organization Creation Step 3"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </li>
              <li>
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 4:</span>
                Enter organization member count and choose a payment option or a 7-day free trial.
                <div style={{ margin: "10px 0" }}>
                  <img
                    src={createorg3}
                    alt="Organization Creation Step 4"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </li>
              <li>
                <span style={{ fontWeight: "bold", marginRight: "5px" }}>Step 5:</span>
                After successful payment, the organization will be created, and you'll be navigated to the setup page.
                <div style={{ margin: "10px 0" }}>
                  <img
                    src={createorg4}
                    alt="Organization Creation Step 5"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </li>
            </ol>
          </div>
        ),
      },      
      {
        id: "setup",
        title: "How to Do Setup (Super Admin Side)",
        content: (
          <ul>
            <li>
              <strong>⚫ </strong> Only super admin can do setup.
            </li>
            <li>
              <strong>⚫ </strong> Manage Roles: Choose roles that the organization contains and save it.
              <div style={{ margin: "10px 0" }}>
                <img
                  src={setup1}
                  alt="Setup ⚫ 2"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
            </li>
            <li>
              <strong>⚫ </strong> Leaves: Here, users can add organization-specific leaves along with leave counts. These leaves get visible to employees, e.g., Casual leaves, Sick leaves.
            </li>
            <li>
              <strong>⚫ </strong> Shifts: Here, users can add organization-mentioned shifts for employees by entering Shift name, time, and days, e.g., Morning shift, General shift.
            </li>
            <li>
              <strong>⚫ </strong> Location: Add the organization's location by entering region, country, state, city, short name, with pin code.
            </li>
            <li>
              <strong>⚫ </strong> Public Holidays: Add public holidays mentioned by the organization, which get visible in the employee’s calendar.
            </li>
            <li>
              <strong>⚫ </strong> Additional Employee Data: If users require any other information of employees during onboarding, by clicking on a checkbox, an input field will get added in the employee onboarding page.
            </li>
            <li>
              <strong>⚫ </strong> Employment: Here, users can add types of employment, such as full-time, part-time.
            </li>
            <li>
              <strong>⚫ </strong> Salary Template: Here, users can create different salary templates for employees. By adding salary components, users can customize salary templates according to their organization.
            </li>
            <li>
              <strong>⚫ </strong> Designation: Here, users can create different designations that can be used to assign to employees during onboarding, e.g., HR, Manager, Developer, Tester.
            </li>
            <li>
              <strong>⚫ </strong> Communication: Users can add mail IDs to send broadcast mails to employees. In the website, there is an add email button. By using that, users can add emails and choose the communication type. These will be used for further communication.
            </li>
            <li>
              <strong>⚫ </strong> Employee Survey: There is another checkbox enabling users to create employee survey forms.
            </li>
            <li>
              <strong>⚫ </strong> Weekly Off: Here, users can add weekend days that are available in the organization.
            </li>
            <li>
              <strong>⚫ </strong> Salary Computation Day: Here, users can add the salary computation day, and salary will be calculated on that day.
            </li>
            <li>
              <strong>⚫ </strong> Loan Management: Here, users can create types of loans they want to provide to employees.
            </li>
            <li>
              <strong>⚫ </strong> Remote Punching: As there is a feature present in the software for remote employees, for that setup, there are several checkboxes given:
              <div style={{ margin: "10px 0" }}>
                <img
                  src={setup1}
                  alt="Setup ⚫ 16"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
              <ul>
                <li>a. Dual Workflow: By enabling this checkbox, users can allow managers to approve employees' remote punching requests.</li>
                <li>b. Geo Fencing: By enabling this checkbox, users can allow employees to punch in only from the allowed location.</li>
                <li>c. Extra Allowance: By enabling this checkbox, users can allow employees to add extra amounts to salaries, which can be specified in the setup.</li>
                <li>d. Shift Allowance: By enabling this checkbox, accountants can approve employees' shift requests after the manager’s approval. Additionally, users can set shift allowance amounts to be added to the employees’ salary slip.</li>
                <li>e. Extra Day: If any employee works on holidays or extra days, they can apply for extra days in the attendance and calendar. This setup allows employees to apply for extra days.</li>
                <li>f. Overtime Allowance: By enabling the checkbox, users can allow an allowance to be added to the salary slip if any employee works overtime. Users can set amounts on an hourly basis.</li>
              </ul>
            </li>
            <li>
              <strong>⚫ </strong> Training: Here, users need to do some basic setup for the training feature.
            </li>
            <li>
              <strong>⚫ </strong> Performance Management: Here, users need to do settings for performance management.
            </li>
            <li>
              <strong>⚫ </strong> PF and ESIC Calculation: Users need to do the setup of PF and ESIC rates according to government norms.
              <div style={{ margin: "10px 0" }}>
                <img
                  src={setup2}
                  alt="PF and ESIC Calculation"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </div>
            </li>
            <li>
              <strong>⚫ </strong> Letter Types Setup: This setup is regarding the types of letters that users want to add for employees.
            </li>
          </ul>
        ),
      },          
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>How-to Documents</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {sections.map((section) => (
          <div
            key={section.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onClick={() => toggleCard(section.id)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#333" }}>{section.title}</h3>
              <span style={{ fontSize: "18px", color: "#333" }}>
                {activeCard === section.id ? "▲" : "▼"}
              </span>
            </div>
            {activeCard === section.id && (
              <div
                style={{
                  marginTop: "15px",
                  borderTop: "1px solid #eee",
                  paddingTop: "15px",
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
  
};

export default HowToDocuments;
