(async function deleteAllAllocationsWithUI() {
    'use strict';

    const tbl = document.getElementById('ctl00_FastBusiness_MainReport_gridTable');
    if (!tbl) {
        alert("❌ Không tìm thấy bảng dữ liệu #ctl00_FastBusiness_MainReport_gridTable trên màn hình!");
        return;
    }

    // 1. Quét danh sách các thẻ <tr> của bảng
    const trList = Array.from(tbl.querySelectorAll('tbody tr, tr')).filter(tr => {
        return tr.id && tr.id.includes('gridRow');
    });

    if (trList.length === 0) {
        alert("⚠ Không tìm thấy dòng dữ liệu nào trong bảng!");
        return;
    }

    // 2. Trích xuất dữ liệu từ các inputCell bên trong từng dòng
    const itemsToDelete = [];
    trList.forEach(tr => {
        const inputMaCt = tr.querySelector('input[id*="inputCell_"][id$=".1"]');
        const inputActionId = tr.querySelector('input[id*="inputCell_"][id$=".12"]');
        const inputSoCt = tr.querySelector('input[id*="inputCell_"][id$=".4"]');
        const inputTenKh = tr.querySelector('input[id*="inputCell_"][id$=".6"]');

        if (inputMaCt && inputActionId && inputMaCt.value && inputActionId.value) {
            itemsToDelete.push({
                trElement: tr,
                maChungTu: inputMaCt.value.trim(),
                rawActionId: inputActionId.value.trim(),
                soChungTu: inputSoCt ? inputSoCt.value.trim() : '',
                tenKh: inputTenKh ? inputTenKh.value.trim() : ''
            });
        }
    });

    const total = itemsToDelete.length;
    if (total === 0) {
        alert("⚠ Không tìm thấy mã chứng từ và actionID hợp lệ để xóa!");
        return;
    }

    const confirmDel = confirm(`Tìm thấy ${total} bút toán phân bổ trong bảng.\nBạn có chắc chắn muốn XÓA TẤT CẢ không?`);
    if (!confirmDel) return;

    // 3. Tạo Panel hiển thị trạng thái xóa nổi trên màn hình
    const oldUI = document.getElementById('fast-delete-progress-ui');
    if (oldUI) oldUI.remove();

    const uiBox = document.createElement('div');
    uiBox.id = 'fast-delete-progress-ui';
    uiBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        background: #0f172a;
        color: #f8fafc;
        border: 2px solid #38bdf8;
        border-radius: 10px;
        box-shadow: 0 10px 35px rgba(0,0,0,0.5);
        padding: 14px 18px;
        z-index: 99999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        box-sizing: border-box;
    `;

    uiBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:bold; color:#38bdf8; font-size:14px;">🗑 ĐANG XÓA PHÂN BỔ HÓA ĐƠN</span>
            <button id="btn-stop-fast-delete" style="background:#ef4444; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-weight:bold; font-size:11px; cursor:pointer;">DỪNG LẠI</button>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
            <span id="fast-del-counter">Tiến độ: 0 / ${total}</span>
            <span id="fast-del-percent" style="font-weight:bold; color:#38bdf8;">0%</span>
        </div>
        <div style="width:100%; height:8px; background:#334155; border-radius:4px; overflow:hidden; margin-bottom:10px;">
            <div id="fast-del-bar" style="width:0%; height:100%; background:#10b981; transition:width 0.2s;"></div>
        </div>
        <div id="fast-del-current-info" style="font-size:11.5px; color:#cbd5e1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; background:#1e293b; padding:6px 8px; border-radius:4px; border:1px solid #475569;">
            Chuẩn bị tiến trình...
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:11.5px;">
            <span style="color:#10b981;">✔ Thành công: <b id="fast-del-ok-count">0</b></span>
            <span style="color:#f87171;">❌ Thất bại: <b id="fast-del-fail-count">0</b></span>
        </div>
    `;
    document.body.appendChild(uiBox);

    let isStopped = false;
    document.getElementById('btn-stop-fast-delete').onclick = () => {
        isStopped = true;
        document.getElementById('fast-del-current-info').textContent = "🛑 Đã yêu cầu dừng tiến trình...";
    };

    // 4. Lấy cookie phiên làm việc
    let fastCookie = "37900053379e5PSMT_SP227_A";
    const gridObj = (typeof $find === 'function') ? $find('ctl00_FastBusiness_MainReport') : null;
    if (gridObj && typeof gridObj.get_cookie === 'function') {
        fastCookie = gridObj.get_cookie();
    } else if (gridObj && gridObj._cookie) {
        fastCookie = gridObj._cookie;
    }

    const deleteEndpoint = '/FastBusinessOnline/AppService/FastBusiness.ReportExtenderService.asmx/GetDirViewPage';
    let successCount = 0;
    let failCount = 0;

    const elCounter = document.getElementById('fast-del-counter');
    const elPercent = document.getElementById('fast-del-percent');
    const elBar = document.getElementById('fast-del-bar');
    const elInfo = document.getElementById('fast-del-current-info');
    const elOk = document.getElementById('fast-del-ok-count');
    const elFail = document.getElementById('fast-del-fail-count');

    // 5. Vòng lặp xóa tuần tự
    for (let i = 0; i < total; i++) {
        if (isStopped) {
            console.warn("🛑 Người dùng đã dừng quá trình xóa.");
            break;
        }

        const item = itemsToDelete[i];
        const actionID = `$_${item.rawActionId}`;

        // Cập nhật giao diện trạng thái dòng đang xử lý
        const percent = Math.round(((i + 1) / total) * 100);
        elCounter.textContent = `Tiến độ: ${i + 1} / ${total}`;
        elPercent.textContent = `${percent}%`;
        elBar.style.width = `${percent}%`;
        elInfo.textContent = `Đang xóa CT ${item.soChungTu}: ${item.tenKh}`;
        elInfo.title = `${item.soChungTu} - ${item.tenKh} (${item.maChungTu})`;

        // Đổi màu nền dòng trên bảng để dễ theo dõi
        item.trElement.style.backgroundColor = '#fef08a';

        const payload = {
            type: 2,
            parentType: "Dir",
            firstView: false,
            searchMode: false,
            viewPage: false,
            authorized: null,
            action: "Delete",
            actionID: actionID,
            controller: "RDTran",
            cookie: fastCookie,
            gridController: "RDTran",
            gridViewId: null,
            language: "v",
            memvars: [],
            values: [item.maChungTu],
            vars: [],
            viewId: null
        };

        try {
            const res = await fetch(deleteEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                successCount++;
                elOk.textContent = successCount;
                item.trElement.style.opacity = '0.35';
                item.trElement.style.backgroundColor = '#dcfce7'; // Xanh lá mờ
                console.log(`%c[${i + 1}/${total}] ✔ Đã xóa:%c Số CT ${item.soChungTu} (${item.maChungTu}) - ${item.tenKh}`, "color:#10b981;font-weight:bold;", "color:#334155;");
            } else {
                failCount++;
                elFail.textContent = failCount;
                item.trElement.style.backgroundColor = '#fee2e2'; // Đỏ nhạt
                console.error(`[${i + 1}/${total}] ❌ HTTP ${res.status} khi xóa: ${item.soChungTu}`);
            }
        } catch (err) {
            failCount++;
            elFail.textContent = failCount;
            item.trElement.style.backgroundColor = '#fee2e2';
            console.error(`[${i + 1}/${total}] ❌ Lỗi kết nối: ${item.maChungTu}`, err);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    // 6. Hoàn tất và dọn dẹp
    elInfo.style.color = '#10b981';
    elInfo.textContent = `🎉 Hoàn tất! Đã xóa: ${successCount} dòng (Lỗi: ${failCount})`;

    setTimeout(() => {
        uiBox.remove();
        // Tự động làm tươi lại bảng dữ liệu trên màn hình
        if (gridObj && typeof gridObj.goToPage === 'function') {
            gridObj.goToPage(-1);
        }
    }, 2000);
})();
