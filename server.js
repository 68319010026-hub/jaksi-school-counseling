const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// เปิดใช้งาน CORS ให้ครอบคลุมทุก Domain (ป้องกันปัญหาหน้าบ้าน Netlify บล็อกข้อมูล)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ข้อมูลจำลองเริ่มต้นในระบบ
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
    try {
        const { date, name, problem } = req.body;
        
        // ตรวจสอบว่ามีข้อมูลส่งมาครบถ้วนไหม ป้องกันข้อผิดพลาดแบบขึ้นกล่องแดง
        if (!name || !date || !problem) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const newAppointment = {
            id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
            date: date,
            name: name,
            problem: problem,
            approach: req.body.approach || "-",
            result: req.body.result || "-",
            status: req.body.status || "pending"
        };
        
        appointments.push(newAppointment);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Server Error (POST):", error);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

// 3. แก้ไขอัปเดตข้อมูล (PUT)
app.put('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(a => a.id === id);
    
    if (index !== -1) {
        // อัปเดตเฉพาะค่าที่มีการส่งมาใหม่ รักษาค่าเดิมไว้หากไม่มีการส่งมา
        appointments[index] = { 
            ...appointments[index], 
            ...req.body 
        };
        res.json(appointments[index]);
    } else {
        res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
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