// attendance.js — integrates with Node.js + MongoDB backend

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#attendanceTable tbody");
  const saveBtn = document.getElementById("saveAttendance");
  const dateInput = document.getElementById("attendanceDate");

  if (!tableBody || !saveBtn) {
    console.error("Attendance: missing DOM elements (tableBody or saveBtn)");
    return;
  }

  // --- Load registered students from localStorage (still works for old data)
  const oldStudents = JSON.parse(localStorage.getItem("students")) || [];
  const newStudents = JSON.parse(localStorage.getItem("newStudents")) || [];

  const allStudents = [
    ...oldStudents.map((s) => ({
      name: s.name || s.fullname || "",
      className: s.class || s.className || "",
      admissionNo: s.admissionNo || s.admission || "",
    })),
    ...newStudents.map((s) => ({
      name: s.fullname || s.name || "",
      className: s.class || s.className || "",
      admissionNo: s.admissionNo || s.newAdmissionNo || "",
    })),
  ];

  // --- Render table
  function renderTable() {
    tableBody.innerHTML = "";
    allStudents.forEach((student, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.className)}</td>
        <td>${escapeHtml(student.admissionNo || "-")}</td>
        <td>
          <select id="status-${idx}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  renderTable();

  // --- Save attendance to MongoDB through backend
  saveBtn.addEventListener("click", async () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert("Please select a date before saving attendance.");
      return;
    }

    const attendanceData = allStudents.map((s, idx) => {
      const select = document.getElementById(`status-${idx}`);
      return {
        name: s.name,
        className: s.className,
        admissionNo: s.admissionNo || "-",
        status: select ? select.value : "Not marked",
        date: selectedDate,
      };
    });

    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, records: attendanceData }),
      });

      if (!res.ok) {
        throw new Error("Failed to save attendance");
      }

      const result = await res.json();
      alert(`✅ Attendance for ${selectedDate} saved successfully.`);
      console.log("Saved attendance:", result);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving attendance. Check console for details.");
    }
  });

  // --- Utility to avoid HTML injection
  function escapeHtml(text) {
    if (!text && text !== 0) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
