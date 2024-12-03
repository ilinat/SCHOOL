const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  teacherLoginBtn = document.querySelector("#teacherlogin"),
  studentLoginBtn = document.querySelector("#studentlogin"),
  pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

studentLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
  });
teacherLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});

//attendance//
// document.addEventListener('DOMContentLoaded', () => {
    // Simulate fetching data from a database
    // const attendancePercentage = 75; // Replace this with actual data fetching logic

    // const progressCircle = document.getElementById('.progress-circle');
    // const progressText = document.getElementById('.progress-text');

    // Update the progress bar
    // progressCircle.style.background = `conic-gradient(#4caf50 ${attendancePercentage}%, #ddd ${attendancePercentage}% 100%)`;
    // progressText.textContent = `${attendancePercentage}%`;
// });


//arko attendance//
//document.addEventListener('DOMContentLoaded', function() {
  //  const checkboxes= document.querySelectorAll('.attendance');

    //checkboxes.forEach(checkbox => {
      //  checkbox.addEventListener('change', function(){
        //    const studentId= this.getAttribute('data-student');

//            const totalCell= document.getElementById('total-${studentId}');
  //          const studentCheckboxes= document.querySelectorAll('.attendance[data-student="${studentId}"]');
    //        let count=0;
      //      studentCheckboxes.forEach(cb => {
        //        if(cb.checked) {
          //          count ++;
            //    }
           // });

            //totalCell.textContent= count;

        //});
    //});
// });

//arko attendance
// document.addEventListener('DOMContentLoaded', function() {
   // const checkboxes = document.querySelectorAll('.attendance');

   // checkboxes.forEach(checkbox => {
    //    checkbox.addEventListener('change', updateAttendance);
  //  });

    // function updateAttendance() {
    //    const students = {};

      //   checkboxes.forEach(checkbox => {
        //    const studentId = checkbox.getAttribute('data-student');

          //  if(!students[studentId]) {
          //      students[studentId] = 0;

         //   }

         //   if(checkbox.checked) {
         //       students[studentId]++;
       //     }
      //   });

       //  for(const studentId in students) {
      //    const totalCell = document.getElementById(`total-${studentId}`);
      //    if (totalCell) {
      //      totalCell.textContent = students[studentId];
      //    }
     //    }
   //     }
  //  });


  //attendance-teacher//
    // Handle attendance update submission
    document.getElementById('attendanceForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const studentId = document.getElementById('student_id').value;
      const date = document.getElementById('date').value;
      const status = document.getElementById('status').value;

      const token = localStorage.getItem('token');
      if (!token) {
          alert('You need to log in.');
          return;
      }

      const response = await fetch('/api/teacher/update-attendance', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ student_id: studentId, date: date, status: status })
      });

      const result = await response.json();
      if (response.ok) {
          alert('Attendance successfully updated!');
          document.getElementById('attendanceForm').reset();
      } else {
          alert('Error: ' + result.message);
      }
  });

  //attendance-student//
  async function fetchAttendance() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in to view attendance');
        window.location.href = '/login'; // Redirect to login page
        return;
    }

    // Fetch attendance data from the backend
    const response = await fetch('/api/student/attendance', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (response.ok) {
        // Prepare data for the pie chart
        const attendanceData = {
            labels: ['Present', 'Absent', 'Late'],
            datasets: [{
                label: 'Your Attendance',
                data: [
                    result.Present,   // Count of present days
                    result.Absent,    // Count of absent days
                    result.Late       // Count of late days
                ],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],  // Colors for each section
                borderColor: ['#218838', '#c82333', '#e0a800'],      // Border colors
                borderWidth: 1
            }]
        };

        // Render the pie chart using Chart.js
        const ctx = document.getElementById('attendanceChart').getContext('2d');
        const attendanceChart = new Chart(ctx, {
            type: 'pie', // Chart type (pie chart)
            data: attendanceData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw + ' days';
                            }
                        }
                    }
                }
            }
        });
    } else {
        alert('Error: ' + result.message);
    }
}

