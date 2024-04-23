import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import Router, { useRouter } from "next/router";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  let quantity = 0;
  if (typeof window !== "undefined" && window.localStorage) {
    const cartItemsFromLocalStorage = JSON.parse(
      localStorage.getItem("cartItems")
    );
    const productId = Object.keys(cartItemsFromLocalStorage)[0];
    quantity = cartItemsFromLocalStorage[productId].quantity;
  } else {
    console.error("LocalStorage is not available.");
  }

  const formatDateForMySQL = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [customerInfo, setCustomerInfo] = useState({
    lich_chieu_id: "",
    ten_khachhang: "",
    so_luong: quantity,
    sdt: "",
    email: "",
    thoi_gian_dat: formatDateForMySQL(new Date().toISOString()),
  });
  const handleInputChangeNameCustomer = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3003/v1/api/addDatVe",
        customerInfo
      );
      console.log(response.data);
      alert(
        "Vé đã được đặt thành công! Vui lòng cung cấp SĐT khi đến rạp phim"
      );

      Router.push("/buySuccess");

      // Xử lý kết quả thành công nếu cần thiết
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      alert("Vui lòng nhập đầy đủ thông tin");
      // Xử lý lỗi nếu cần thiết
    }
  };
  useEffect(() => {
    const fetchCartItems = () => {
      const storedCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || {};
      const cartItemsArray = Object.values(storedCartItems);
      setCartItems(cartItemsArray);
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || {};
        const cartItemsArray = Object.values(storedCartItems);

        const promises = cartItemsArray.map((item) =>
          axios.get(`http://localhost:3003/v1/api/phimByLichChieu/${item.id}`)
        );
        const responses = await Promise.all(promises);

        const showtimesData = responses.map((response) => response.data);

        setShowtimes(showtimesData);
        console.log(showtimesData);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, []);

  useEffect(() => {
    console.log("Showtimes updated:", showtimes);
  }, [showtimes]);

  const handleDeleteItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);

    if (updatedCartItems.length === 0) {
      localStorage.removeItem("cartItems");
    } else {
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  const handleSelectChange = (e) => {
    setSelectedShowtime(e.target.value);
    setCustomerInfo({ ...customerInfo, lich_chieu_id: e.target.value });
  };

  return (
    <div style={styles.container}>
      <Header isBlog={true} />
      <div style={styles.content}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerCell}>Image</th>
              <th style={styles.headerCell}>Name</th>
              <th style={styles.headerCell}>Price</th>
              <th style={styles.headerCell}>Quantity</th>
              <th style={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://localhost:3003${item.hinh_anh}`}
                    alt={item.ten_phim}
                    style={styles.image}
                  />
                </td>
                <td style={styles.cell}>{item.name}</td>
                <td style={styles.cell}>{item.price} VNĐ</td>
                <td style={styles.cell}>{item.quantity} vé</td>
                <td style={styles.cell}>
                  <button onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Chọn suất chiếu</h2>
          <select
            onChange={handleSelectChange}
            value={selectedShowtime}
            style={{
              padding: "5px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="">Chọn suất chiếu</option>
            {showtimes.length > 0 ? (
              showtimes[0].map((showtime) => (
                <option key={showtime.id} value={showtime.id}>
                  {showtime.rap && showtime.rap.ten_rap} |{" "}
                  {showtime.thoi_gian_bat_dau} đến {showtime.thoi_gian_ket_thuc}
                </option>
              ))
            ) : (
              <option disabled>Phim trên chưa có lịch chiếu...</option>
            )}
          </select>
        </div>

        {/* Form nhập thông tin khách hàng */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h2 style={{ marginBottom: 10 }}>Thông tin khách hàng</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label style={{ marginRight: 10, width: "200px !important" }}>
                Tên khách hàng:
              </label>
              <input
                type="text"
                required
                name="ten_khachhang"
                value={customerInfo.ten_khachhang}
                onChange={handleInputChangeNameCustomer}
                style={{
                  padding: "5px 10px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ marginRight: 30 }}>Số điện thoại:</label>
              <input
                type="text"
                name="sdt"
                required
                value={customerInfo.sdt}
                onChange={handleInputChangeNameCustomer}
                style={{
                  padding: "5px 10px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ marginRight: 80 }}>Email:</label>
              <input
                type="email"
                name="email"
                required
                value={customerInfo.email}
                onChange={handleInputChangeNameCustomer}
                style={{
                  padding: "5px 10px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Đặt vé
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: "auto",
    padding: 20,
  },
  content: {
    marginTop: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerCell: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    padding: 10,
    borderBottom: "1px solid #ddd",
  },
  image: {
    width: 100,
  },
};

export default Cart;
