import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJob } from "../services/jobApi";

const cities = [
  "Riyadh","Jeddah","Dammam","Khobar","Jubail","Mecca","Medina","Taif",
  "Tabuk","Hail","Abha","Jazan","Najran","Al Ahsa"
];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Riyadh");
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");

  const handlePublish = async () => {
    try {
      setLoading(true);

      await postJob({
        name,
        companyName,
        phone,
        email,
        city,
        jobRole,
        description,
      });

      alert("Success! Your job is live ✅");
      navigate("/", { replace: true }); // ✅ auto home
    } catch (e) {
      console.error(e);
      alert("Failed to publish job ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <h1 style={title}>Post Your Job</h1>

      <div style={card}>
        <input style={inp} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={inp} placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <input style={inp} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input style={inp} placeholder="Email (for edit/delete verify)" value={email} onChange={(e) => setEmail(e.target.value)} />

        <select style={inp} value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input style={inp} placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />

        <textarea
          style={{ ...inp, height: 120, resize: "vertical" }}
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handlePublish} disabled={loading} style={btn}>
          {loading ? "Publishing..." : "Publish Job"}
        </button>
      </div>
    </div>
  );
}

const page = { padding: 16, paddingBottom: 90, background: "#ffffff", minHeight: "100vh" };
const title = { margin: 0, fontSize: 28, fontWeight: 950, color: "#0f172a" };

const card = {
  marginTop: 14,
  background: "#ffffff",
  border: "1px solid #eef2f7",
  borderRadius: 18,
  padding: 14,
  display: "grid",
  gap: 10,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const inp = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  outline: "none",
  background: "#ffffff",
  color: "#111827",
  fontSize: 14,
};

const btn = {
  padding: 14,
  borderRadius: 16,
  border: 0,
  background: "#1c8b3c",
  color: "white",
  fontWeight: 950,
  cursor: "pointer",
};
