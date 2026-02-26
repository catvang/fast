(function () {
    // Danh sách các ID input ngày của Fast Business (tự động mở rộng tại đây)
    const START_IDS = ["ctl00_FastBusiness_MainReport_searchExtender_form_ngay1", "ctl00_FastBusiness_MainReport_searchExtender_form_tu_ngay", "ctl00_FastBusiness_MainReport_searchExtender_form_ngay_ct1"];
    const END_IDS = ["ctl00_FastBusiness_MainReport_searchExtender_form_ngay2", "ctl00_FastBusiness_MainReport_searchExtender_form_den_ngay", "ctl00_FastBusiness_MainReport_searchExtender_form_ngay_ct2"];
    const STORAGE_KEY = "fb_period_selection_v3";

    if (document.getElementById("fb-period-float-btn")) return;

    const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    function setDateRange(startDate, endDate) {
        // Tìm input đầu tiên tồn tại trong danh sách ID
        const targetStart = START_IDS.map(id => document.getElementById(id)).find(el => el !== null);
        const targetEnd = END_IDS.map(id => document.getElementById(id)).find(el => el !== null);

        if (targetStart && targetEnd) {
            targetStart.value = formatDate(startDate);
            targetEnd.value = formatDate(endDate);
            document.getElementById("fb-period-overlay")?.remove();
        } else {
            alert("Không tìm thấy input ngày!");
        }
    }

    function handleApply(type, value) {
        const year = parseInt(document.getElementById("fb-year-input").value);
        let start, end;

        if (type === "month") {
            start = new Date(year, value - 1, 1);
            end = new Date(year, value, 0);
        } else if (type === "quarter") {
            start = new Date(year, (value - 1) * 3, 1);
            end = new Date(year, value * 3, 0);
        } else if (type === "half") {
            start = new Date(year, value === 1 ? 0 : 6, 1);
            end = new Date(year, value === 1 ? 6 : 12, 0);
        } else if (type === "year") {
            start = new Date(year, 0, 1);
            end = new Date(year, 12, 0);
        } else if (type === "week") {
            const firstDay = new Date(year, 0, 1);
            const dayOff = (value - 1) * 7;
            const diff = firstDay.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1);
            start = new Date(year, 0, diff + dayOff);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
        }
        
        if (start && end) {
            setDateRange(start, end);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, type, value }));
        }
    }

    // --- PHẦN GIAO DIỆN (Giữ nguyên logic của bạn nhưng tối ưu CSS/Render) ---
    const floatBtn = document.createElement("button");
    floatBtn.id = "fb-period-float-btn";
    floatBtn.innerHTML = "📅 Kỳ";
    Object.assign(floatBtn.style, {
        position: "fixed", top: "12px", left: "50%", transform: "translateX(-50%)",
        zIndex: "999999", padding: "8px 18px", borderRadius: "24px", border: "2px solid #fff",
        background: "linear-gradient(135deg,#ff9800,#ff5722)", color: "#fff",
        fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(floatBtn);

    function openDialog() {
        if (document.getElementById("fb-period-overlay")) return;
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || `{"year":${new Date().getFullYear()}}`);

        const overlay = document.createElement("div");
        overlay.id = "fb-period-overlay";
        Object.assign(overlay.style, {
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.4)", zIndex: 999999, display: "flex", justifyContent: "center", alignItems: "center"
        });

        const dialog = document.createElement("div");
        Object.assign(dialog.style, {
            background: "#fff", padding: "20px", borderRadius: "12px", width: "480px", fontFamily: "Segoe UI, sans-serif"
        });

        const style = document.createElement("style");
        style.innerHTML = `
            .fb-row { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
            .fb-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 12px; }
            .fb-btn { padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer; font-size: 12px; transition: 0.2s; text-align: center; }
            .fb-btn:hover { background: #007bff; color: white; border-color: #007bff; }
            .fb-input { padding: 5px 8px; border: 1px solid #ccc; border-radius: 4px; width: 70px; }
            .fb-primary-btn { background: #e67e22; color: white; border: none; font-weight: bold; padding: 6px 15px; }
        `;
        document.head.appendChild(style);

        dialog.innerHTML = `
            <h3 style="margin:0 0 15px 0; color:#d35400;">Chọn kỳ báo cáo</h3>
            <div class="fb-row">
                <b>Năm:</b> <input type="number" id="fb-year-input" class="fb-input" value="${saved.year}">
                <button class="fb-btn fb-primary-btn" onclick="window.fbApply('year', 1)">Cả năm</button>
                <div style="flex-grow:1"></div>
                <b>Tuần:</b> <input type="number" id="fb-week-input" class="fb-input" style="width:45px">
                <button class="fb-btn" style="background:#2ecc71; color:white; border:none" onclick="window.fbApply('week', document.getElementById('fb-week-input').value)">Ok</button>
            </div>
            <hr style="border:0; border-top:1px solid #eee">
            <div style="font-size:11px; color:#888; font-weight:bold">THÁNG</div>
            <div class="fb-grid">${[...Array(12)].map((_, i) => `<button class="fb-btn" onclick="window.fbApply('month', ${i+1})">T${i+1}</button>`).join('')}</div>
            <div style="font-size:11px; color:#888; font-weight:bold">QUÝ & KHÁC</div>
            <div class="fb-row">
                ${[1,2,3,4].map(i => `<button class="fb-btn" style="flex:1" onclick="window.fbApply('quarter', ${i})">Quý ${i}</button>`).join('')}
                <button class="fb-btn" style="flex:1.2" onclick="window.fbApply('half', 1)">6T đầu</button>
                <button class="fb-btn" style="flex:1.2" onclick="window.fbApply('half', 2)">6T cuối</button>
            </div>
        `;

        window.fbApply = handleApply; // Đưa hàm ra ngoài để onclick trong chuỗi HTML hoạt động
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        overlay.onclick = (e) => e.target === overlay && overlay.remove();
        
        // Hỗ trợ Enter cho input tuần
        dialog.querySelector("#fb-week-input").onkeydown = (e) => e.key === "Enter" && handleApply('week', e.target.value);
    }

    floatBtn.onclick = openDialog;
    document.addEventListener("keydown", (e) => e.ctrlKey && e.key.toLowerCase() === "k" && (e.preventDefault(), openDialog()));
    openDialog();
})();
