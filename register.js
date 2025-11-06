document.addEventListener("DOMContentLoaded", () => {
  const newStudentForm = document.getElementById("newStudentForm");
  const newTableBody = document.querySelector("#newStudentsTable tbody");
  const newCount = document.getElementById("newcount");

  // Function to render students in the table
  const renderStudents = (students) => {
    newTableBody.innerHTML = ""; // Clear table
    newCount.textContent = students.length;

    students.forEach((student) => {
      const row = newTableBody.insertRow();
      row.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.age}</td>
        <td>${student.className}</td>
        <td>${student.admissionNo}</td>
        <td>${student.parentName}</td>
        <td>${student.contact}</td>
        <td>${student.address}</td>
        <td>${student.lastSchool}</td>
        <td><button onclick="deleteStudent('${student._id}')">❌</button></td>
      `;
    });
  };

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      renderStudents(data.filter((s) => s.type === "New")); // Only New students
    } catch (err) {
      console.error(err);
    }
  };

  // Register New Student
  newStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentData = {
      type: "New",
      fullname: document.getElementById("fullname").value,
      age: document.getElementById("age").value,
      className: document.getElementById("class").value,
      admissionNo: document.getElementById("newAdmissionNo").value,
      parentName: document.getElementById("parent").value,
      contact: document.getElementById("contact").value,
      address: document.getElementById("address").value,
      lastSchool: document.getElementById("school").value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (!res.ok) throw new Error("Failed to register student");
      const data = await res.json();

      alert("✅ Student registered successfully!");
      fetchStudents(); // Refresh table after registration
      newStudentForm.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Error saving student.");
    }
  });

  // Delete student function (make it global)
  window.deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      fetchStudents(); // Refresh table after deletion
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting student.");
    }
  };

  // Initial fetch on page load
  fetchStudents();
});

document.addEventListener("DOMContentLoaded", () => {
  const oldStudentForm = document.getElementById("registerForm");
  const oldTableBody = document.querySelector("#studentsTable tbody");

  // Function to render old students in the table
  const renderOldStudents = (students) => {
    oldTableBody.innerHTML = ""; // Clear table

    students.forEach((student) => {
      const row = oldTableBody.insertRow();
      row.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.className}</td>
        <td>${student.admissionNo}</td>
        <td><button onclick="deleteOldStudent('${student._id}')">❌</button></td>
      `;
    });
  };

  // Fetch old students from backend
  const fetchOldStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      renderOldStudents(data.filter((s) => s.type === "Old")); // Only Old students
    } catch (err) {
      console.error(err);
    }
  };

  // Register Old Student
  oldStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentData = {
      type: "Old",
      fullname: document.getElementById("studentName").value,
      className: document.getElementById("studentClass").value,
      admissionNo: document.getElementById("admissionNo").value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (!res.ok) throw new Error("Failed to register student");
      const data = await res.json();

      alert("✅ Old student registered successfully!");
      fetchOldStudents(); // Refresh table after registration
      oldStudentForm.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Error saving student.");
    }
  });

  // Delete old student function
  window.deleteOldStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      fetchOldStudents(); // Refresh table after deletion
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting student.");
    }
  };

  // Initial fetch on page load
  fetchOldStudents();
});
