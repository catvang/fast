(function () {
    const startInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay1";
    const endInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay2";
    const tuNgayInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_tu_ngay";
    const denNgayInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_den_ngay";
    const tuNgayBkBanHang = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay_ct1";
    const denNgayBkBanHang = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay_ct2";
    const STORAGE_KEY = "fb_period_selection_v3";

    if (document.getElementById("fb-period-float-btn")) return;

    function formatDate(date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    function setDateRange(startDate, endDate) {
        const startInput = document.getElementById(startInputId);
        const endInput = document.getElementById(endInputId);
        const tuNgayInput = document.getElementById(tuNgayInputId);
        const denNgayInput = document.getElementById(denNgayInputId);
        const tuNgay1 = document.getElementById(tuNgayBkBanHang);
        const denNgay1 = document.getElementById(denNgayBkBanHang);
        
        const targetStart = startInput || tuNgayInput || tuNgay1;
        const targetEnd = endInput || denNgayInput || denNgay1;

        if (targetStart && targetEnd) {
            targetStart.value = formatDate(startDate);
            targetEnd.value = formatDate(endDate);
            const overlay = document.getElementById("fb-period-overlay");
            if (overlay) overlay.remove();
        } else {
            alert("Không tìm thấy input ngày!");
        }
    }

    function getRangeByWeek(week, year) {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (week - 1) * 7;
        const dayOfWeek = firstDayOfYear.getDay(); 
        const diff = firstDayOfYear.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(year, 0, diff + daysOffset);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return { start: startOfWeek, end: endOfWeek };
    }

    function handleApply(type, value) {
        const yearInput = document.getElementById("fb-year-input");
        const year = parseInt(yearInput.value);
        let start, end;

        switch (type) {
            case "month":
                start = new Date(year, value - 1, 1);
                end = new Date(year, value, 0);
                break;
            case "quarter":
                start = new Date(year, (value - 1) * 3, 1);
                end = new Date(year, value * 3, 0);
                break;
            case "half":
                start = (value === 1) ? new Date(year, 0, 1) : new Date(year, 6, 1);
                end = (value === 1) ? new Date(year, 6, 0) : new Date(year, 12, 0);
                break;
            case "year":
                start = new Date(year, 0, 1);
                end = new Date(year, 12, 0);
                break;
            case "week":
                const range = getRangeByWeek(value, year);
                start = range.start;
                end = range.end;
                break;
        }
        
        if (start && end) {
            setDateRange(start, end);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, type, value }));
        }
    }

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

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"year":'+new Date().getFullYear()+'}');

        const overlay = document.createElement("div");
        overlay.id = "fb-period-overlay";
        Object.assign(overlay.style, {
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.4)", zIndex: 999999, display: "flex",
            justifyContent: "center", alignItems: "center"
        });

        const dialog = document.createElement("div");
        Object.assign(dialog.style, {
            background: "#fff", padding: "20px", borderRadius: "12px",
            width: "480px", fontFamily: "Segoe UI, sans-serif", boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        });

        const style = document.createElement("style");
        style.innerHTML = `
            .fb-row { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
            .fb-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 12px; }
            .fb-label { font-weight: bold; width: 50px; font-size: 13px; color: #555; }
            .fb-btn { padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer; font-size: 12px; transition: 0.2s; text-align: center; }
            .fb-btn:hover { background: #007bff; color: white; border-color: #007bff; }
            .fb-input { padding: 5px 8px; border: 1px solid #ccc; border-radius: 4px; width: 70px; outline: none; }
            .fb-input:focus { border-color: #ff9800; }
            .fb-primary-btn { background: #e67e22; color: white; border: none; font-weight: bold; padding: 6px 15px; }
        `;
        document.head.appendChild(style);

        dialog.innerHTML = `
            <h3 style="margin:0 0 15px 0; color:#d35400; font-size: 18px;">Chọn kỳ báo cáo</h3>
            
            <div class="fb-row">
                <span class="fb-label">Năm:</span>
                <input type="number" id="fb-year-input" class="fb-input" value="${saved.year}">
                <button class="fb-btn fb-primary-btn" id="fb-full-year">Cả năm</button>
                <div style="flex-grow:1"></div>
                <span class="fb-label" style="width:auto">Tuần:</span>
                <input type="number" id="fb-week-input" class="fb-input" style="width:50px" placeholder="Số">
                <button class="fb-btn" id="fb-apply-week" style="background:#2ecc71; color:white; border:none">Ok</button>
            </div>

            <hr style="border:0; border-top:1px solid #eee; margin:10px 0">
            
            <div style="font-size:12px; color:#888; margin-bottom:5px; font-weight:bold">THÁNG</div>
            <div class="fb-grid" id="month-g1"></div>
            <div class="fb-grid" id="month-g2"></div>

            <div style="font-size:12px; color:#888; margin-bottom:5px; font-weight:bold">QUÝ & KHÁC</div>
            <div class="fb-row" id="quarter-row"></div>
        `;

        // Render Months (2 rows)
        const g1 = dialog.querySelector("#month-g1");
        const g2 = dialog.querySelector("#month-g2");
        for (let i = 1; i <= 12; i++) {
            const btn = document.createElement("button");
            btn.className = "fb-btn";
            btn.textContent = "T" + i;
            btn.onclick = () => handleApply("month", i);
            (i <= 6 ? g1 : g2).appendChild(btn);
        }

        // Render Quarters
        const qRow = dialog.querySelector("#quarter-row");
        for (let i = 1; i <= 4; i++) {
            const btn = document.createElement("button");
            btn.className = "fb-btn";
            btn.style.flex = "1";
            btn.textContent = "Quý " + i;
            btn.onclick = () => handleApply("quarter", i);
            qRow.appendChild(btn);
        }

        // 6 Tháng
        const h1 = document.createElement("button"); h1.className="fb-btn"; h1.style.flex="1.2"; h1.textContent="6T đầu"; h1.onclick=()=>handleApply("half", 1);
        const h2 = document.createElement("button"); h2.className="fb-btn"; h2.style.flex="1.2"; h2.textContent="6T cuối"; h2.onclick=()=>handleApply("half", 2);
        qRow.append(h1, h2);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Events
        document.getElementById("fb-full-year").onclick = () => handleApply("year", 1);
        
        const weekInput = document.getElementById("fb-week-input");
        const applyWeek = () => {
            const w = parseInt(weekInput.value);
            if (w > 0 && w <= 53) handleApply("week", w);
        };
        document.getElementById("fb-apply-week").onclick = applyWeek;
        weekInput.onkeydown = (e) => { if(e.key === "Enter") applyWeek(); };

        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    floatBtn.onclick = openDialog;
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "k") {
            e.preventDefault();
            openDialog();
        }
    });

    openDialog();
})();

