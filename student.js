const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('studentName').value;
    const date = document.getElementById('appointmentDate').value;
    const problem = document.getElementById('problemDetail').value;

    fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, problem })
    })
    .then(response => response.json())
    .then(data => {
        // เปลี่ยนจาก alert แบบเดิม เป็นกล่องแจ้งเตือนของ Jaksi School ที่สวยงามกว่าเดิม
        Swal.fire({
            title: 'Jaksi School',
            text: 'ส่งคำร้องนัดหมายให้คุณครูเรียบร้อยแล้ว!',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#4CAF50' // สีปุ่มตกลง (เลือกปรับตามมู้ดแอนด์โทนของเว็บได้ครับ)
        });
        
        bookingForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        
        // แจ้งเตือนกรณีระบบขัดข้องแบบสวยๆ
        Swal.fire({
            title: 'Jaksi School',
            text: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#f44336'
        });
    });
});