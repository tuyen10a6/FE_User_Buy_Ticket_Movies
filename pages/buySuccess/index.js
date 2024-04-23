import React from "react";

const BuySuccess = () => {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        maxWidth: "500px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h2 style={{ color: "green" }}>Đặt vé thành công!</h2>
      <p>
        Cảm ơn bạn đã đặt vé xem phim của chúng tôi. Chúc bạn có một buổi xem
        phim thú vị! Vui lòng cung cấp số điện thoại khi đến rạp phim
      </p>
    </div>
  );
};

export default BuySuccess;
