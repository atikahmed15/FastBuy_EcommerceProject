// CustomModal.jsx
import React, { useEffect, useState } from "react";
import "./assets/modalStyles.css";

const CustomModal = ({ modalType, onClose, onSubmit, response }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    month: "",
    year: "",
    date: "",
  });

  const [inputValue, setInputValue] = useState(""); // Generalized input for delete/view

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeneralInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (modalType) {
      case "addProduct":
        onSubmit({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
        });
        break;
      case "deleteProduct":
        onSubmit({ productId: parseInt(inputValue, 10) });
        break;
      case "viewUser":
        onSubmit({ userId: parseInt(inputValue, 10) });
        break;
      case "monthlyBusiness":
        onSubmit({ month: formData.month, year: formData.year });
        break;
      case "dailyBusiness":
        onSubmit({ date: formData.date });
        break;
      case "yearlyBusiness":
        onSubmit({ year: formData.year });
        break;
      case "overallBusiness":
        onSubmit();
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Add Product Form */}
        {modalType === "addProduct" &&
          (!response ? (
            <>
              <h2>Add Product</h2>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-form-item">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="stock">Stock:</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="categoryId">Category ID:</label>
                  <input
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    placeholder="Category ID"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="imageUrl">Image URL:</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="button" onClick={onClose}>
                    Go Back
                  </button>
                </div>
              </form>
            </>
          ) : (
            <ProductDetails response={response} onClose={onClose} />
          ))}

        {/* Delete Product */}
        {modalType === "deleteProduct" && (
          <>
            {!response ? (
              <form onSubmit={handleSubmit}>
                <h2>Delete Product</h2>
                <input
                  type="number"
                  placeholder="Enter Product ID"
                  value={inputValue}
                  onChange={handleGeneralInputChange}
                />
                <div className="modal-buttons">
                  <button type="submit">Delete</button>
                  <button type="button" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="button" onClick={onClose}>
                    Go Back
                  </button>
                </div>
              </form>
            ) : (
              <div className="modal-buttons">
                <h2>Product Deleted Successfully</h2>
                <button onClick={onClose}>Close</button>
                <button onClick={onClose}>Go Back</button>
              </div>
            )}
          </>
        )}

        {/* View User */}
        {modalType === "viewUser" && <ViewUserFormComponent onClose={onClose} />}

        {/* Modify User */}
        {modalType === "modifyUser" && <ModifyUserFormComponent onClose={onClose} />}

        {/* Business Modals */}
        {["monthlyBusiness", "dailyBusiness", "yearlyBusiness", "overallBusiness"].includes(modalType) && (
          <BusinessModal
            modalType={modalType}
            formData={formData}
            setFormData={setFormData}
            response={response}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CustomModal;

// ---------- Subcomponents ----------

const ProductDetails = ({ response, onClose }) => (
  <>
    <h2>Product Details</h2>
    <div className="full-products">
      <div className="product-details img">
        <img src={response.product.imageUrl} alt="product" />
      </div>
      <div className="product-details-info">
        {["name", "description", "price", "stock"].map((key) => (
          <div key={key} className="product-details">
            <div>{key.charAt(0).toUpperCase() + key.slice(1)} :</div>
            <div>{response.product.product[key]}</div>
          </div>
        ))}
        <div className="product-details">
          <div>Category :</div>
          <div>{response.product.product.category.categoryName}</div>
        </div>
      </div>
    </div>
    <div className="modal-buttons">
      <button onClick={onClose}>Close</button>
      <button onClick={onClose}>Go Back</button>
    </div>
  </>
);

const ViewUserFormComponent = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:9090/admin/user/getbyid?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const user = await res.json();
         console.log("Fetched user:", user);
        setUserDetails(user);
      } else {
        console.log("Error fetching user:", res.status, res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!userDetails) {
    return (
      <form onSubmit={handleFetchUser}>
        <div className="modal-form-item">
          <label htmlFor="user-id">User ID:</label>
          <input
            type="text"
            id="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button type="submit">Get User</button>
          <button type="button" onClick={onClose}>Go Back</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <h2>User Details</h2>
      <div className="user-details">
  <p><strong>User ID:</strong> {userDetails.userId}</p>
  <p><strong>Username:</strong> {userDetails.username}</p>
  <p><strong>Email:</strong> {userDetails.email}</p>
  <p><strong>Role:</strong> {userDetails.role}</p>
  <p><strong>Created At:</strong> {userDetails.createdAt}</p>
  <p><strong>Updated At:</strong> {userDetails.updatedAt}</p>
</div>

      <div className="modal-buttons">
        <button onClick={onClose}>Close</button>
        <button onClick={onClose}>Go Back</button>
      </div>
    </div>
  );
};

const ModifyUserFormComponent = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [updated, setUpdated] = useState(false);

   useEffect(() => {
    console.log("Current userDetails:", userDetails);
  }, [userDetails]);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:9090/admin/user/getbyid?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const user = await res.json();
        setUserDetails(user);
      } else {
        console.log("Error fetching user:", res.status, res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const role = formData.get("role");

    try {
      const res = await fetch("http://localhost:9090/admin/user/modify", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userDetails.userId,
          username,
          email,
          role,
        }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUserDetails(updatedUser);
        setUpdated(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!userDetails) {
    return (
      <form onSubmit={handleFetchUser}>
        <div className="modal-form-item">
          <label htmlFor="user-id">User ID:</label>
          <input
            type="text"
            id="user-id"
            name="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button type="submit">Get User</button>
          <button type="button" onClick={onClose}>Go Back</button>
        </div>
      </form>
    );
  }

  if (userDetails && !updated) {
    return (
      <form onSubmit={handleUpdateUser} className="modal-form">
        <div className="modal-form-item">
          <label htmlFor="user-id">User ID:</label>
          <input
            type="text"
            id="user-id"
            name="user-id"
            value={userDetails.userId}
            readOnly
          />
        </div>
        <div className="modal-form-item">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={userDetails.username}
          />
        </div>
        <div className="modal-form-item">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={userDetails.email}
          />
        </div>
        <div className="modal-form-item">
          <label htmlFor="role">Role:</label>
          <input type="text" id="role" name="role" defaultValue={userDetails.role} />
        </div>
        <div className="modal-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Go Back</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <h2>Updated User Details</h2>
      <div className="user-details">
        <p><strong>User ID:</strong> {userDetails.userId}</p>
        <p><strong>Username:</strong> {userDetails.username}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Role:</strong> {userDetails.role}</p>
      </div>
      <div className="modal-buttons">
        <button onClick={onClose}>Close</button>
        <button onClick={onClose}>Go Back</button>
      </div>
    </div>
  );
};

const BusinessModal = ({ modalType, formData, setFormData, response, handleSubmit, onClose }) => (
  <form className="modal-form" onSubmit={handleSubmit}>
    {!response && (
      <>
        {modalType === "monthlyBusiness" && (
          <>
            <div className="modal-form-item">
              <label htmlFor="month">Month:</label>
              <input
                type="number"
                id="month"
                name="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </div>
            <div className="modal-form-item">
              <label htmlFor="year">Year:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
          </>
        )}
        {modalType === "dailyBusiness" && (
          <div className="modal-form-item">
            <label htmlFor="date">Date:</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        )}
        {modalType === "yearlyBusiness" && (
          <div className="modal-form-item">
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
        )}
        <div className="modal-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Go Back</button>
        </div>
      </>
    )}
    {response && (
      <div>
        <div className="business-response-item">
          <div>Total Business: ₹ </div>
          <div>{response[modalType]?.totalBusiness?.toFixed(2)}</div>
        </div>
        <div className="business-response-item">
          <h5>Category Sales</h5>
        </div>
        {response[modalType] &&
          Object.keys(response[modalType]?.categorySales || {}).map((key) => (
            <div key={key} className="business-response-item">
              <div>{key}</div>
              <div>{response[modalType].categorySales[key]}</div>
            </div>
          ))}
        <div className="modal-buttons">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" onClick={onClose}>Go Back</button>
        </div>
      </div>
    )}
  </form>
);
