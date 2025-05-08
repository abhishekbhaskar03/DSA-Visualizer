import React from "react";
import "../css/About.css";

const teamMembers = [
  { name: "Akansha Maheshwari", Std_Id: "BCS2021141", Course: "B.Tech(CSE)" },
  { name: "Abhishek Kumar", Std_Id: "BCS2021013", Course: "B.Tech(CSE)" },
  { name: "Anant Kumar Saraswat", Std_Id: "BCS2021098", Course: "B.Tech(CSE)" },
  { name: "Shradhey Rastogi", Std_Id: "BCS2021071", Course: "B.Tech(CSE)" },
  { name: "Harshit Maheshwari", Std_Id: "BCS2022193", Course: "B.Tech(CSE)" },
];

const contacts = [
  { phone: "+91 9555530095", email: "akansha@gmail.com" },
  { phone: "+91 6387522985", email: "abhishek@gmail.com" },
  { phone: "+91 9058861232", email: "anant@gmail.com" },
  { phone: "+91 9027902814", email: "shradhey@gmail.com" },
  { phone: "+91 8449135691", email: "harshit@gmail.com" },
];

const AboutUs = () => {
  return (
    <div className="offices-container">
      <h1>About Us</h1>
      <p className="description">
        Meet our passionate team behind the Data Structures & Algorithms Visualizer.
        We're dedicated to simplifying complex programming concepts for learners everywhere.
      </p>
      <div className="offices-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="office-card">
            <h3>{member.name}</h3>
            <p><strong>{member.Std_Id}</strong></p>
            <p>{member.Course}</p>
            <hr />
            <p className="contact">Contact</p>
            <p>T: {contacts[index].phone}</p>
            <p>
              E: <a href={`mailto:${contacts[index].email}`} className="view-map">
                {contacts[index].email}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
