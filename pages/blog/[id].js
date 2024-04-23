import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/v1/api/phim/${id}`
        );
        setBlog(response.data.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    const currentItemId = blog.id;

    // Kiểm tra xem giỏ hàng có trống không
    if (Object.keys(cartItems).length === 0) {
      // Nếu giỏ hàng trống, thêm mục mới vào giỏ hàng với quantity là 1
      cartItems[currentItemId] = {
        quantity: 1,
        id: blog.id,
        name: blog.ten_phim,
        hinh_anh: blog.image,
        price: blog.price,
      };
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert("Phim đã được thêm vào giỏ hàng.");
      return;
    }

    // Kiểm tra xem mục hiện tại đã có trong giỏ hàng chưa
    if (currentItemId in cartItems) {
      cartItems[currentItemId].quantity += 1;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert("Phim đã được thêm vào giỏ hàng.");
    } else {
      // Nếu mục không tồn tại trong giỏ hàng, hiển thị cảnh báo
      alert("Vui lòng thanh toán phim trong giỏ hàng.");
    }
  };

  return (
    <div style={styles.container}>
      {blog ? (
        <div>
          <Header isBlog={true}></Header>
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={`http://localhost:3003${blog.image}`}
                alt={blog.ten_phim}
                style={styles.image}
              />
            </div>

            <div style={styles.content}>
              <h1 style={{ fontSize: "50px" }}>
                {blog.ten_phim} | {blog.danh_muc.loai_phim}
              </h1>
              <p style={{ fontSize: "40px" }}>
                <strong style={{ fontSize: "20px" }}>Đạo diễn:</strong>{" "}
                {blog.dao_dien}
              </p>
              <p style={{ fontSize: "40px" }}>
                <strong>Ngày phát hành:</strong>{" "}
                {formatDate(blog.ngay_phat_hanh)}
              </p>
              <p style={{ fontSize: "40px" }}>
                <strong>Giá vé:</strong> {blog.price | Number} VNĐ
              </p>
              <p style={{ fontSize: "40px" }}>
                <strong>Thời lượng:</strong> {blog.thoi_luong} phút
              </p>
              <p style={{ fontSize: "30px" }}>
                <strong>Tóm tắt:</strong> {blog.tom_tat}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <button style={styles.button} onClick={addToCart}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
          <div>
            <img src="https://homepage.momocdn.net/img/momo-upload-api-230912110927-638301137672516955.jpeg" />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
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
  image: {
    width: "400px",
    textAlign: "center",
    marginBottom: 20,
    borderRadius: "15px",
  },
  content: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 5,
  },
  button: {
    padding: "10px 20px",
    fontSize: "20px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    textAlign: "center",
    margin: "20px",
  },
};

export default BlogDetail;
