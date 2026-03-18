import { Plus, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { BiomarkerRow } from "../components/BiomarkerRow";
import { type Biomarker, biomarkers } from "../data/mockData";

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #141B24 0%, #1A2330 100%)",
      border: "1px solid #243041",
      borderTop: "1px solid rgba(39,224,195,0.25)",
      borderRadius: 12,
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e2a38" }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "#6F7F92",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

export const Labs: React.FC = () => {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">(
    "idle",
  );
  const [showForm, setShowForm] = useState(false);
  const [markers, setMarkers] = useState<Biomarker[]>(biomarkers);
  const [form, setForm] = useState({
    name: "",
    value: "",
    unit: "",
    date: "",
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadState("uploading");
      setTimeout(() => setUploadState("done"), 1800);
    }
  };

  const handleAdd = () => {
    if (!form.name || !form.value) return;
    const val = Number.parseFloat(form.value);
    const newMarker: Biomarker = {
      id: String(Date.now()),
      name: form.name,
      value: val,
      unit: form.unit,
      date: form.date || new Date().toISOString().split("T")[0],
      optimalMin: 0,
      optimalMax: val * 1.2,
      status: "optimal",
      category: "Manual",
    };
    setMarkers([...markers, newMarker]);
    setForm({ name: "", value: "", unit: "", date: "" });
    setShowForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div
          style={{
            fontSize: 11,
            color: "#6F7F92",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          LAB MODULE
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#E8EEF6" }}>
          Labs &amp; Biomarkers
        </h1>
        <div style={{ fontSize: 13, color: "#9AA8B8", marginTop: 2 }}>
          Functional longevity ranges &#x2014; not standard hospital ranges
        </div>
      </div>

      {/* Upload + Add buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <label
          htmlFor="lab-pdf-upload"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid rgba(39,224,195,0.4)",
            background: "rgba(39,224,195,0.08)",
            color: "#27E0C3",
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.15s",
          }}
        >
          <Upload size={15} />
          {uploadState === "idle" && "Upload Lab Report (PDF)"}
          {uploadState === "uploading" && "Processing..."}
          {uploadState === "done" && "\u2713 Report Ingested"}
          <input
            id="lab-pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid #243041",
            background: "#1A2330",
            color: "#9AA8B8",
            fontSize: 13,
          }}
        >
          <Plus size={15} /> Add Marker Manually
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card title="Add Biomarker">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 12,
              alignItems: "end",
            }}
          >
            {(
              [
                ["Marker Name", "name", "text"],
                ["Value", "value", "number"],
                ["Unit", "unit", "text"],
                ["Date", "date", "date"],
              ] as [string, string, string][]
            ).map(([label, key, type]) => (
              <div key={key}>
                <label
                  htmlFor={`field-${key}`}
                  style={{
                    fontSize: 11,
                    color: "#6F7F92",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </label>
                <input
                  id={`field-${key}`}
                  type={type}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  placeholder={label}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "#0d1218",
                    border: "1px solid #243041",
                    color: "#E8EEF6",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleAdd}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "#27E0C3",
                color: "#0B0F14",
                fontWeight: 600,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "transparent",
                color: "#9AA8B8",
                fontSize: 13,
                border: "1px solid #243041",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Markers table */}
      <Card title={`Biomarker Panel \u2014 ${markers.length} Markers`}>
        {markers.map((m) => (
          <BiomarkerRow key={m.id} marker={m} />
        ))}
      </Card>

      {/* Functional ranges reference */}
      <Card title="Functional Longevity Ranges Reference">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              name: "hs-CRP",
              standard: "< 3.0 mg/L",
              functional: "< 1.0 mg/L",
              note: "Systemic inflammation marker",
            },
            {
              name: "HbA1c",
              standard: "< 5.7%",
              functional: "4.8\u20135.4%",
              note: "Glycemic control & aging",
            },
            {
              name: "Homocysteine",
              standard: "< 15 \u00b5mol/L",
              functional: "< 8.0 \u00b5mol/L",
              note: "Cardiovascular & cognitive risk",
            },
            {
              name: "DHEA-S",
              standard: "45\u2013375 \u00b5g/dL",
              functional: "200\u2013350 \u00b5g/dL",
              note: "Hormonal age proxy",
            },
            {
              name: "Insulin (Fasting)",
              standard: "< 25 \u00b5IU/mL",
              functional: "< 5.0 \u00b5IU/mL",
              note: "Metabolic sensitivity",
            },
            {
              name: "Vitamin D",
              standard: "20\u201350 ng/mL",
              functional: "50\u201380 ng/mL",
              note: "Immune & longevity regulator",
            },
          ].map((r) => (
            <div
              key={r.name}
              style={{
                padding: 12,
                background: "#0d1218",
                borderRadius: 8,
                border: "1px solid #1e2a38",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#E8EEF6",
                  marginBottom: 6,
                }}
              >
                {r.name}
              </div>
              <div style={{ fontSize: 11, color: "#9AA8B8", marginBottom: 2 }}>
                Standard: <span style={{ color: "#F5A623" }}>{r.standard}</span>
              </div>
              <div style={{ fontSize: 11, color: "#9AA8B8", marginBottom: 6 }}>
                Functional:{" "}
                <span style={{ color: "#2FE6B7" }}>{r.functional}</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6F7F92",
                  fontStyle: "italic",
                }}
              >
                {r.note}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
