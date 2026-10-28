(function runFastPortalAllReportsFixed() {
  // 1. Xóa giao diện cũ nếu có
  const oldRoot = document.getElementById('fast-automation-root');
  if (oldRoot) oldRoot.remove();
  const oldIframe = document.getElementById('fast-automation-worker-iframe');
  if (oldIframe) oldIframe.remove();

  const BASE_PATH = '/FastBusinessOnline/Main/';
  const DEFAULT_BTN_SEARCH = '#ctl00_FastBusiness_MainReport_ToolbarButton_Search';
  const DEFAULT_BTN_OK = '#ctl00_FastBusiness_MainReport_searchExtender_updateDlgOk';
  const DIALOG_MSG_OK = '#ctl00_FastBusiness_MainReport_DialogMessage_dlgOk';

  // =========================================================================
  // 2. CHUẨN HÓA BỘ SELECTOR TOÀN BỘ DANH MỤC BÁO CÁO (NHÓM A -> E)
  // =========================================================================
  const TASK_GROUPS = [
    {
      groupCode: 'A',
      groupName: 'Tính toán & Kết chuyển',
      items: [
        { code: 'tp', name: 'Tính toán phân bổ CCDC', shortName: 'Ttpb-Ccdc', path: 'tstinhpb.aspx?id=22.15.03', inputType: 'EXECUTE_TINH_PB', inputs: { thang: '[id*="formCell_1.2"], [id*="form_ky"]', nam: '[id*="formCell_1.3"], [id*="form_nam"]', maDvcs: '[id*="formCell_6.6"], [id*="ma_dvcs"]' } },
        { code: 'lp', name: 'Lập bút toán phân bổ CCDC', shortName: 'Btpb-Ccdc', path: 'tspb.aspx?id=22.15.09', inputType: 'EXECUTE_LAP_BT', inputs: { tuThang: '[id*="formCell_1.2"], [id*="tu_thang"]', denThang: '[id*="formCell_2.2"], [id*="den_thang"]', nam: '[id*="formCell_3.2"], [id*="nam"]', maDvcs: '[id*="formCell_5.5"], [id*="ma_dvcs"]' } },
        { code: 'tk', name: 'Tính toán khấu hao TSCĐ', shortName: 'Ttkh-Tscd', path: 'fatinhkh.aspx?id=18.70.32', inputType: 'EXECUTE_TINH_KH', inputs: { thang: '[id*="formCell_1.1"], [id*="form_ky"]', nam: '[id*="formCell_2.2"], [id*="form_nam"]', maDvcs: '[id*="formCell_3.6"], [id*="ma_dvcs"]' } },
        { code: 'lk', name: 'Lập bút toán khấu hao TSCĐ', shortName: 'Btkh-Tscd', path: 'fabtpb.aspx?id=18.70.38', inputType: 'EXECUTE_LAP_BT', inputs: { tuThang: '[id*="formCell_1.2"], [id*="tu_thang"]', denThang: '[id*="formCell_2.1"], [id*="den_thang"]', nam: '[id*="formCell_3.1"], [id*="nam"]', maDvcs: '[id*="formCell_5.6"], [id*="ma_dvcs"]' } },
        { code: 'gtb', name: 'Tính giá trung bình', shortName: 'Giatb', path: 'ingiatb.aspx?id=15.10.42', inputType: 'EXECUTE_GIA_TRUNG_BINH', inputs: { tuThang: '[id*="formCell_1.2"], [id*="tu_thang"]', denThang: '[id*="formCell_2.2"], [id*="den_thang"]', nam: '[id*="formCell_3.2"], [id*="nam"]', maDvcs: '[id*="formCell_5.3"], [id*="ma_dvcs"]' } },
        { code: 'gth', name: 'Tính giá thành tổng hợp', shortName: 'Gtth', path: 'cotinhgtth.aspx?id=16.70.71', inputType: 'EXECUTE_GIA_THANH', inputs: { thang: '[id*="formCell_1.2"], [id*="form_ky"]', nam: '[id*="formCell_1.3"], [id*="form_nam"]', maDvcs: '[id*="formCell_2.4"], [id*="ma_dvcs"]' } },
        { code: 'kc', name: 'Chạy bút toán kết chuyển', shortName: 'Btkc', path: 'glctkc.aspx?id=03.10.45', inputType: 'EXECUTE_KET_CHUYEN', inputs: { tuThang: '[id*="formCell_1.2"], [id*="tu_thang"]', denThang: '[id*="formCell_2.2"], [id*="den_thang"]', nam: '[id*="formCell_3.2"], [id*="nam"]', maDvcs: '[id*="formCell_4.6"], [id*="ma_dvcs"]' } }
      ]
    },
    {
      groupCode: 'B',
      groupName: 'Kế toán tổng hợp & BCTC',
      items: [
        { code: 'cdkt', name: 'Bảng cân đối kế toán (BCTC Năm)', shortName: 'Cdkt-Nam', path: 'rpt_gltc1.aspx?id=03.30.13', inputType: 'DATE_COMPARISON', inputs: { kyNayDen: '[id*="ngay2"], [id*="den_ngay"]', kyTruocDen: '[id*="ngay_truoc"], [id*="ky_truoc_den"]', loaiBaoCao: '[id*="form_form"], [id*="loai_bc"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'nkc', name: 'Sổ nhật ký chung', shortName: 'Nkc', path: 'rpt_glbk1.aspx?id=03.20.91', inputType: 'DATE', filterPanelInput: '#ctl00_FastBusiness_MainReport_FilterPanelTextps_no', filterPanelValue: '<>0', inputs: { tuNgay: '[id*="tu_ngay"]', denNgay: '[id*="den_ngay"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'cd', name: 'Cân đối phát sinh tài khoản', shortName: 'Cđpstk', path: 'rpt_glcd1d.aspx?id=03.30.11', inputType: 'DATE', inputs: { tuNgay: '[id*="ngay1"], [id*="tu_ngay"]', denNgay: '[id*="ngay2"], [id*="den_ngay"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'kq', name: 'Kết quả SXKD', shortName: 'Kqkd', path: 'rpt_gltc2.aspx?id=03.30.14', inputType: 'DATE_COMPARISON', inputs: { kyNayTu: '[id*="ky_nay_tu"], [id*="tu_ngay"]', kyNayDen: '[id*="ky_nay_den"], [id*="den_ngay"]', kyTruocTu: '[id*="ky_truoc_tu"]', kyTruocDen: '[id*="ky_truoc_den"]', loaiBaoCao: '[id*="form_form"], [id*="loai_bc"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'cp', name: 'Tổng hợp chi phí theo mã phí', shortName: 'Thcp-Mp', path: 'rpt_glbccp1ky.aspx?id=03.50.21', inputType: 'DATE_MULTI_CELL', inputs: { tuNgay: '[id*="formCell_1.4"], [id*="tu_ngay"]', denNgay: '[id*="formCell_1.5"], [id*="den_ngay"]', tkList: '[id*="formCell_2.6"]', bcTheo: '[id*="bc_theo"]', maDvcs: '[id*="ma_dvcs"]' } }
      ]
    },
    {
      groupCode: 'C',
      groupName: 'Kho & Tồn kho',
      items: [
        { code: 'nxt', name: 'Nhập xuất tồn theo kho', shortName: 'Nxt', path: 'rpt_incd2.aspx?id=15.30.83', inputType: 'DATE', inputs: { tuNgay: '[id*="tu_ngay"]', denNgay: '[id*="den_ngay"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'vb', name: 'Tồn kho vỏ bình theo vị trí', shortName: 'Tkvb-Vt', path: 'zcbcthnxttvtrvb.aspx?id=38.40.02', inputType: 'DATE', inputs: { tuNgay: '[id*="tu_ngay"]', denNgay: '[id*="den_ngay"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'tk', name: 'NXT kho theo tài khoản', shortName: 'Nxt-Tk', path: 'rpt_incd1.aspx?id=15.30.82', inputType: 'DATE', inputs: { tuNgay: '[id*="formCell_1.3"], [id*="tu_ngay"]', denNgay: '[id*="formCell_1.4"], [id*="den_ngay"]', maDvcs: '[id*="formCell_4.5"], [id*="ma_dvcs"]' } }
      ]
    },
    {
      groupCode: 'D',
      groupName: 'Hóa đơn & Bán hàng',
      items: [
        { code: 'bh', name: 'Bán hàng theo vụ việc', shortName: 'Bh-Vv', path: 'rpt_soth2.aspx?id=11.30.34', inputType: 'DATE', inputs: { tuNgay: '[id*="ngay_ct1"], [id*="tu_ngay"]', denNgay: '[id*="ngay_ct2"], [id*="den_ngay"]', nhomTheo: '[id*="nh_theo"]', maDvcs: '[id*="ma_dvcs"]' } },
        // Bảng kê mua vào: quét đa lớp cho từ tháng, đến tháng, năm và ĐVCS
        { 
          code: 'mv', 
          name: 'Bảng kê mua vào', 
          shortName: 'Bkmv', 
          path: 'rpt_glthue1.aspx?id=03.39.11', 
          inputType: 'MONTH_SINGLE_YEAR', 
          inputs: { 
            tuThang: '[id*="formCell_1.2"], [id*="form_ky1"], [id*="tu_thang"]', 
            denThang: '[id*="formCell_2.2"], [id*="form_ky2"], [id*="den_thang"]', 
            nam: '[id*="formCell_3.2"], [id*="form_nam"]', 
            maDvcs: '[id*="formCell_11.2"], [id*="formCell_11.3"], [id*="form_ma_dvcs"], [id*="ma_dvcs"]', 
            nhomHdr: '[id*="formCell_14.2"]', 
            chonTt: '[id*="chon_tt"]' 
          } 
        },
        // Bảng kê bán ra: quét đa lớp
        { 
          code: 'br', 
          name: 'Bảng kê bán ra', 
          shortName: 'Bkbr', 
          path: 'rpt_glthue2a.aspx?id=03.39.13', 
          inputType: 'MONTH_SINGLE_YEAR', 
          inputs: { 
            tuThang: '[id*="formCell_1.2"], [id*="form_ky1"], [id*="tu_thang"]', 
            denThang: '[id*="formCell_2.2"], [id*="form_ky2"], [id*="den_thang"]', 
            nam: '[id*="formCell_3.2"], [id*="form_nam"]', 
            maDvcs: '[id*="formCell_7.2"], [id*="formCell_8.2"], [id*="form_ma_dvcs"], [id*="ma_dvcs"]', 
            nhomHdr: '[id*="formCell_10.2"]', 
            chonTt: '[id*="chon_tt"]' 
          } 
        },
        { 
          code: 'tk3', 
          name: 'Tờ khai thuế GTGT', 
          shortName: 'Tkgtgt', 
          path: 'rpt_glthue3.aspx?id=03.39.19', 
          inputType: 'MONTH_SINGLE_YEAR', 
          inputs: { 
            tuThang: '[id*="form_ky1"]', 
            denThang: '[id*="form_ky2"]', 
            nam: '[id*="form_nam"]', 
            maDvcs: '[id*="ma_dvcs"]', 
            chonTt: '[id*="chon_tt"]', 
            loaiBaoCao: '[id*="form_form"]' 
          } 
        }
      ]
    },
    {
      groupCode: 'E',
      groupName: 'Tài sản & Công nợ',
      items: [
        { code: 'kh', name: 'Bảng khấu hao TSCĐ', shortName: 'Bkh-Tscd', path: 'rpt_fabckh.aspx?id=18.70.81', inputType: 'MONTH_DUAL_YEAR', inputs: { tuThang: '[id*="formCell_1.2"]', tuNam: '[id*="tu_nam"]', denThang: '[id*="formCell_2.2"]', denNam: '[id*="formCell_2.3"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'cc', name: 'Bảng tính chi phí CCDC', shortName: 'Btcp-Ccdc', path: 'rpt_btcpccdc.aspx?id=22.40.02', inputType: 'MONTH_DUAL_YEAR', inputs: { tuThang: '[id*="formCell_1.2"]', tuNam: '[id*="tu_nam"]', denThang: '[id*="formCell_2.2"]', denNam: '[id*="formCell_2.3"]', maDvcs: '[id*="ma_dvcs"]' } },
        { code: 'cn', name: 'Cân đối phát sinh công nợ', shortName: 'Cdcn', path: 'rpt_arcd2.aspx?id=07.30.16', inputType: 'DATE', inputs: { tuNgay: '[id*="tu_ngay"]', denNgay: '[id*="den_ngay"]', maDvcs: '[id*="ma_dvcs"]' } }
      ]
    }
  ];

  const ALL_TASKS = TASK_GROUPS.flatMap(g => g.items);

  const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  function parsePeriodString(rawInput) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const s = (rawInput || '').trim().toUpperCase();

    if (!s) return parseMonthPeriod(currentMonth, currentYear);

    if (/^\d{4}$/.test(s) || /^NAM[_ ]?(\d{4})$/.test(s)) {
      const y = parseInt(s.match(/\d{4}/)[0], 10);
      return {
        labelKy: `Nam${y}`,
        tuNgay: `01/01/${y}`,
        denNgay: `31/12/${y}`,
        kyTruocTu: `01/01/${y - 1}`,
        kyTruocDen: `31/12/${y - 1}`,
        tuThang: '1',
        denThang: '12',
        nam: String(y)
      };
    }

    const hMatch = s.match(/^([12])H[\/\-_ ]?(\d{4})?$/);
    if (hMatch) {
      const h = parseInt(hMatch[1], 10);
      const y = parseInt(hMatch[2] || currentYear, 10);
      const startM = h === 1 ? 0 : 6;
      const endM = h === 1 ? 6 : 12;
      return {
        labelKy: `${h}H_${y}`,
        tuNgay: formatDate(new Date(y, startM, 1)),
        denNgay: formatDate(new Date(y, endM, 0)),
        kyTruocTu: formatDate(new Date(y - 1, startM, 1)),
        kyTruocDen: formatDate(new Date(y - 1, endM, 0)),
        tuThang: h === 1 ? '1' : '7',
        denThang: h === 1 ? '6' : '12',
        nam: String(y)
      };
    }

    const qMatch = s.match(/^Q([1-4])[\/\-_ ]?(\d{4})?$/);
    if (qMatch) {
      const q = parseInt(qMatch[1], 10);
      const y = parseInt(qMatch[2] || currentYear, 10);
      return {
        labelKy: `Q${q}_${y}`,
        tuNgay: formatDate(new Date(y, (q - 1) * 3, 1)),
        denNgay: formatDate(new Date(y, q * 3, 0)),
        kyTruocTu: formatDate(new Date(y - 1, (q - 1) * 3, 1)),
        kyTruocDen: formatDate(new Date(y - 1, q * 3, 0)),
        tuThang: String((q - 1) * 3 + 1),
        denThang: String(q * 3),
        nam: String(y)
      };
    }

    const mMatch = s.match(/^(?:T)?(\d{1,2})[\/\-_ ](\d{4})$/);
    if (mMatch) return parseMonthPeriod(parseInt(mMatch[1], 10), parseInt(mMatch[2], 10));

    return parseMonthPeriod(currentMonth, currentYear);
  }

  function parseMonthPeriod(m, y) {
    return {
      labelKy: `T${String(m).padStart(2, '0')}_${y}`,
      tuNgay: formatDate(new Date(y, m - 1, 1)),
      denNgay: formatDate(new Date(y, m, 0)),
      kyTruocTu: formatDate(new Date(y - 1, m - 1, 1)),
      kyTruocDen: formatDate(new Date(y - 1, m, 0)),
      tuThang: String(m),
      denThang: String(m),
      nam: String(y)
    };
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function logPanel(msg) {
    const logBox = document.getElementById('fa-console-log');
    if (logBox) {
      logBox.innerText += `\n${msg}`;
      logBox.scrollTop = logBox.scrollHeight;
    }
  }

  function getIframeDoc() {
    const frame = document.getElementById('fast-automation-worker-iframe');
    return frame ? (frame.contentDocument || frame.contentWindow.document) : null;
  }

  async function loadPageInIframe(url) {
    const frame = document.getElementById('fast-automation-worker-iframe');
    const badge = document.getElementById('fa-preview-status');
    if (badge) badge.innerText = 'Đang nạp trang...';

    return new Promise((resolve) => {
      frame.onload = () => {
        if (badge) badge.innerText = 'Đã nạp xong trang';
        resolve(true);
      };
      frame.src = url;
    });
  }

  // =========================================================================
  // 3. CƠ CHẾ TÌM KIẾM ĐA TẦNG CHO THẺ INPUT / SELECT / FORM CELL
  // =========================================================================
  async function waitFrameSelector(selectorString, timeout = 35000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const doc = getIframeDoc();
      if (doc) {
        const parts = selectorString.split(',').map(s => s.trim());
        for (const s of parts) {
          let el = doc.querySelector(s);
          if (el) {
            // Nếu selector rơi vào TD hoặc div cha, tìm input hoặc select thật sự bên trong
            if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') {
              const childInput = el.querySelector('input, select');
              if (childInput) return childInput;
            }
            return el;
          }
        }
      }
      await sleep(250);
    }
    return null;
  }

  function fillFrameInput(el, value) {
    if (!el) return;
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function selectFrameOption(selectEl, value, labelRegex) {
    if (!selectEl) return;
    let found = false;
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === value || (labelRegex && labelRegex.test(selectEl.options[i].text))) {
        selectEl.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found && selectEl.options.length > 0) selectEl.selectedIndex = 0;
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  async function triggerFrameExportAndDownload(taskName, dvcs, periodLabel) {
    const btnExp = await waitFrameSelector('#ctl00_FastBusiness_MainReport_ToolbarButton_Export', 15000);
    if (!btnExp) {
      logPanel(`⚠ Không tìm thấy nút Export Excel.`);
      return;
    }

    const cleanTitle = taskName.replace(/[/\\?%*:|"<>]/g, '_').trim();
    const cleanDvcs = dvcs ? dvcs.trim().replace(/[, ]+/g, '_') : 'TONG_HOP';
    const finalFileName = `${cleanTitle} - ${cleanDvcs} - ${periodLabel}.xlsx`;

    logPanel(`⏳ Đang tải file: ${finalFileName}...`);

    let interceptedUrl = null;
    const frame = document.getElementById('fast-automation-worker-iframe');
    const frameWin = frame.contentWindow;
    const originalOpen = frameWin.open;
    frameWin.open = function (url) {
      interceptedUrl = url;
      return null;
    };

    btnExp.click();
    await sleep(2000);
    frameWin.open = originalOpen;

    if (interceptedUrl) {
      try {
        const fullDownloadUrl = new URL(interceptedUrl, frameWin.location.href).href;
        const response = await fetch(fullDownloadUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        logPanel(`✔ Tải thành công: ${finalFileName}`);
      } catch (e) {
        const a = document.createElement('a');
        a.href = interceptedUrl;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        logPanel(`✔ Kích hoạt tải: ${finalFileName}`);
      }
    }
  }

  // =========================================================================
  // 4. TIẾN TRÌNH THỰC THI CHUẨN XÁC TỪNG BÁO CÁO
  // =========================================================================
  let isRunning = false;
  async function processAutomationQueue(queue) {
    isRunning = true;
    logPanel(`\n>>> 🚀 BẮT ĐẦU CHẠY ${queue.length} TÁC VỤ...`);

    for (let i = 0; i < queue.length; i++) {
      if (!isRunning) break;
      const item = queue[i];
      const task = ALL_TASKS.find(t => t.code === item.taskCode);
      if (!task) continue;

      const times = parsePeriodString(item.period);
      const dvcs = item.dvcs;
      const targetUrl = `${BASE_PATH}${task.path}`;

      const titleEl = document.getElementById('fa-preview-title');
      if (titleEl) titleEl.innerText = `[${task.shortName}] ${task.name} (${times.labelKy})`;

      logPanel(`\n[${i + 1}/${queue.length}] ${task.name} | Kỳ: ${times.labelKy} | ĐVCS: "${dvcs || ''}"`);

      // 1. Tải trang vào iframe
      await loadPageInIframe(targetUrl);
      await sleep(1500);

      // 2. Mở form lọc nếu bị ẩn
      const rawFirstInput = (task.inputType === 'DATE' || task.inputType === 'DATE_MULTI_CELL') ? task.inputs.tuNgay
        : (task.inputType === 'DATE_COMPARISON' ? (task.inputs.kyNayTu || task.inputs.kyNayDen) : (task.inputs.thang || task.inputs.tuThang));

      let firstInput = await waitFrameSelector(rawFirstInput, 3000);
      if (!firstInput) {
        const btnSearch = await waitFrameSelector(DEFAULT_BTN_SEARCH, 3000);
        if (btnSearch) btnSearch.click();
        firstInput = await waitFrameSelector(rawFirstInput, 8000);
      }

      if (!firstInput) {
        logPanel(`❌ Lỗi: Không mở được form điều kiện lọc của báo cáo.`);
        continue;
      }

      // 3. Điền các tham số thời gian
      if (task.inputType === 'DATE' || task.inputType === 'DATE_MULTI_CELL') {
        fillFrameInput(firstInput, times.tuNgay);
        fillFrameInput(await waitFrameSelector(task.inputs.denNgay), times.denNgay);
        if (task.inputs.tkList) fillFrameInput(await waitFrameSelector(task.inputs.tkList), '632,641,642,811');
        if (task.inputs.bcTheo) selectFrameOption(await waitFrameSelector(task.inputs.bcTheo), '1', /mã phí/i);
      } else if (task.inputType === 'DATE_COMPARISON') {
        if (task.inputs.kyNayTu) fillFrameInput(await waitFrameSelector(task.inputs.kyNayTu), times.tuNgay);
        if (task.inputs.kyNayDen) fillFrameInput(await waitFrameSelector(task.inputs.kyNayDen), times.denNgay);
        if (task.inputs.kyTruocTu) fillFrameInput(await waitFrameSelector(task.inputs.kyTruocTu), times.kyTruocTu);
        if (task.inputs.kyTruocDen) fillFrameInput(await waitFrameSelector(task.inputs.kyTruocDen), times.kyTruocDen);
        if (task.inputs.loaiBaoCao) {
          const defaultVal = task.code === 'cdkt' ? 'V20GLTC1B' : 'V20GLTC2B';
          selectFrameOption(await waitFrameSelector(task.inputs.loaiBaoCao), defaultVal, /200/i);
        }
      } else if (task.inputType === 'MONTH_DUAL_YEAR') {
        fillFrameInput(firstInput, times.tuThang);
        fillFrameInput(await waitFrameSelector(task.inputs.tuNam), times.nam);
        fillFrameInput(await waitFrameSelector(task.inputs.denThang), times.denThang);
        fillFrameInput(await waitFrameSelector(task.inputs.denNam), times.nam);
      } else if (task.inputs.denThang) {
        fillFrameInput(firstInput, times.tuThang);
        fillFrameInput(await waitFrameSelector(task.inputs.denThang), times.denThang);
        fillFrameInput(await waitFrameSelector(task.inputs.nam), times.nam);
      } else {
        fillFrameInput(firstInput, times.denThang);
        fillFrameInput(await waitFrameSelector(task.inputs.nam), times.nam);
      }

      // 4. Điền các tham số bổ trợ
      if (task.inputs.nhomTheo) selectFrameOption(await waitFrameSelector(task.inputs.nhomTheo), '3', /vụ việc/i);
      if (task.inputs.nhomHdr) {
        const elHdr = await waitFrameSelector(task.inputs.nhomHdr, 2000);
        if (elHdr) fillFrameInput(elHdr, '0');
      }
      if (task.inputs.chonTt) selectFrameOption(await waitFrameSelector(task.inputs.chonTt), task.code === 'tk3' ? '5' : '0');
      if (task.code === 'tk3' && task.inputs.loaiBaoCao) selectFrameOption(await waitFrameSelector(task.inputs.loaiBaoCao), 'V20GLTHUE3_284');

      // 5. Điền chính xác Mã ĐVCS / Chi nhánh (hỗ trợ quét đa tầng)
      if (task.inputs.maDvcs) {
        const elDvcs = await waitFrameSelector(task.inputs.maDvcs, 4000);
        if (elDvcs) {
          fillFrameInput(elDvcs, dvcs || '');
          logPanel(`✔ Đã điền ĐVCS: "${dvcs || ''}"`);
        } else {
          // Fallback tìm mọi ô input có tên liên quan đến ma_dvcs trên form hiện tại
          const doc = getIframeDoc();
          const fallbackDvcs = doc ? doc.querySelector('input[id*="ma_dvcs"], input[id*="formCell_"][id$=".2"]') : null;
          if (fallbackDvcs) {
            fillFrameInput(fallbackDvcs, dvcs || '');
            logPanel(`✔ Đã điền ĐVCS (fallback): "${dvcs || ''}"`);
          }
        }
      }

      await sleep(500);

      // 6. Bấm nút NHẬN / OK để chạy báo cáo
      const btnOk = await waitFrameSelector(DEFAULT_BTN_OK, 5000);
      if (btnOk) {
        btnOk.click();
        logPanel(`✔ Đã bấm nút Nhận.`);
      } else {
        // Fallback nút nhận của Fast
        const doc = getIframeDoc();
        const altOk = doc ? doc.querySelector('[id*="updateDlgOk"], [id*="btnOk"], .button-ok') : null;
        if (altOk) altOk.click();
      }

      await sleep(2500);

      // 7. Xử lý sau khi nạp số liệu hoặc tải file
      if (['EXECUTE_GIA_TRUNG_BINH', 'EXECUTE_TINH_PB', 'EXECUTE_TINH_KH', 'EXECUTE_LAP_BT'].includes(task.inputType)) {
        const dlgOk = await waitFrameSelector(DIALOG_MSG_OK, 60000);
        if (dlgOk) dlgOk.click();
        logPanel(`✔ Hoàn thành: ${task.name}`);
      } else if (task.inputType === 'EXECUTE_KET_CHUYEN') {
        const btnAll = await waitFrameSelector('#ctl00_FastBusiness_MainReport_HeaderText_tag > div', 60000);
        if (btnAll) btnAll.click();
        const btnCreate = await waitFrameSelector('#ctl00_FastBusiness_MainReport_ToolbarButton_Create', 5000);
        if (btnCreate) btnCreate.click();
        logPanel(`✔ Đã tạo kết chuyển.`);
      } else if (task.inputType === 'EXECUTE_GIA_THANH') {
        const doc = getIframeDoc();
        const div = doc.querySelector("[id='ctl00_FastBusiness_MainReport_HeaderText_cast(0 as bit) as tag'] > div");
        if (div) div.click();
        const btnCalc = await waitFrameSelector('#ctl00_FastBusiness_MainReport_ToolbarButton_Calculate', 5000);
        if (btnCalc) btnCalc.click();
        logPanel(`✔ Đã tính giá thành.`);
      } else {
        if (item.autoDownload) {
          if (task.filterPanelInput && task.filterPanelValue) {
            const fInput = await waitFrameSelector(task.filterPanelInput, 10000);
            if (fInput) {
              fillFrameInput(fInput, task.filterPanelValue);
              fInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
              await sleep(1500);
            }
          }
          await triggerFrameExportAndDownload(task.name, dvcs, times.labelKy);
        } else {
          logPanel(`✔ Đã mở xong báo cáo: ${task.name}`);
        }
      }
      await sleep(1500);
    }

    isRunning = false;
    logPanel(`\n>>> 🎉 HOÀN TẤT TOÀN BỘ DANH SÁCH CHẠY!`);
  }

  // =========================================================================
  // 5. CSS & BỐ CỤC GIAO DIỆN SPLIT-VIEW
  // =========================================================================
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #fast-automation-root {
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      background: #f1f5f9;
      border-radius: 12px;
      box-shadow: 0 15px 45px rgba(0,0,0,0.45);
      border: 1px solid #cbd5e1;
      z-index: 9999999;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      font-size: 13px;
      overflow: hidden;
    }
    .fa-header { background: #0f172a; color: #fff; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; }
    .fa-split-container { display: flex; flex: 1; overflow: hidden; }
    
    .fa-panel-left {
      width: 600px;
      background: #ffffff;
      border-right: 1px solid #cbd5e1;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: hidden;
    }
    
    .fa-panel-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #e2e8f0;
      position: relative;
    }
    .fa-preview-bar {
      background: #1e293b;
      color: #f8fafc;
      padding: 6px 14px;
      font-size: 12.5px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #fast-automation-worker-iframe {
      width: 100%;
      flex: 1;
      border: none;
      background: #ffffff;
    }

    .fa-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; }
    .fa-row-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .fa-stepper { display: inline-flex; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #fff; }
    .fa-stepper button { border: none; background: transparent; width: 24px; height: 22px; cursor: pointer; font-weight: bold; }
    .fa-stepper input { width: 50px; border: none; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-size: 12px; }
    .fa-input { width: 100%; padding: 5px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: bold; color: #2563eb; box-sizing: border-box; }
    .fa-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 4px; }
    .fa-grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; margin-top: 4px; }
    .fa-btn { border: 1px solid #cbd5e1; background: #fff; border-radius: 4px; padding: 3px 0; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center; }
    .fa-btn:hover { background: #f1f5f9; }
    .fa-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
    .fa-chk-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: bold; cursor: pointer; }
    .fa-run-btn { background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-weight: 700; font-size: 13px; cursor: pointer; width: 100%; margin-top: 6px; }
    .fa-run-btn:hover { background: #1d4ed8; }
    
    .fa-btn-download-direct {
      background: #059669;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .fa-btn-download-direct:hover { background: #047857; }

    .fa-stop-btn { background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 5px 12px; font-weight: 700; font-size: 11px; cursor: pointer; }

    .fa-task-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 280px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .fa-task-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 6px 10px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .fa-task-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
    .fa-badge { font-size: 10px; font-weight: 700; background: #eff6ff; color: #2563eb; padding: 1px 6px; border-radius: 3px; border: 1px solid #bfdbfe; min-width: 32px; text-align: center; }
    .fa-log-box { background: #0f172a; color: #38bdf8; font-family: monospace; font-size: 11.5px; height: 75px; padding: 6px 10px; border-radius: 6px; overflow-y: auto; white-space: pre-wrap; }
  `;
  document.head.appendChild(styleEl);

  const currentBaseYear = new Date().getFullYear();
  let currentPeriodType = 'M';
  let currentPeriodVal = '09';
  let batchMode = 'SINGLE';

  const root = document.createElement('div');
  root.id = 'fast-automation-root';
  root.innerHTML = `
    <div class="fa-header">
      <span style="font-weight:700; display:flex; align-items:center; gap:8px;">
        ⚡ FAST AUTOMATION PORTAL (LIVE SPLIT-VIEW PREVIEW)
      </span>
      <div style="display:flex; gap:8px; align-items:center;">
        <button type="button" class="fa-stop-btn" id="fa-btn-stop" style="display:none;">DỪNG LẠI</button>
        <button type="button" style="background:transparent; border:none; color:#fff; font-weight:bold; font-size:16px; cursor:pointer;" onclick="document.getElementById('fast-automation-root').remove()">✕</button>
      </div>
    </div>

    <div class="fa-split-container">
      
      <!-- CỘT TRÁI -->
      <div class="fa-panel-left">
        
        <!-- HỘP KỲ BÁO CÁO -->
        <div class="fa-box">
          <div class="fa-row-flex">
            <span style="font-weight:700; font-size:11.5px;">KỲ BÁO CÁO:</span>
            <div class="fa-stepper">
              <button type="button" id="fa-step-dec">−</button>
              <input type="text" id="fa-year-input" value="${currentBaseYear}">
              <button type="button" id="fa-step-inc">+</button>
            </div>
          </div>
          
          <input type="text" id="fa-period-string" class="fa-input" value="09/${currentBaseYear}">

          <div style="margin-top:4px;">
            <div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:2px;">CHỌN CÁC NĂM CẦN CHẠY:</div>
            <div class="fa-grid-5" id="fa-years-container"></div>
          </div>

          <div class="fa-grid-6" id="fa-months-container"></div>

          <div class="fa-grid-6">
            <button type="button" class="fa-btn btn-period-q" data-q="1">Q1</button>
            <button type="button" class="fa-btn btn-period-q" data-q="2">Q2</button>
            <button type="button" class="fa-btn btn-period-q" data-q="3">Q3</button>
            <button type="button" class="fa-btn btn-period-q" data-q="4">Q4</button>
            <button type="button" class="fa-btn btn-period-h" data-h="1">1H</button>
            <button type="button" class="fa-btn" id="fa-btn-fullyear">Cả năm</button>
          </div>

          <div style="border-top:1px dashed #cbd5e1;margin-top:4px;padding-top:4px;display:flex;gap:4px;flex-wrap:wrap;">
            <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-combo-12m">12 Tháng</button>
            <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-combo-4q">4 Quý</button>
            <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-combo-all">Năm + 4 Quý</button>
          </div>
        </div>

        <!-- HỘP ĐVCS & NÚT CHẠY -->
        <div class="fa-box">
          <div class="fa-row-flex">
            <span style="font-weight:700; font-size:11.5px;">CHI NHÁNH:</span>
            <div>
              <button type="button" class="fa-btn" style="padding:1px 5px;" id="fa-dvcs-all">Tất cả</button>
              <button type="button" class="fa-btn" style="padding:1px 5px;" id="fa-dvcs-none">Bỏ</button>
            </div>
          </div>
          <input type="text" id="fa-dvcs-input" class="fa-input" placeholder="CTY, D02, D05 (để trống: Tổng hợp)">

          <div style="display:flex;gap:8px;margin-top:4px;background:#fff;padding:3px 6px;border-radius:4px;border:1px solid #cbd5e1;">
            <label class="fa-chk-tag"><input type="checkbox" class="fa-chk-dvcs" value="CTY"> CTY</label>
            <label class="fa-chk-tag"><input type="checkbox" class="fa-chk-dvcs" value="D02" checked> D02</label>
            <label class="fa-chk-tag"><input type="checkbox" class="fa-chk-dvcs" value="D03"> D03</label>
            <label class="fa-chk-tag"><input type="checkbox" class="fa-chk-dvcs" value="D05"> D05</label>
          </div>

          <!-- MẶC ĐỊNH BỎ TÍCH: TÁCH CHI NHÁNH, LẶP NĂM, TỰ TẢI EXCEL -->
          <div style="margin-top:4px;display:flex;justify-content:space-between;align-items:center;">
            <label class="fa-chk-tag"><input type="checkbox" id="fa-opt-split-dvcs"> Tách chi nhánh</label>
            <label class="fa-chk-tag"><input type="checkbox" id="fa-opt-split-year"> Lặp theo năm</label>
            <label class="fa-chk-tag"><input type="checkbox" id="fa-opt-auto-dl"> Tự xuất Excel</label>
          </div>

          <button type="button" class="fa-run-btn" id="fa-btn-run">🚀 CHẠY LỰA CHỌN</button>
        </div>

        <!-- KHUNG DANH MỤC BÁO CÁO -->
        <div class="fa-task-panel">
          <div class="fa-row-flex" style="margin-bottom:6px;">
            <span style="font-weight:700; color:#0f172a;">DANH MỤC BÁO CÁO:</span>
            <div style="display:flex;gap:4px;">
              <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-task-select-rep">BCTC (B->E)</button>
              <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-task-select-all">Hết</button>
              <button type="button" class="fa-btn" style="padding:2px 6px;" id="fa-task-select-none">Bỏ</button>
            </div>
          </div>
          <div class="fa-task-list" id="fa-task-container"></div>
        </div>

        <div class="fa-log-box" id="fa-console-log">Sẵn sàng điều hướng và hiển thị trực tiếp báo cáo...</div>
      </div>

      <!-- CỘT PHẢI: IFRAME VÀ NÚT TẢI EXCEL TRỰC TIẾP -->
      <div class="fa-panel-right">
        <div class="fa-preview-bar">
          <span id="fa-preview-title">📺 Màn hình hiển thị Fast Business Online</span>
          <div style="display:flex; gap:10px; align-items:center;">
            <button type="button" class="fa-btn-download-direct" id="fa-btn-quick-export" title="Click nhanh nút Export Excel của Fast">
              📥 TẢI EXCEL NGAY
            </button>
            <span id="fa-preview-status" style="font-weight:normal; color:#38bdf8;">Đang chờ lệnh...</span>
          </div>
        </div>
        <iframe id="fast-automation-worker-iframe" src="${BASE_PATH}rpt_glthue1.aspx?id=03.39.11"></iframe>
      </div>

    </div>
  `;
  document.body.appendChild(root);

  // Click trực tiếp nút Export của Fast
  document.getElementById('fa-btn-quick-export').onclick = () => {
    const doc = getIframeDoc();
    if (doc) {
      const expBtn = doc.querySelector('#ctl00_FastBusiness_MainReport_ToolbarButton_Export');
      if (expBtn) {
        expBtn.click();
        logPanel(`✔ Đã click nút Xuất Excel của Fast Business.`);
      } else {
        alert('Không tìm thấy nút Xuất Excel trên màn hình báo cáo hiện tại!');
      }
    }
  };

  const getYear = () => parseInt(document.getElementById('fa-year-input').value, 10) || currentBaseYear;
  const yearsContainer = document.getElementById('fa-years-container');
  for (let i = 4; i >= 0; i--) {
    const y = currentBaseYear - i;
    const lbl = document.createElement('label');
    lbl.className = 'fa-chk-tag';
    lbl.style.fontSize = '11px';
    lbl.innerHTML = `<input type="checkbox" class="fa-chk-year" value="${y}" ${y === getYear() ? 'checked' : ''}> ${y}`;
    yearsContainer.appendChild(lbl);
  }

  const monthsContainer = document.getElementById('fa-months-container');
  for (let m = 1; m <= 12; m++) {
    const mStr = String(m).padStart(2, '0');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `fa-btn btn-period-m ${mStr === '09' ? 'active' : ''}`;
    btn.setAttribute('data-m', mStr);
    btn.innerText = `T${mStr}`;
    btn.onclick = () => {
      batchMode = 'SINGLE';
      currentPeriodType = 'M';
      currentPeriodVal = mStr;
      updatePeriodText();
    };
    monthsContainer.appendChild(btn);
  }

  document.querySelectorAll('.btn-period-q').forEach((b) => {
    b.onclick = () => {
      batchMode = 'SINGLE';
      currentPeriodType = 'Q';
      currentPeriodVal = b.getAttribute('data-q');
      updatePeriodText();
    };
  });

  document.querySelectorAll('.btn-period-h').forEach((b) => {
    b.onclick = () => {
      batchMode = 'SINGLE';
      currentPeriodType = 'H';
      currentPeriodVal = b.getAttribute('data-h');
      updatePeriodText();
    };
  });

  document.getElementById('fa-btn-fullyear').onclick = () => {
    batchMode = 'SINGLE';
    currentPeriodType = 'Y';
    currentPeriodVal = 'ALL';
    updatePeriodText();
  };

  function updatePeriodText() {
    const y = getYear();
    const txt = document.getElementById('fa-period-string');
    document.querySelectorAll('.fa-btn').forEach((b) => b.classList.remove('active'));

    if (currentPeriodType === 'M') {
      txt.value = `${currentPeriodVal}/${y}`;
      const b = document.querySelector(`.btn-period-m[data-m="${currentPeriodVal}"]`);
      if (b) b.classList.add('active');
    } else if (currentPeriodType === 'Q') {
      txt.value = `Q${currentPeriodVal}/${y}`;
      const b = document.querySelector(`.btn-period-q[data-q="${currentPeriodVal}"]`);
      if (b) b.classList.add('active');
    } else if (currentPeriodType === 'H') {
      txt.value = `${currentPeriodVal}H/${y}`;
      const b = document.querySelector(`.btn-period-h[data-h="${currentPeriodVal}"]`);
      if (b) b.classList.add('active');
    } else if (currentPeriodType === 'Y') {
      txt.value = `${y}`;
      document.getElementById('fa-btn-fullyear').classList.add('active');
    }
  }

  document.getElementById('fa-step-dec').onclick = () => {
    document.getElementById('fa-year-input').value = getYear() - 1;
    updatePeriodText();
  };
  document.getElementById('fa-step-inc').onclick = () => {
    document.getElementById('fa-year-input').value = getYear() + 1;
    updatePeriodText();
  };

  document.getElementById('fa-combo-12m').onclick = () => {
    batchMode = 'ALL_MONTHS';
    document.getElementById('fa-period-string').value = `[12 Tháng năm ${getYear()}]`;
  };
  document.getElementById('fa-combo-4q').onclick = () => {
    batchMode = 'ALL_QUARTERS';
    document.getElementById('fa-period-string').value = `[4 Quý năm ${getYear()}]`;
  };
  document.getElementById('fa-combo-all').onclick = () => {
    batchMode = 'FULL_YEAR_COMBO';
    document.getElementById('fa-period-string').value = `[Cả Năm + 4 Quý năm ${getYear()}]`;
  };

  const dvcsInput = document.getElementById('fa-dvcs-input');
  const syncDvcs = () => {
    const chks = Array.from(document.querySelectorAll('.fa-chk-dvcs:checked')).map((c) => c.value);
    dvcsInput.value = chks.join(', ');
  };
  syncDvcs();
  document.querySelectorAll('.fa-chk-dvcs').forEach((c) => (c.onchange = syncDvcs));
  document.getElementById('fa-dvcs-all').onclick = () => {
    document.querySelectorAll('.fa-chk-dvcs').forEach((c) => (c.checked = true));
    syncDvcs();
  };
  document.getElementById('fa-dvcs-none').onclick = () => {
    document.querySelectorAll('.fa-chk-dvcs').forEach((c) => (c.checked = false));
    syncDvcs();
  };

  const taskContainer = document.getElementById('fa-task-container');
  ALL_TASKS.forEach((t) => {
    const row = document.createElement('div');
    row.className = 'fa-task-item';
    row.innerHTML = `
      <input type="checkbox" class="fa-chk-task" value="${t.code}" id="fa_task_${t.code}" ${t.code === 'mv' ? 'checked' : ''}>
      <span class="fa-badge">${t.code.toUpperCase()}</span>
      <label for="fa_task_${t.code}" style="cursor:pointer; flex:1;">
        ${t.name} <span style="color:#94a3b8; font-size:11.5px;">(${t.shortName})</span>
      </label>
    `;
    taskContainer.appendChild(row);
  });

  document.getElementById('fa-task-select-all').onclick = () => {
    document.querySelectorAll('.fa-chk-task').forEach((c) => (c.checked = true));
  };
  document.getElementById('fa-task-select-none').onclick = () => {
    document.querySelectorAll('.fa-chk-task').forEach((c) => (c.checked = false));
  };
  document.getElementById('fa-task-select-rep').onclick = () => {
    const repCodes = ['cdkt', 'nkc', 'cd', 'kq', 'cp', 'nxt', 'vb', 'tk', 'bh', 'mv', 'br', 'tk3', 'kh', 'cc', 'cn'];
    document.querySelectorAll('.fa-chk-task').forEach((c) => {
      c.checked = repCodes.includes(c.value);
    });
  };

  document.getElementById('fa-btn-stop').onclick = () => {
    isRunning = false;
    logPanel(`🛑 ĐÃ DỪNG TIẾN TRÌNH TỰ ĐỘNG!`);
    document.getElementById('fa-btn-stop').style.display = 'none';
  };

  document.getElementById('fa-btn-run').onclick = () => {
    const selectedTasks = Array.from(document.querySelectorAll('.fa-chk-task:checked')).map((c) => c.value);
    if (selectedTasks.length === 0) {
      alert('Vui lòng chọn ít nhất 1 nghiệp vụ/báo cáo!');
      return;
    }

    const splitYears = document.getElementById('fa-opt-split-year').checked;
    let targetYears = [];
    if (splitYears) {
      targetYears = Array.from(document.querySelectorAll('.fa-chk-year:checked')).map((c) => parseInt(c.value, 10));
    }
    if (targetYears.length === 0) targetYears = [getYear()];

    let periodsToRun = [];
    targetYears.forEach((y) => {
      if (batchMode === 'ALL_MONTHS') {
        for (let m = 1; m <= 12; m++) periodsToRun.push(`${String(m).padStart(2, '0')}/${y}`);
      } else if (batchMode === 'ALL_QUARTERS') {
        periodsToRun.push(`Q1/${y}`, `Q2/${y}`, `Q3/${y}`, `Q4/${y}`);
      } else if (batchMode === 'FULL_YEAR_COMBO') {
        periodsToRun.push(`${y}`, `Q1/${y}`, `Q2/${y}`, `Q3/${y}`, `Q4/${y}`);
      } else {
        if (currentPeriodType === 'M') periodsToRun.push(`${currentPeriodVal}/${y}`);
        else if (currentPeriodType === 'Q') periodsToRun.push(`Q${currentPeriodVal}/${y}`);
        else if (currentPeriodType === 'H') periodsToRun.push(`${currentPeriodVal}H/${y}`);
        else periodsToRun.push(`${y}`);
      }
    });

    const rawDvcs = dvcsInput.value.trim();
    const splitDvcs = document.getElementById('fa-opt-split-dvcs').checked;
    let branchList = [''];
    if (rawDvcs) {
      const tokens = rawDvcs.split(',').map((s) => s.trim()).filter(Boolean);
      if (splitDvcs && tokens.length > 1) {
        branchList = tokens;
      } else {
        branchList = [rawDvcs];
      }
    }

    const autoDownload = document.getElementById('fa-opt-auto-dl').checked;

    const queue = [];
    for (const p of periodsToRun) {
      for (const b of branchList) {
        for (const t of selectedTasks) {
          queue.push({
            taskCode: t,
            period: p,
            dvcs: b,
            autoDownload: autoDownload
          });
        }
      }
    }

    document.getElementById('fa-btn-stop').style.display = 'inline-block';
    processAutomationQueue(queue);
  };

  updatePeriodText();
})();
