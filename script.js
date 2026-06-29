// นำลิงก์ URL เว็บแอป (อันล่าง) ที่ได้จาก Google Apps Script มาวางแทนที่ในเครื่องหมายคำพูดด้านล่างนี้ครับ
const API_URL = 'https://script.google.com/macros/s/AKfycbz1x20HDjXP9IevSy8spyNM3CvpcDhiZbdMgtDLZsKuHs6QUrru7GIr4Uirbx3VAH8V/exec';

const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('studentName').value;
        const date = document.getElementById('appointmentDate').value;
        const problem = document.getElementById('problemDetail').value;

        // รวบรวมข้อมูล พร้อมระบุ action เป็น "create" เพื่อบอกให้เซิร์ฟเวอร์รู้ว่าเป็นการบันทึกข้อมูลใหม่
        const bookingData = {
            action: "create",
            date: date,
            name: name,
            problem: problem
        };

        // แสดงผลว่ากำลังบันทึกข้อมูล
        Swal.fire({
            title: 'กำลังส่งข้อมูล...',
            text: 'กรุณารอสักครู่ระบบกำลังบันทึกลง Google Sheets',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // ส่งข้อมูลไปยัง Google Apps Script
        fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain' // ใช้ text/plain เพื่อป้องกันปัญหา CORS กับ Google Script
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ส่งคำร้องขอเข้ารับคำปรึกษาเรียบร้อยแล้วครับ',
                    icon: 'success',
                    confirmButtonColor: '#28a745'
                });
                bookingForm.reset();
            } else {
                throw new Error("บันทึกไม่สำเร็จ");
            }
        })
        .catch(error => {
            console.error('Error sending data:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        });
    });
}
