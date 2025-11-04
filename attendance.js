// attendance.js — loads registered students (old + new) and saves attendance by date
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#attendanceTable tbody");
  const saveBtn = document.getElementById("saveAttendance");
  const dateInput = document.getElementById("attendanceDate");

  if (!tableBody || !saveBtn) {
    console.error("Attendance: missing DOM elements (tableBody or saveBtn)");
    return;
  }

  // Load students: note the keys your registration code uses
  const oldStudents = JSON.parse(localStorage.getItem("students")) || [];
  const newStudents = JSON.parse(localStorage.getItem("newStudents")) || [];

  // Normalize students into a common shape: { name, className, admissionNo }
  const allStudents = [
    ...oldStudents.map(s => ({
      name: s.name || s.fullname || "",
      className: s.class || s.className || "",
      admissionNo: s.admissionNo || s.admission || s.admissionNo || ""
    })),
    ...newStudents.map(s => ({
      name: s.fullname || s.name || "",
      className: s.class || s.className || "",
      admissionNo: s.admissionNo || s.newAdmissionNo || ""
    }))
  ];

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

  saveBtn.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert("Please select a date before saving attendance.");
      return;
    }

    const attendanceData = allStudents.map((s, idx) => {
      const select = document.getElementById(status-${idx});
      return {
        name: s.name,
        class: s.className,
        admissionNo: s.admissionNo || "-",
        status: select ? select.value : "Not marked"
      };
    });

    // store attendanceRecords as object keyed by date
    const records = JSON.parse(localStorage.getItem("attendanceRecords")) || {};
    records[selectedDate] = attendanceData;
    localStorage.setItem("attendanceRecords", JSON.stringify(records));

    alert(Attendance for ${selectedDate} saved.);
  });

  // small utility to avoid accidental HTML injection
  function escapeHtml(text) {
    if (!text && text !== 0) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});