import { useState } from "react";
import { QRCode } from "react-qr-code";



function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [destination, setDestination] = useState("");
const [reason, setReason] = useState("");
const [passes, setPasses] = useState([]);
const [showPasses, setShowPasses] = useState(false);
const [showQR, setShowQR] = useState(false);
const [selectedQRToken, setSelectedQRToken] = useState("");
const [pendingPasses, setPendingPasses] = useState([]);
const [showPendingPasses, setShowPendingPasses] = useState(false);
const [showGateScanner, setShowGateScanner] = useState(false);
const [scanToken, setScanToken] = useState("");
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",       
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);

setUser(data.user);

setIsLoggedIn(true);
      console.log(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

 const handlePassSubmit = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/passes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          pass_type_id: 1,
          destination,
          reason,
          out_time: "2026-06-15 09:00:00",
          expected_in_time: "2026-06-15 18:00:00",
        }),
      }
    );
   

    const data = await response.json();

    if (response.ok) {
      alert("Pass Created Successfully!");

      console.log(data);

      setDestination("");
      setReason("");
      setShowApplyForm(false);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);

    alert("Failed to create pass");
  }
};
 const fetchMyPasses = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/passes"
    );

    const data = await response.json();
setPasses(data);

const approvedPasses = data.filter(
  (pass) => pass.status === "approved" && pass.qr_token
);

if (approvedPasses.length > 0) {
  setSelectedQRToken(
    approvedPasses[approvedPasses.length - 1].qr_token
  );
}

setShowPasses(true);
  } catch (error) {
    console.error(error);

    alert("Failed to fetch passes");
  }
};
const fetchPendingPasses = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/passes"
    );

    const data = await response.json();

    const pending = data.filter(
      (pass) => pass.status === "pending"
    );

    setPendingPasses(pending);

    setShowPendingPasses(true);
  } catch (error) {
    console.error(error);

    alert("Failed to fetch pending passes");
  }
};
const approvePass = async (passId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/passes/${passId}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    fetchPendingPasses();
  } catch (error) {
    console.error(error);

    alert("Failed to approve pass");
  }
};
const scanPassAtGate = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/gate/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qr_token: scanToken,
          action: "exit",
          scanned_by_user_id: 3,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);
  } catch (error) {
    console.error(error);

    alert("Gate scan failed");
  }
};
const rejectPass = async (passId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/passes/${passId}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    fetchPendingPasses();
  } catch (error) {
    console.error(error);

    alert("Failed to reject pass");
  }
};
  return (
    <>
      {!isLoggedIn ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f6f8",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "350px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
           <h1
  style={{
    textAlign: "center",
    color: "#1e293b",
    fontSize: "48px",
    lineHeight: "1.2",
    marginBottom: "25px",
    fontWeight: "bold",
  }}
>
  DADU GatePass
</h1>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "15px" }}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "40px",
          }}
        >
          <h1
  style={{
    color: "white",
  }}
>
  DADU GatePass Dashboard
</h1>

         <h2
  style={{
    color: "white",
  }}
>
  Welcome {user?.name}
</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                setShowApplyForm(true);
              }}
            >

              Apply New Pass
            </button>

            <button onClick={fetchMyPasses}>
  My Passes
</button>
{user?.role_id === 5 && (
  <button onClick={fetchPendingPasses}>
    Pending Requests
  </button>
)}
           <button
  onClick={() => {
    fetchMyPasses();
    setShowQR(true);
  }}
>
  View QR Pass
</button>
<button
  onClick={() => {
    setShowGateScanner(true);
  }}
>
  Gate Scanner
</button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
              }}
            >
              Logout
            </button>
          </div>

          {showApplyForm && (
            <div
              style={{
                marginTop: "40px",
                background: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                color: "black",
                maxWidth: "500px",
              }}
            >
              <h2
  style={{
    color: "#1e293b",
    textAlign: "center",
  }}
>
  Apply New Pass
</h2>

              <input
  type="text"
  placeholder="Destination"
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>
<textarea
  placeholder="Reason"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

                           <button onClick={handlePassSubmit}>
                Submit Pass
              </button>
            </div>
          )}

          {showPasses && (
            <div
              style={{
                marginTop: "30px",
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                color: "black",
                maxWidth: "900px",
              }}
            >
             
              <h2>My Passes</h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Destination</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {passes.map((pass) => (
                    <tr key={pass.id}>
                      <td>{pass.id}</td>
                      <td>{pass.destination}</td>
                      <td>{pass.reason}</td>
                     <td
  style={{
    color:
      pass.status === "approved"
        ? "green"
        : pass.status === "pending"
        ? "orange"
        : "red",
    fontWeight: "bold",
  }}
>
  {pass.status.toUpperCase()}
</td>
                    </tr>
                  ))}
                </tbody>
             </table>
</div>
)}

{showQR && (
  <div
    style={{
      marginTop: "30px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      color: "black",
      maxWidth: "500px",
    }}
  >
    <h2
  style={{
    color: "#1e293b",
    textAlign: "center",
  }}
>
  QR Pass
</h2>

    <div
  style={{
    background: "white",
    padding: "15px",
    display: "inline-block",
    marginTop: "10px",
  }}
>
 <QRCode
  value={selectedQRToken}
/>
</div>
<p
  style={{
    marginTop: "15px",
    fontWeight: "bold",
    color: "#2563eb",
  }}
>
  {selectedQRToken}
</p>
    <p>
      Show this QR token at the gate.
    </p>
  </div>
)}
{showGateScanner && (
  <div
    style={{
      marginTop: "30px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      color: "black",
      maxWidth: "500px",
    }}
  >
    <h2>Gate Scanner</h2>

    <input
      type="text"
      placeholder="Enter QR Token"
      value={scanToken}
      onChange={(e) => setScanToken(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
      }}
    />

    <button onClick={scanPassAtGate}>
      Verify Pass
    </button>
  </div>
)}
{showPendingPasses && (
  <div
    style={{
      marginTop: "30px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      color: "black",
      maxWidth: "900px",
    }}
  >
    <h2>Pending Requests</h2>

    {pendingPasses.map((pass) => (
      <div
        key={pass.id}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "10px",
        }}
      >
        <p>
          <strong>ID:</strong> {pass.id}
        </p>

        <p>
          <strong>Destination:</strong> {pass.destination}
        </p>

        <p>
          <strong>Reason:</strong> {pass.reason}
        </p>
        <div
  style={{
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  }}
>
  <button
    onClick={() => approvePass(pass.id)}
    style={{
      backgroundColor: "green",
      color: "white",
      border: "none",
      padding: "8px 15px",
      cursor: "pointer",
      borderRadius: "5px",
    }}
  >
    Approve
  </button>

  <button
    onClick={() => rejectPass(pass.id)}
    style={{
      backgroundColor: "red",
      color: "white",
      border: "none",
      padding: "8px 15px",
      cursor: "pointer",
      borderRadius: "5px",
    }}
  >
    Reject
  </button>
</div>
      </div>
    ))}
  </div>
)}
        </div>
      )}
    </>
  );
}
export default App;