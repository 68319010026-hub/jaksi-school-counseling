// 1. ตั้งค่า URL หลังบ้าน (Render)
const API_URL = 'https://jaksi-school-api.onrender.com';

const adminTableBody = document.getElementById('admin-table-body');

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
});

// 2. ฟังก์ชันดึงข้อมูลมาแสดงในตาราง
function fetchAppointments() {
    fetch(`${API_URL}/api/appointments`)
        .then(response => response.json())
        .then(data => {
            if(adminTableBody) {
                adminTableBody.innerHTML = ''; 
                
                data.forEach(item => {
                    const row = document.createElement('tr');
                    
                    let statusClass = 'status pending';
                    let statusText = 'รอรับคำปรึกษา';
                    let customStyle = ''; 

                    if (item.status === 'success') {
                        statusClass = 'status success';
                        statusText = 'เสร็จสิ้น';
                    } else if (item.status === 'follow-up') {
                        statusClass = 'status follow-up';
                        statusText = 'ติดตามผล';
                        customStyle = 'style="background-color: #cce5ff; color: #004085; border: 1px solid #b8daff;"';
                    }

                    // แสดงผลช่องส่งต่อในตารางหลัก
                    const referralDisplay = item.referralType && item.referralTarget && item.referralType !== '-' 
                        ? `<span style="font-weight: 500; color: #2b6cb0;">${item.referralType}</span><br><small style="color: #4a5568;">(${item.referralTarget})</small>` 
                        : '<span style="color: #a0aec0;">-</span>';

                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.date}</td>
                        <td>${item.name}</td>
                        <td>${item.problem}</td>
                        <td>${item.approach}</td>
                        <td>${item.result}</td>
                        <td><span class="${statusClass}" ${customStyle}>${statusText}</span></td>
                        <td>${referralDisplay}</td>
                        <td>
                            <button class="btn-action" onclick="editAppointment(${item.id}, '${item.approach}', '${item.result}', '${item.status}', '${item.referralType || '-'}', '${item.referralTarget || '-'}')">บันทึกผล</button>
                            <button class="btn-delete" onclick="deleteAppointment(${item.id})" style="background-color: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 5px;">ลบ</button>
                        </td>
                    `;
                    adminTableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// 3. ฟังก์ชันหน้าต่างบันทึกผล (แก้ไขจุดที่ทำระบบค้างให้แล้วครับ)
function editAppointment(id, currentApproach, currentResult, currentStatus, currentRefType, currentRefTarget) {
    Swal.fire({
        title: 'บันทึกผลการให้คำปรึกษา',
        html: `
            <div style="text-align: left; margin-bottom: 10px;">
                <label style="font-weight: 500;">แนวทางการให้คำปรึกษา:</label>
                <input id="swal-approach" class="swal2-input" style="margin: 5px 0 15px 0; width: 90%;" value="${currentApproach === '-' ? '' : currentApproach}">
            </div>
            <div style="text-align: left; margin-bottom: 10px;">
                <label style="font-weight: 500;">ผลการให้คำปรึกษา:</label>
                <input id="swal-result" class="swal2-input" style="margin: 5px 0 15px 0; width: 90%;" value="${currentResult === '-' ? '' : currentResult}">
            </div>
            <div style="text-align: left; margin-bottom: 10px;">
                <label style="font-weight: 500;">สถานะคำร้อง:</label>
                <select id="swal-status" class="swal2-input" style="margin: 5px 0 15px 0; width: 95%;">
                    <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>รอรับคำปรึกษา</option>
                    <option value="success" ${currentStatus === 'success' ? 'selected' : ''}>เสร็จสิ้น</option>
                    <option value="follow-up" ${currentStatus === 'follow-up' ? 'selected' : ''}>ติดตามผล</option>
                </select>
            </div>
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;">
            <div style="text-align: left; margin-bottom: 10px;">
                <label style="font-weight: 500; color: #2b6cb0;">การส่งต่อข้อมูลเคส:</label>
                <select id="swal-ref-type" class="swal2-input" style="margin: 5px 0 15px 0; width: 95%;" onchange="updateReferralOptions()">
                    <option value="-" ${currentRefType === '-' ? 'selected' : ''}>-- ไม่มีการส่งต่อ --</option>
                    <option value="ส่งต่อภายใน" ${currentRefType === 'ส่งต่อภายใน' ? 'selected' : ''}>ส่งต่อภายใน</option>
                    <option value="ส่งต่อภายนอก" ${currentRefType === 'ส่งต่อภายนอก' ? 'selected' : ''}>ส่งต่อภายนอก</option>
                </select>
            </div>
            <div style="text-align: left; margin-bottom: 10px;">
                <label style="font-weight: 500;">หน่วยงาน / บุคคลที่ส่งต่อ:</label>
                <select id="swal-ref-target" class="swal2-input" style="margin: 5px 0 15px 0; width: 95%;">
                    <option value="-">-- เลือกหน่วยงาน --</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'บันทึกข้อมูล',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#718096',
        didOpen: () => {
            updateReferralOptions(currentRefTarget);
        },
        preConfirm: () => {
            return {
                approach: document.getElementById('swal-approach').value || "-",
                result: document.getElementById('swal-result').value || "-",
                status: document.getElementById('swal-status').value,
                referralType: document.getElementById('swal-ref-type').value,
                referralTarget: document.getElementById('swal-ref-target').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: 'ข้อมูลและการส่งต่อได้รับการอัปเดตแล้ว',
                    icon: 'success',
                    confirmButtonColor: '#28a745'
                });
                fetchAppointments(); 
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
            });
        }
    });
}