// Load attendance and render chart on page load
fetchAttendance();


    //event-teacher//

     // Retrieve events from localStorage or initialize an empty array
     let event = JSON.parse(localStorage.getItem('events')) || [];  //events lai event maah change gareko
               
     // Display events on page load
     window.onload = displayEvents;
      
     // Function to display events
     function displayEvents() {
         const eventsContainer = document.getElementById('events');
         eventsContainer.innerHTML = '';
      
         events.forEach(event => {
             const eventDiv = document.createElement('div');
             eventDiv.classList.add('event');
             eventDiv.innerHTML = `
     <h3>${event.title}</h3>
     <p><strong>Date:</strong> ${event.date}</p>
     <p><strong>Description:</strong> ${event.description}</p>
             `;
             eventsContainer.appendChild(eventDiv);
         });
     }
      
     // Handle form submission to add an event
     document.getElementById('eventForm').addEventListener('submit', function(event) {
         event.preventDefault();
      
         const title = document.getElementById('eventTitle').value;
         const date = document.getElementById('eventDate').value;
         const description = document.getElementById('eventDescription').value;
      
         // Create an event object
         const newEvent = {
             title: title,
             date: date,
             description: description
         };
      
         // Add the new event to the events array and save to localStorage
         events.push(newEvent);
         localStorage.setItem('events', JSON.stringify(events));
      
         // Clear the form inputs
         document.getElementById('eventForm').reset();
      
         // Display the updated events
         displayEvents();
     });

     //event-student//
     // Retrieve events from localStorage
let events = JSON.parse(localStorage.getItem('events')) || [];
 
// Display events on page load
window.onload = displayEvents;
 
// Function to display events
function displayEvents() {
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = '';
 
    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No events available at the moment.</p>";
    }
 
    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerHTML = `
<h3>${event.title}</h3>
<p><strong>Date:</strong> ${event.date}</p>
<p><strong>Description:</strong> ${event.description}</p>
        `;
        eventsContainer.appendChild(eventDiv);
    });
}

// Add student to the system
document.getElementById("addStudentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("studentFirstName").value;
  const lastName = document.getElementById("studentLastName").value;
  const email = document.getElementById("studentEmail").value;
  const enrollmentDate = document.getElementById("studentEnrollmentDate").value;

  const response = await fetch('/api/teacher/addStudent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          enrollment_date: enrollmentDate
      })
  });

  const result = await response.json();
  if (response.ok) {
      alert('Student added successfully!');
      loadStudents();  // Refresh the students list
  } else {
      alert('Error adding student: ' + result.message);
  }
});

// Edit student details
document.getElementById("editStudentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentId = document.getElementById("editStudentId").value;
  const firstName = document.getElementById("editStudentFirstName").value;
  const lastName = document.getElementById("editStudentLastName").value;
  const email = document.getElementById("editStudentEmail").value;

  const response = await fetch(`/api/teacher/editStudent/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email
      })
  });

  const result = await response.json();
  if (response.ok) {
      alert('Student updated successfully!');
      loadStudents();  // Refresh the students list
  } else {
      alert('Error updating student: ' + result.message);
  }
});

// Delete student
document.getElementById("deleteStudentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const studentId = document.getElementById("deleteStudentId").value;

  const response = await fetch(`/api/teacher/deleteStudent/${studentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();
  if (response.ok) {
      alert('Student deleted successfully!');
      loadStudents();  // Refresh the students list
  } else {
      alert('Error deleting student: ' + result.message);
  }
});

// Load the list of students (populate dynamically)
async function loadStudents() {
  const response = await fetch('/api/teacher/students');
  const students = await response.json();
  const studentsListDiv = document.getElementById('studentsList');
  studentsListDiv.innerHTML = '';  // Clear existing list

  students.forEach(student => {
      const studentDiv = document.createElement('div');
      studentDiv.innerHTML = `
<p><strong>${student.first_name} ${student.last_name}</strong></p>
<p>Email: ${student.email}</p>
<p>Enrollment Date: ${student.enrollment_date}</p>
<hr>
      `;
      studentsListDiv.appendChild(studentDiv);
  });
}

// Initial load of students
loadStudents();