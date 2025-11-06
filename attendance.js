document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#attendanceTable tbody");
  const saveBtn = document.getElementById("saveAttendance");
  const dateInput = document.getElementById("attendanceDate");

  if (!tableBody || !saveBtn) return;

  let allStudents = [];

  // --- Fetch all students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      allStudents = data.map((s) => ({
        id: s._id,
        name: s.fullname,
        className: s.className,
        admissionNo: s.admissionNo,
      }));

      renderTable();
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching students");
    }
  };

  // --- Render students in attendance table
  const renderTable = () => {
    tableBody.innerHTML = "";
    allStudents.forEach((student, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.className)}</td>
        <td>${escapeHtml(student.admissionNo)}</td>
        <td>
          <select id="status-${idx}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  // --- Save attendance
  saveBtn.addEventListener("click", async () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const attendanceData = allStudents.map((s, idx) => {
      const select = document.getElementById(`status-${idx}`);
      return {
        studentId: s.id, // store MongoDB _id for reference
        name: s.name,
        className: s.className,
        admissionNo: s.admissionNo,
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
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save attendance");
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

  // Fetch students on page load
  fetchStudents();
});
