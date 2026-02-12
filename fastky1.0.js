(function () {

    const startInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay1";
    const endInputId = "ctl00_FastBusiness_MainReport_searchExtender_form_ngay2";
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
        if (!startInput || !endInput) {
            alert("Không tìm thấy input ngày!");
            return;
        }
        startInput.value = formatDate(startDate);
        endInput.value = formatDate(endDate);
    }

    function saveSelection(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getSavedSelection() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    function getSelectedYear() {
        return parseInt(document.querySelector('input[name="yearSelect"]:checked').value);
    }

    function setActive(button) {
        document.querySelectorAll(".fb-period-btn").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    }

    // ===============================
    // FLOAT BUTTON (TOP CENTER)
    // ===============================
    const floatBtn = document.createElement("button");
    floatBtn.id = "fb-period-float-btn";
    floatBtn.innerHTML = "📅 Kỳ";
    floatBtn.title = "Mở chọn kỳ (Ctrl + K)";

    Object.assign(floatBtn.style, {
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "999999",
        padding: "8px 18px",
        borderRadius: "24px",
        border: "2px solid #fff",
        background: "linear-gradient(135deg,#ff9800,#ff5722)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        transition: "all 0.2s ease"
    });

    floatBtn.onmouseenter = () => {
        floatBtn.style.transform = "translateX(-50%) translateY(-2px)";
        floatBtn.style.boxShadow = "0 8px 22px rgba(0,0,0,0.45)";
    };

    floatBtn.onmouseleave = () => {
        floatBtn.style.transform = "translateX(-50%) translateY(0)";
        floatBtn.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
    };

    document.body.appendChild(floatBtn);

    // ===============================
    // OPEN DIALOG
    // ===============================
    function openDialog() {

        if (document.getElementById("fb-period-overlay")) return;

        const saved = getSavedSelection();
        let selectedMeta = saved || null;

        const overlay = document.createElement("div");
        overlay.id = "fb-period-overlay";

        Object.assign(overlay.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        });

        const dialog = document.createElement("div");

        Object.assign(dialog.style, {
            background: "#fff",
            padding: "25px",
            borderRadius: "14px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
            width: "760px",
            maxWidth: "95%",
            fontFamily: "Segoe UI"
        });

        dialog.innerHTML = `<h2 style="margin-top:0;color:#2c3e50">Chọn kỳ báo cáo</h2>`;

        const style = document.createElement("style");
        style.innerHTML = `
            .fb-period-row { margin-bottom:12px }
            .fb-period-btn {
                padding:6px 10px;
                margin:4px;
                border:1px solid #ddd;
                border-radius:6px;
                background:#f8f9fa;
                cursor:pointer;
                font-size:13px;
                transition:0.15s;
            }
            .fb-period-btn:hover { background:#e9ecef }
            .fb-period-btn.active {
                background:#007bff;
                color:#fff;
                border-color:#007bff;
            }
            .fb-confirm-btn {
                padding:9px 22px;
                border:none;
                border-radius:8px;
                background:#28a745;
                color:#fff;
                font-weight:600;
                cursor:pointer;
                box-shadow:0 4px 12px rgba(0,0,0,0.25);
                transition:0.2s;
            }
            .fb-confirm-btn:hover {
                background:#218838;
            }
        `;
        document.head.appendChild(style);

        // ===== YEAR =====
        const yearRow = document.createElement("div");
        yearRow.className = "fb-period-row";
        const currentYear = new Date().getFullYear();

        for (let i = 0; i <= 5; i++) {
            const year = currentYear - i;
            const label = document.createElement("label");
            label.style.marginRight = "12px";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "yearSelect";
            radio.value = year;

            if (saved && saved.year == year) radio.checked = true;
            else if (!saved && i === 0) radio.checked = true;

            label.appendChild(radio);
            label.append(" " + year);
            yearRow.appendChild(label);
        }

        dialog.appendChild(yearRow);

        function createButton(text, type, value) {
            const btn = document.createElement("button");
            btn.textContent = text;
            btn.className = "fb-period-btn";

            btn.onclick = function () {
                setActive(btn);
                selectedMeta = {
                    year: getSelectedYear(),
                    type: type,
                    value: value
                };
            };

            if (saved && saved.type === type && saved.value === value) {
                setTimeout(() => btn.classList.add("active"), 50);
            }

            return btn;
        }

        // MONTH
        const monthRow = document.createElement("div");
        monthRow.className = "fb-period-row";
        for (let m = 1; m <= 12; m++) {
            monthRow.appendChild(createButton("T" + m, "month", m));
        }
        dialog.appendChild(monthRow);

        // QUARTER
        const quarterRow = document.createElement("div");
        quarterRow.className = "fb-period-row";
        for (let q = 1; q <= 4; q++) {
            quarterRow.appendChild(createButton("Quý " + q, "quarter", q));
        }
        dialog.appendChild(quarterRow);

        // HALF
        const halfRow = document.createElement("div");
        halfRow.className = "fb-period-row";
        halfRow.appendChild(createButton("Nửa đầu năm", "half", 1));
        halfRow.appendChild(createButton("Nửa cuối năm", "half", 2));
        dialog.appendChild(halfRow);

        // FULL YEAR
        const fullRow = document.createElement("div");
        fullRow.className = "fb-period-row";
        fullRow.appendChild(createButton("Cả năm", "year", 1));
        dialog.appendChild(fullRow);

        // ===== ĐỒNG Ý =====
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Đồng ý";
        confirmBtn.className = "fb-confirm-btn";

        confirmBtn.onclick = function () {

            if (!selectedMeta) return alert("Vui lòng chọn kỳ!");

            const year = selectedMeta.year;
            let start, end;

            if (selectedMeta.type === "month") {
                start = new Date(year, selectedMeta.value - 1, 1);
                end = new Date(year, selectedMeta.value, 0);
            }

            if (selectedMeta.type === "quarter") {
                const sm = (selectedMeta.value - 1) * 3;
                start = new Date(year, sm, 1);
                end = new Date(year, sm + 3, 0);
            }

            if (selectedMeta.type === "half") {
                if (selectedMeta.value === 1) {
                    start = new Date(year, 0, 1);
                    end = new Date(year, 6, 0);
                } else {
                    start = new Date(year, 6, 1);
                    end = new Date(year, 12, 0);
                }
            }

            if (selectedMeta.type === "year") {
                start = new Date(year, 0, 1);
                end = new Date(year, 12, 0);
            }

            setDateRange(start, end);
            saveSelection(selectedMeta);
            overlay.remove();
        };

        dialog.appendChild(confirmBtn);

        overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    floatBtn.onclick = openDialog;

    // ===== HOTKEY CTRL + K =====
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key.toLowerCase() === "k") {
            e.preventDefault();
            openDialog();
        }
    });

})();
