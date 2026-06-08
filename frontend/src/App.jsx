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
const [passTypeId, setPassTypeId] = useState(1);
const [passes, setPasses] = useState([]);
const [showPasses, setShowPasses] = useState(false);
const [showQR, setShowQR] = useState(false);
const [selectedQRToken, setSelectedQRToken] = useState("");
const [pendingPasses, setPendingPasses] = useState([]);
const [gateLogs, setGateLogs] = useState([]);
const [showPendingPasses, setShowPendingPasses] = useState(false);
const [showGateScanner, setShowGateScanner] = useState(false);
const [scanToken, setScanToken] = useState("");
const [scanAction, setScanAction] = useState("EXIT");
const [approvedCount, setApprovedCount] = useState(0);
const [pendingCount, setPendingCount] = useState(0);
const [rejectedCount, setRejectedCount] = useState(0);
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
fetchMyPasses();

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
           user_id: user.id,
          pass_type_id: passTypeId,
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
const approved = data.filter(
  (pass) => pass.status === "approved"
).length;

const pending = data.filter(
  (pass) => pass.status === "pending"
).length;

const rejected = data.filter(
  (pass) => pass.status === "rejected"
).length;

setApprovedCount(approved);
setPendingCount(pending);
setRejectedCount(rejected);
const approvedPasses = data
  .filter(
    (pass) => pass.status === "approved" && pass.qr_token
  )
  .sort((a, b) => b.id - a.id);

if (approvedPasses.length > 0) {
  setSelectedQRToken(
    approvedPasses[0].qr_token
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

    let pending = [];

if (user?.role_id === 5) {
  // Hostel Superintendent

  pending = data.filter(
    (pass) =>
      pass.status === "pending" &&
      pass.pass_type_id !== 5
  );
}

else if (user?.role_id === 6) {
  // Conference Supervisor

  pending = data.filter(
    (pass) =>
      pass.status === "pending" &&
      pass.pass_type_id === 5
  );
}

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
          action: scanAction,
      
         scanned_by_user_id: user.id,
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
const fetchGateLogs = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/gate/logs"
    );

    const data = await response.json();

    setGateLogs(data);
  } catch (error) {
    console.error(error);

    alert("Failed to fetch gate logs");
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
    backgroundImage: "url('/bits-campus.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
        <div
  style={{
    background: "rgba(30,41,59,0.92)",
    padding: "35px",
    borderRadius: "15px",
    width: "380px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    backdropFilter: "blur(8px)",
  }}
>
           <h1
  style={{
    textAlign: "center",
    color: "white",
    fontSize: "48px",
    lineHeight: "1.2",
    marginBottom: "10px",
    fontWeight: "bold",
  }}
>
  DADU GatePass
</h1>

<p
  style={{
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: "25px",
  }}
>
  BITS Pilani Hyderabad Campus
</p>

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
    padding: "12px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
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
    minHeight: "100vh",

    backgroundImage:
      "linear-gradient(rgba(10,15,35,0.85), rgba(10,15,35,0.85)), url('/bits-campus.jpg')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
          <h1
  style={{
    color: "white",
  }}
>
  DADU GatePass Dashboard
</h1>
<p
  style={{
    color: "#d1d5db",
    fontSize: "20px",
    marginTop: "-10px",
    marginBottom: "30px",
    textAlign: "center",
  }}
>
  BITS Pilani Hyderabad Campus
</p>

         <h2
  style={{
    color: "white",
  }}
>
  Welcome {user?.name}
</h2>
{user?.role_id !== 4 && (
  <>
<h3

  style={{
    color: "white",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "20px",
    fontSize: "24px",
  }}
>
  Dashboard Overview
</h3>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px",
    marginBottom: "40px",
  }}
>
  <div
    style={{
      background: "#1e293b",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      minWidth: "160px",
      textAlign: "center",
    }}
  >
    <h1>{passes.length}</h1>
    <p>Total Passes</p>
  </div>

  <div
    style={{
      background: "#166534",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      minWidth: "160px",
      textAlign: "center",
    }}
  >
    <h1>{approvedCount}</h1>
    <p>Approved</p>
  </div>

  <div
    style={{
      background: "#d97706",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      minWidth: "160px",
      textAlign: "center",
    }}
  >
    <h1>{pendingCount}</h1>
    <p>Pending</p>
  </div>

  <div
    style={{
      background: "#b91c1c",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      minWidth: "160px",
      textAlign: "center",
    }}
  >
    <h1>{rejectedCount}</h1>
    <p>Rejected</p>
  </div>
</div>
 </>
)}
<div
  style={{
    position: "absolute",
    top: "40px",
    right: "40px",
  }}
