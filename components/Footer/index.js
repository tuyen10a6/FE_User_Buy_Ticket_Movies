import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "20px 0",

    bottom: "0",
    width: "100%",
  };

  return (
    <footer style={footerStyle}>
      <div>
        <a href="#">About Us</a>
        <a href="#">Movies</a>
        <a href="#">Contact Us</a>
      </div>
      <div>
        <p>Address: Dân Tiến - Khoái Châu</p>
        <p>Email: lexuantruon@gmail.com</p>
        <p>Phone: 0858448789</p>
      </div>
      <div>
        <p>© 2024 Cinema. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
