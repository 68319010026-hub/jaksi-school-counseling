const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// อนุญาตให้หน้าบ้าน (Netlify / Localhost) ส่งข้อมูลเข้ามาได้
app.use(cors());
app.use(express.json());

// ข้อมูลจำลองในระบบ
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

// 1. ดึงข้อมูลทั้งหมด (GET)
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// 2. บันทึกข้อมูลใหม่จากนักเรียน (POST)
app.post('/api/appointments', (req, res) => {
    const newAppointment = {
        id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
        ...req.body
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

// 3. แก้ไขอัปเดตข้อมูล (PUT)
app.put('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...req.body };
        res.json(appointments[index]);
    } else {
        res.status(404).json({ message: "ไม่พบข้อมูล" });
    }
});

// 4. ลบข้อมูลคำร้อง (DELETE)
app.delete('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments.splice(index, 1);
        res.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
    } else {
        res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ต้องการลบ" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});