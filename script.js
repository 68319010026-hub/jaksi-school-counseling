// ดึงเอลิเมนต์ต่างๆ จาก HTML มารอใช้งาน
const bookingForm = document.getElementById('bookingForm');
const tableBody = document.getElementById('tableBody');

// สร้างตัวแปรไว้นับลำดับที่ (เริ่มต้นที่ 2 เพราะใน HTML เราใส่ลำดับที่ 1 ไว้แล้ว)
let rowCount = 2;

// ดักจับเหตุการณ์เมื่อผู้ใช้กด "ส่งคำร้อง" (Submit Form)
bookingForm.addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตัวเองตอนกดส่ง

    // 1. ดึงค่าจากช่องกรอกข้อมูลต่างๆ
    const name = document.getElementById('studentName').value;
    const date = document.getElementById('appointmentDate').value;
    const problem = document.getElementById('problemDetail').value;

    // 2. สร้างแถวตาราง (tr) ขึ้นมาใหม่
    const newRow = document.createElement('tr');

    // 3. ใส่ข้อมูลเข้าไปในแต่ละคอลัมน์ (td)
    // สำหรับ "แนวทาง" และ "ผลลัพธ์" จะใส่เครื่องหมาย "-" ไว้ก่อน เพราะคุณครูยังไม่ได้มาประเมิน
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td>${date}</td>
        <td>${name}</td>
        <td>${problem}</td>
        <td>-</td>
        <td>-</td>
        <td><span class="status pending">รอรับคำปรึกษา</span></td>
    `;

    // 4. นำแถวใหม่ที่สร้างเสร็จแล้ว ไปต่อท้ายในตารางดั้งเดิม
    tableBody.appendChild(newRow);

    // 5. เพิ่มจำนวนลำดับที่ขึ้นทีละ 1 สำหรับคนต่อไป
    rowCount++;

    // 6. เคลียร์ข้อมูลในฟอร์มให้ว่าง พร้อมสำหรับการกรอกครั้งต่อไป
    bookingForm.reset();
});