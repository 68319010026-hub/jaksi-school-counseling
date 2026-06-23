const express = require('express');
const cors = require('cors');
const app = express();
// เปลี่ยนจาก const PORT = 3000; เป็นคำสั่งด้านล่างนี้
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ฐานข้อมูลจำลองในหน่วยความจำ (อิงข้อมูลเริ่มต้นจากภาพกระดาษของคุณ)
let appointments = [
    {
        id: 1,
        date: "20 พ.ย. 67",
        name: "พรพิมล ดีใจ",
        problem: "ไม่อยากมาโรงเรียน เบื่อโรงเรียน อยากเล่นเกมอยู่บ้าน",
        approach: "ให้นักเรียนทำสิ่งที่นักเรียนสนใจ เช่น การเล่นกีฬา หรือวิชาคอมฯ",
        result: "นักเรียนมาโรงเรียนทุกวัน",
        status: "success"
    }
];

// API สำหรับดึงข้อมูลนัดหมายไปแสดงที่หน้าครู (admin.html)
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// API สำหรับรับคำร้องใหม่จากหน้าเด็ก (index.html)
app.post('/api/appointments', (req, res) => {
    const { name, date, problem } = req.body;
    
    const newAppointment = {
        id: appointments.length + 1,
        date: date,
        name: name,
        problem: problem,
        approach: "-",
        result: "-",
        status: "pending"
    };
    
    appointments.push(newAppointment);
    res.status(201).json({ message: "บันทึกคำร้องสำเร็จ!", data: newAppointment });
});
    // API สำหรับให้คุณครูอัปเดตข้อมูลและเปลี่ยนสถานะคำร้อง
app.put('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { approach, result, status } = req.body;
    
    // ค้นหาข้อมูลนัดหมายที่ตรงกับ ID ที่ส่งมา
    const appointment = appointments.find(item => item.id === id);
    
    if (appointment) {
        // อัปเดตข้อมูลใหม่ที่คุณครูกรอกเข้ามา
        appointment.approach = approach || appointment.approach;
        appointment.result = result || appointment.result;
        appointment.status = status || appointment.status;
        
        res.json({ message: "อัปเดตข้อมูลสำเร็จ!", data: appointment });
    } else {
        res.status(404).json({ message: "ไม่พบข้อมูลนัดหมายที่ระบุ" });
    }
});
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์หลังบ้านรันแล้วที่: http://localhost:${PORT}`);
});