>
  <button
    onClick={() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "12px 20px",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    Logout
  </button>
</div>

         <div
  style={{
    display: "grid",
   gridTemplateColumns: "repeat(auto-fit, minmax(240px, 240px))",
justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
    maxWidth: "1000px",
  }}
>
  {(user?.role_id === 1 || user?.role_id === 2) && (
            <button
  onClick={() => {
    setShowApplyForm(true);
  }}
  style={{
    height: "130px",
    minWidth: "220px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  }}
>
  ➕<br />
  Apply New Pass
</button>
)}
{user?.role_id !== 4 && (
            <button
  onClick={fetchMyPasses}
  style={{
    height: "130px",
    minWidth: "220px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  }}
>
  📋<br />
  My Passes
</button>
)}
{(user?.role_id === 5 || user?.role_id === 6) && (
  <button
  onClick={fetchPendingPasses}
  style={{
    height: "130px",
    minWidth: "220px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  }}
>
  ⏳<br />
  Pending Requests
</button>
)}
{user?.role_id !== 4 && (
          <button
  onClick={() => {
    fetchMyPasses();
    setShowQR(true);
  }}
  style={{
    height: "130px",
    minWidth: "220px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  }}
>
  📱<br />
  View QR Pass
</button>
)}
{user?.role_id === 4 && (
<button
  onClick={() => {
    setShowGateScanner(true);
    fetchGateLogs();
  }}
  style={{
    height: "130px",
    minWidth: "220px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  }}
>
  🚪<br />
  Gate Scanner
</button>
)}
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
<select
  value={passTypeId}
  onChange={(e) => setPassTypeId(Number(e.target.value))}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
>
  {user?.role_id === 1 && (
    <>
      <option value={1}>Day Pass</option>
      <option value={2}>Outstation Pass</option>
      <option value={3}>Vacation Pass</option>
      <option value={4}>Visitor Pass</option>
    </>
  )}

  {user?.role_id === 2 && (
    <>
      <option value={4}>Visitor Pass</option>
      <option value={5}>Conference Pass</option>
    </>
  )}
</select>
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
             
              <h2
  style={{
    textAlign: "center",
    color: "#1e293b",
    marginBottom: "20px",
    fontSize: "32px",
    fontWeight: "bold",
  }}
>
  My Passes
</h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Pass Type</th>
                    <th>Destination</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {passes.map((pass) => (
                    <tr key={pass.id}>
                      <td>{pass.id}</td>
                      <td>
  {pass.pass_type_id === 1
    ? "Day Pass"
    : pass.pass_type_id === 2
    ? "Outstation Pass"
    : pass.pass_type_id === 3
    ? "Vacation Pass"
    : pass.pass_type_id === 4
    ? "Visitor Pass"
    : "Conference Pass"}
</td>
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
  <h2
  style={{
    textAlign: "center",
    color: "#1e293b",
    marginBottom: "20px",
    fontSize: "32px",
    fontWeight: "bold",
  }}
>
  Gate Scanner
</h2>

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
    <select
  value={scanAction}
  onChange={(e) => setScanAction(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
>
  <option value="ENTRY">ENTRY</option>
  <option value="EXIT">EXIT</option>
</select>

    <button onClick={scanPassAtGate}>
      Verify Pass
    </button>
    <div style={{ marginTop: "20px" }}>
  <h3>Recent Scans</h3>

  {gateLogs.map((log) => (
    <div
      key={log.id}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <p><strong>Pass ID:</strong> {log.pass_id}</p>
      <p><strong>Action:</strong> {log.action}</p>
    </div>
  ))}
</div>
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