// 4. ฟังก์ชันสลับหน่วยงานส่งต่อ
function updateReferralOptions(defaultTarget = '-') {
    const type = document.getElementById('swal-ref-type').value;
    const targetSelect = document.getElementById('swal-ref-target');
    if (!targetSelect) return;

    const internalOptions = ["ครูแนะแนว", "ครูที่ปรึกษา", "สภานักเรียน", "ครูอนามัย", "ครูฝ่ายปกครอง", "ผู้บริหารสถานศึกษา"];
    const externalOptions = [
        "โรงพยาบาล", "โรงพยาบาลส่งเสริมสุขภาพตำบล", "สถานีตำรวจ", 
        "สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์ (พม.)", "บ้านพักเด็กและครอบครัว", 
        "ศาลเยาวชนและครอบครัว", "องค์การบริหารส่วนตำบล", "ศูนย์เรียนรู้ชุมชน", 
        "ที่ว่าการอำเภอ", "ผู้ปกครอง", "สถาบันการศึกษา", 
        "สำนักงานจัดหางานจังหวัด", "สำนักงานส่งเสริมการเรียนรู้ประจำจังหวัด", 
        "สำนักงานเขตพื้นที่การศึกษา"
    ];

    let optionsHtml = '<option value="-">-- เลือกหน่วยงาน --</option>';

    if (type === 'ส่งต่อภายใน') {
        internalOptions.forEach(opt => {
            optionsHtml += `<option value="${opt}" ${defaultTarget === opt ? 'selected' : ''}>${opt}</option>`;
        });
    } else if (type === 'ส่งต่อภายนอก') {
        externalOptions.forEach(opt => {
            optionsHtml += `<option value="${opt}" ${defaultTarget === opt ? 'selected' : ''}>${opt}</option>`;
        });
    }

    targetSelect.innerHTML = optionsHtml;
}

// 5. ฟังก์ชันลบข้อมูล
function deleteAppointment(id) {
    Swal.fire({
        title: 'คุณครูแน่ใจไหม?',
        text: "ต้องการลบข้อมูลนัดหมายนี้ใช่หรือไม่!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#718096',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/api/appointments/${id}`, { method: 'DELETE' })
            .then(() => {
                Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบออกจากระบบแล้ว', 'success');
                fetchAppointments();
            })
            .catch(err => console.error(err));
        }
    });
}
