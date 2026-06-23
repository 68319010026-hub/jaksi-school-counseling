// ดึงเอลิเมนต์ต่างๆ จาก HTML มารอใช้งาน
const bookingForm = document.getElementById('bookingForm');

// ตั้งค่าตัวแปร URL สำหรับเชื่อมต่อเซิร์ฟเวอร์ออนไลน์ของ Render
const API_URL = 'https://jaksi-school-api.onrender.com';

// ดักจับเหตุการณ์เมื่อผู้ใช้กด "ส่งคำร้อง" (Submit Form)
bookingForm.addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตัวเองตอนกดส่ง

    // 1. ดึงค่าจากช่องกรอกข้อมูลต่างๆ ที่นักเรียนพิมพ์
    const name = document.getElementById('studentName').value;
    const date = document.getElementById('appointmentDate').value;
    const problem = document.getElementById('problemDetail').value;

    // 2. รวบรวมข้อมูลให้อยู่ในรูปแบบ Object พร้อมส่ง
    // กำหนดค่าเริ่มต้นให้กับแนวทาง, ผลลัพธ์ และสถานะ (รอรับคำปรึกษา)
    const bookingData = {
        date: date,
        name: name,
        problem: problem,
        approach: "-",
        result: "-",
        status: "pending"
    };

    // 3. ยิงข้อมูลขึ้นไปบันทึกบนเซิร์ฟเวอร์ออนไลน์ (Render)
    fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        // แสดงหน้าต่างแจ้งเตือนแสนสวยเมื่อส่งข้อมูลสำเร็จ
        Swal.fire({
            title: 'สำเร็จ!',
            text: 'ส่งคำร้องขอเข้ารับคำปรึกษาเรียบร้อยแล้วครับ',
            icon: 'success',
            confirmButtonColor: '#28a745'
        });
        
        // เคลียร์ข้อมูลในฟอร์มให้ว่าง พร้อมสำหรับการกรอกครั้งต่อไป
        bookingForm.reset();
    })
    .catch(error => {
        console.error('Error sending data:', error);
        // แสดงหน้าต่างสีแดงเมื่อระบบเชื่อมต่อหลังบ้านมีปัญหา
        Swal.fire({
            title: 'Jaksi School',
            text: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    });
});