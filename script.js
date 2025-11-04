// ====== REGISTER OLD STUDENTS ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const tableBody = document.querySelector("#studentsTable tbody");
  let students = JSON.parse(localStorage.getItem("students")) || [];

  // Display saved students
  students.forEach((student, index) => addStudentRow(student, index));

  form?.addEventListener("submit", e => {
    e.preventDefault();

    const student = {
      name: document.getElementById("studentName").value,
      class: document.getElementById("studentClass").value,
      admissionNo: document.getElementById("admissionNo").value
    };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    addStudentRow(student, students.length - 1);
    form.reset();
    alert("Old student registered successfully!");
  });

  function addStudentRow(student, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.class}</td>
      <td>${student.admissionNo}</td>
      <td><button class="deleteBtn">Delete</button></td>
    `;

    // Delete function
    row.querySelector(".deleteBtn").addEventListener("click", () => {
      students.splice(index, 1);
      localStorage.setItem("students", JSON.stringify(students));
      row.remove();
    });

    tableBody.appendChild(row);
  }
});

// ====== REGISTER NEW STUDENTS ======
document.addEventListener("DOMContentLoaded", () => {
  const newForm = document.getElementById("newStudentForm");
  const newTableBody = document.querySelector("#newStudentsTable tbody");
  const newCount = document.getElementById("newcount"); // matches your HTML

  if (!newForm || !newTableBody || !newCount) return;

  let newStudents = JSON.parse(localStorage.getItem("newStudents")) || [];

  function renderNewStudents() {
    newTableBody.innerHTML = "";

    newStudents.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.age}</td>
        <td>${student.className}</td>
        <td>${student.admissionNo}</td>
        <td>${student.parent}</td>
        <td>${student.contact}</td>
        <td>${student.address}</td>
        <td>${student.lastSchool}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      newTableBody.appendChild(row);
    });

    newCount.textContent = newStudents.length;

    // delete button
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        newStudents.splice(index, 1);
        localStorage.setItem("newStudents", JSON.stringify(newStudents));
        renderNewStudents();
      });
    });
  }

  renderNewStudents();

  newForm.addEventListener("submit", e => {
    e.preventDefault();

    const student = {
      fullname: document.getElementById("fullname").value.trim(),
      age: document.getElementById("age").value.trim(),
      className: document.getElementById("class").value.trim(),
      admissionNo: document.getElementById("newAdmissionNo").value.trim(),
      parent: document.getElementById("parent").value.trim(),
      contact: document.getElementById("contact").value.trim(),
      address: document.getElementById("address").value.trim(),
      lastSchool: document.getElementById("school").value.trim()
    };

    newStudents.push(student);
    localStorage.setItem("newStudents", JSON.stringify(newStudents));
    renderNewStudents();
    newForm.reset();
    alert("✅ New student registered successfully!");
  });
});