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

// 2. ปรับปรุงส่วนบันทึกข้อมูลใหม่ (POST) ใน server.js เพื่อตั้งค่าเริ่มต้นให้ตัวแปรส่งต่อ
app.post('/api/appointments', (req, res) => {
    try {
        const { date, name, problem } = req.body;
        if (!date || !name || !problem) {
            return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        
        const newAppointment = {
            id: Date.now().toString(),
            date,
            name,
            problem,
            approach: "-",
            result: "-",
            status: "pending",
            referralType: "-",   // ค่าเริ่มต้น: ไม่มีการส่งต่อ
            referralTarget: "-"  // ค่าเริ่มต้น: ไม่มีหน่วยงาน
        };
        
        appointments.push(newAppointment);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Server Error (POST):", error);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

// 3. ปรับปรุงส่วนอัปเดตข้อมูล (PUT) ใน server.js ให้ดึงค่าส่งต่อไปเซฟได้ครอบคลุมขึ้น
app.put('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    const index = appointments.findIndex(a => String(a.id) === String(id));
    
    if (index !== -1) {
        appointments[index] = { 
            ...appointments[index], 
            approach: req.body.approach,
            result: req.body.result,
            status: req.body.status,
            referralType: req.body.referralType || "-",    // เซฟประเภทการส่งต่อ
            referralTarget: req.body.referralTarget || "-"   // เซฟหน่วยงานย่อยที่เลือก
        };
        res.json(appointments[index]);
    } else {
        res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
    }
});

// 4. ลบข้อมูลคำร้อง (DELETE) - เวอร์ชันแก้ทางให้ลบได้ 100%
app.delete('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    const index = appointments.findIndex(a => String(a.id) === String(id));
    
    if (index !== -1) {
        appointments.splice(index, 1);
        return res.status(200).json({ success: true, message: "ลบสำเร็จ" }); 
        // เปลี่ยนมาส่งข้อความกลับแบบนี้ หน้าบ้านจะได้ไม่งงครับ
    } else {
        return res.status(404).json({ success: false, message: "ไม่พบข้อมูล" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
