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
