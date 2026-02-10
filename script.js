document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const STORAGE_KEY_STAFF = 'dutyRoster_staff';
    const STORAGE_KEY_START_DATE = 'dutyRoster_startDate';

    // --- State ---
    // --- State ---
    let state = {
        staffList: [],
        startDate: new Date(),
        viewDate: new Date(),
        logoBase64: null,
        isAdmin: false // Security state
    };

    // --- Login Logic ---
    const loginPanel = document.getElementById('loginPanel');
    const adminContent = document.getElementById('adminContent');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');

    function checkLogin() {
        if (adminPasswordInput.value === 'TAN1CU') {
            state.isAdmin = true;

            // UI Feedback
            loginPanel.innerHTML = '<span style="color: green; font-weight: bold; font-size: 0.8rem;">🔓 Đã mở khóa Admin</span>';

            // Unlock functionality
            const staffInput = document.getElementById('staffInput');
            const startDateInput = document.getElementById('startDate');
            const saveBtn = document.getElementById('saveStaffBtn');

            if (staffInput) {
                staffInput.disabled = false;
                staffInput.style.background = '#fff';
                staffInput.style.cursor = 'text';
            }
            if (startDateInput) {
                startDateInput.disabled = false;
                startDateInput.style.background = '#fff';
                startDateInput.style.cursor = 'pointer';
            }

            // Show Save Button
            if (saveBtn) saveBtn.style.display = 'block';

            // Show GitHub Panel
            if (ghEl.panel) ghEl.panel.style.display = 'block';

        } else {
            alert('Mật khẩu không đúng!');
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', checkLogin);
    }
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkLogin();
        });
    }

    // --- DOM Elements ---
    const el = {
        staffInput: document.getElementById('staffInput'),
        startDateInput: document.getElementById('startDate'),
        saveBtn: document.getElementById('saveStaffBtn'),
        prevMonthBtn: document.getElementById('prevMonthBtn'),
        nextMonthBtn: document.getElementById('nextMonthBtn'),
        todayBtn: document.getElementById('todayBtn'),
        currentMonthLabel: document.getElementById('currentMonthLabel'),
        headerTitle: document.getElementById('headerTitle'),
        rosterBody: document.getElementById('rosterBody')
    };

    // --- Initialization ---
    function init() {
        loadSettings();
        loadDefaultLogo(); // Auto-load logo for export

        // Default start date logic
        if (!localStorage.getItem(STORAGE_KEY_START_DATE)) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            state.startDate = today;
            el.startDateInput.valueAsDate = today;
        }

        render();
        bindEvents();
    }

    async function loadDefaultLogo() {
        if (!state.logoBase64) {
            // 1. Try Hardcoded Base64 (Most Robust for file:///)
            // Truncated for brevity in code view, but full string is essential
            const LOGO_BASE64_FALLBACK = "data:image/jpeg;base64,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";

            try {
                // Pre-check if logo exists to avoid errors in fetched scenario
                // But mostly we rely on the snippet above for file:/// 
                try {
                    const response = await fetch('./logo.jpg');
                    if (response.ok) {
                        const blob = await response.blob();
                        state.logoBase64 = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                        console.log("Default logo loaded via fetch.");
                    } else {
                        throw new Error("Fetch failed");
                    }
                } catch (fetchErr) {
                    console.warn("Fetch failed, using hardcoded fallback for local file execution.");
                    state.logoBase64 = LOGO_BASE64_FALLBACK;
                }
            } catch (e) {
                console.warn("Could not auto-load default logo:", e);
                // Last ditch
                state.logoBase64 = LOGO_BASE64_FALLBACK;
            }
        }
    }

    // --- Logic Functions ---

    function loadSettings() {
        const storedStaff = localStorage.getItem(STORAGE_KEY_STAFF);
        const storedDate = localStorage.getItem(STORAGE_KEY_START_DATE);

        if (storedStaff) {
            state.staffList = JSON.parse(storedStaff);
            el.staffInput.value = state.staffList.join('\n');
        }

        if (storedDate) {
            state.startDate = new Date(storedDate);
            state.startDate.setHours(0, 0, 0, 0);

            const offset = state.startDate.getTimezoneOffset();
            const dateForInput = new Date(state.startDate.getTime() - (offset * 60 * 1000));
            el.startDateInput.value = dateForInput.toISOString().split('T')[0];
        }
    }

    function saveSettings() {
        const rawText = el.staffInput.value;
        const names = rawText.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0);

        state.staffList = names;
        localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(names));

        if (el.startDateInput.value) {
            const newStart = new Date(el.startDateInput.value);
            newStart.setHours(0, 0, 0, 0);
            state.startDate = newStart;
            localStorage.setItem(STORAGE_KEY_START_DATE, newStart.toISOString());
        }

        render();

        // Auto-sync to GitHub if configured
        if (state.githubConfig.token) {
            syncToGithub();
        }
    }

    /**
     * CORE LOGIC: Pair Rotation
     */
    function getShiftsForDate(targetDate) {
        if (state.staffList.length < 2) return [];

        const staff = state.staffList;
        const pairs = [];

        for (let i = 0; i < staff.length; i += 2) {
            if (i + 1 < staff.length) {
                pairs.push([staff[i], staff[i + 1]]);
            } else {
                pairs.push([staff[i], staff[i]]);
            }
        }

        const cycle = [];
        pairs.forEach(p => cycle.push(p));
        pairs.forEach(p => cycle.push([p[1], p[0]]));

        const oneDay = 24 * 60 * 60 * 1000;
        const start = new Date(state.startDate);
        start.setHours(0, 0, 0, 0);
        const target = new Date(targetDate);
        target.setHours(0, 0, 0, 0);

        const startDay = start.getDay();
        const startMonDiff = startDay === 0 ? -6 : 1 - startDay;
        const anchorMonday = new Date(start);
        anchorMonday.setDate(start.getDate() + startMonDiff);

        const targetDay = target.getDay();
        const targetMonDiff = targetDay === 0 ? -6 : 1 - targetDay;
        const targetMonday = new Date(target);
        targetMonday.setDate(target.getDate() + targetMonDiff);

        const diffTime = targetMonday.getTime() - anchorMonday.getTime();
        const weekIndex = Math.round(diffTime / (oneDay * 7));

        const cycleLen = cycle.length;
        const normalizedWeekIndex = ((weekIndex % cycleLen) + cycleLen) % cycleLen;

        if (targetDay === 0) { // SUNDAY
            const currentPair = cycle[normalizedWeekIndex];
            const nextIndex = (normalizedWeekIndex + 1) % cycleLen;
            const nextPair = cycle[nextIndex];
            return [currentPair[0], currentPair[1], nextPair[0]];
        } else { // MON - SAT
            const dayOffset = targetDay - 1;
            const itemIndex = (normalizedWeekIndex + dayOffset) % cycleLen;
            return cycle[itemIndex];
        }
    }

    // --- Helpers ---
    function getHolidayName(date) {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const key = `${d}/${m}`;

        // Fixed Holidays
        if (key === '1/1') return 'Tết Dương Lịch';
        if (key === '30/4') return 'Giải Phóng MN';
        if (key === '1/5') return 'QT Lao Động';
        if (key === '2/9') return 'Quốc Khánh';

        const lunarKeys = {
            '2025': {
                '29/1': 'Mùng 1 Tết', '30/1': 'Mùng 2 Tết', '31/1': 'Mùng 3 Tết',
                '7/4': 'Giỗ Tổ Hùng Vương'
            },
            '2026': {
                '17/2': 'Mùng 1 Tết', '18/2': 'Mùng 2 Tết', '19/2': 'Mùng 3 Tết',
                '27/4': 'Giỗ Tổ Hùng Vương'
            }
        };

        if (lunarKeys[y] && lunarKeys[y][key]) {
            return lunarKeys[y][key];
        }

        return null;
    }

    // --- Rendering ---
    function render() {
        renderHeader();
        renderTable();
    }

    function renderHeader() {
        const formatter = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' });
        const text = formatter.format(state.viewDate);
        el.currentMonthLabel.textContent = text.charAt(0).toUpperCase() + text.slice(1);
        el.headerTitle.textContent = `LỊCH TRỰC ${text.toUpperCase()}`;
    }

    function renderTable() {
        el.rosterBody.innerHTML = '';
        const fragment = document.createDocumentFragment(); // Use Fragment for performance

        const year = state.viewDate.getFullYear();
        const month = state.viewDate.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
            const currentDate = new Date(year, month, d);
            const shifts = getShiftsForDate(currentDate);

            // LOGIC KÍP 4: Chỉ hiển thị vào Chủ Nhật (0)
            // Lấy người Kíp 2 của ngày Thứ 7 trong cùng tuần (Trước đó 1 ngày)
            let s4 = '';
            if (currentDate.getDay() === 0) { // Is Sunday
                const satDate = new Date(currentDate);
                satDate.setDate(currentDate.getDate() - 1); // Back 1 day to Saturday
                const satShifts = getShiftsForDate(satDate);
                s4 = satShifts[1] || ''; // Kíp 2 is index 1
            }

            const tr = document.createElement('tr');

            // Check Special Days
            if (currentDate.getTime() === today.getTime()) {
                tr.classList.add('is-today');
            }

            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0) {
                tr.classList.add('is-sunday');
            } else if (dayOfWeek === 6) {
                tr.classList.add('is-saturday');
            }

            // Holiday Check
            const holidayName = getHolidayName(currentDate);
            if (holidayName) {
                tr.classList.add('is-holiday');
            }

            // Format: Thứ... - dd/mm/yyyy
            const dayString = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(currentDate);
            const dateString = `${String(d).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

            // Combine
            let timeDisplay = `<strong>${dayString}</strong> - ${dateString}`;
            if (holidayName) {
                timeDisplay += `<br><span class="holiday-label">(${holidayName})</span>`;
            }

            const s1 = shifts[0] || '';
            const s2 = shifts[1] || '';
            const s3 = shifts[2] || '';

            // Kíp 4 display
            const s4Display = s4 ? `<strong>${s4}</strong>` : '<span class="empty-slot">-</span>';

            tr.innerHTML = `
                <td class="col-time">${timeDisplay}</td>
                <td class="col-shift">${s1}</td>
                <td class="col-shift">${s2}</td>
                <td class="col-shift">${s3 ? s3 : '<span class="empty-slot">-</span>'}</td>
                <td class="col-shift">${s4Display}</td>
            `;

            fragment.appendChild(tr); // Append to fragment first
        }
        el.rosterBody.appendChild(fragment); // Single DOM update
    }

    // --- Event Handlers ---
    function bindEvents() {
        el.saveBtn.addEventListener('click', () => {
            saveSettings();
            alert('Đã cập nhật lịch theo quy luật cặp!');
        });

        el.prevMonthBtn.addEventListener('click', () => {
            state.viewDate.setMonth(state.viewDate.getMonth() - 1);
            render();
        });

        el.nextMonthBtn.addEventListener('click', () => {
            state.viewDate.setMonth(state.viewDate.getMonth() + 1);
            render();
        });

        el.todayBtn.addEventListener('click', () => {
            state.viewDate = new Date();
            render();
            setTimeout(() => {
                const todayRow = document.querySelector('.is-today');
                if (todayRow) todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    // --- Weather & Location ---




    // --- Export Functions ---
    // Helper: Read file input as Base64
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Helper: Convert Image to Base64 (Essential for Word)
    const getBase64Image = (imgUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = () => {
                resolve(null); // Return null on error so we don't break export
            };
            img.src = imgUrl; // Start loading
        });
    };

    const exportFile = async (type) => { // Must be async for image
        const table = document.getElementById('rosterTable');
        const title = el.headerTitle.textContent;

        // "Presidential-Grade" Styles for Word/Excel/PDF
        const style = `
            <style>
                body { font-family: 'Times New Roman', serif; color: #000; }
                table { width: 100%; border-collapse: collapse; margin-top: 5px; } /* Reduced margin */
                th, td { border: 1px solid black; padding: 3pt; text-align: center; font-size: 11pt; } /* Reduced padding */
                th { background-color: #f0f0f0; font-weight: bold; }
                .col-time { text-align: left; width: 25%; }
                
                /* Layout Table for Header (Invisible Borders) */
                .header-table { width: 100%; border: none !important; margin-bottom: 10px; } /* Reduced margin */
                .header-table td { border: none !important; padding: 5px; text-align: left; vertical-align: middle; }
                
                /* Text Styles */
                .hospital-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; color: #004d99; margin-bottom: 5px; }
                .dept-name { font-size: 15pt; font-weight: bold; color: #cc0000; margin-bottom: 5px; }
                .app-name { font-size: 14pt; font-style: italic; color: #555; }
                .doc-title { text-align: center; font-size: 20pt; font-weight: bold; color: #000; margin: 15px 0; text-transform: uppercase; } /* Reduced margin */
                
                .footer { margin-top: 20px; width: 100%; page-break-inside: avoid; } /* Reduced margin */
                .footer-table { width: 100%; border: none; margin-top: 10px; }
                .footer-table td { border: none; text-align: center; font-size: 11pt; vertical-align: top; }
            </style>
        `;

        // 1. Prepare Logo
        let logoImgTag = '';
        const logoSize = 'width="140" height="140"'; // Standardized size for all

        if (state.logoBase64) {
            logoImgTag = `<img src="${state.logoBase64}" ${logoSize} style="object-fit: contain;">`;
        } else {
            const logoEl = document.querySelector('.brand-logo');
            if (logoEl) {
                const b64 = await getBase64Image(logoEl.src);
                if (b64) {
                    logoImgTag = `<img src="${b64}" ${logoSize} style="object-fit: contain;">`;
                }
            }
            // Fallback
            if (!logoImgTag) {
                logoImgTag = `<div style="width:140px; height:140px; border:1px dashed #ccc; display:flex; align-items:center; justify-content:center;">Logo</div>`;
            }
        }

        // 2. Build Header HTML (Shared)
        const headerHtml = `
            <table class="header-table">
                <tr>
                    <td style="width: 30%; text-align: center;">${logoImgTag}</td>
                    <td style="width: 70%; text-align: center; vertical-align: middle;">
                        <div class="hospital-name">BỆNH VIỆN ĐK HỒNG ĐỨC III</div>
                        <div class="dept-name">KHOA PT-GMHS</div>
                        <div class="app-name">LỊCH TRỰC Y CỤ</div>
                    </td>
                </tr>
            </table>
            <div class="doc-title">${title}</div>
        `;

        // 3. Build Footer HTML (Shared)
        const footerHtml = `
            <div class="footer">
                <table class="footer-table">
                    <tr>
                        <td style="width: 50%;"><strong>NGƯỜI LẬP BẢNG</strong><br><i>(Ký, ghi rõ họ tên)</i><br><br><br><br><br><br></td>
                        <td style="width: 50%;"><strong>TRƯỞNG KHOA DUYỆT</strong><br><i>(Ký, đóng dấu)</i><br><br><br><br><br><br></td>
                    </tr>
                    <tr>
                        <td><strong>NGUYỄN VĂN TÂN</strong></td>
                        <td>.........................................</td>
                    </tr>
                </table>
                    <div style="margin-top: 100px;">
                        <div style="text-align: right; font-size: 10pt; color: #666; font-style: italic; margin-bottom: 5px;">
                            Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
                        </div>
                        <div style="text-align: center; border-top: 1px solid #ccc; padding-top: 10px; font-size: 9pt; color: #888;">
                            Phát triển bởi<br><strong>Tân Nguyễn</strong> | Chuyên nghiệp - Hiệu quả - Tin cậy
                        </div>
                    </div>
            </div>
        `;

        // 4. Assemble Content
        const innerContent = `
            <div class="export-mode" style="background: white; padding: 20px; width: 210mm; margin: 0 auto;">
                ${style}
                ${headerHtml}
                ${table.outerHTML}
                ${footerHtml}
            </div>
        `;

        // Wrapper for Word/Excel (Needs full HTML structure)
        const fullDocHtml = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${title}</title></head><body>
            ${innerContent}
            </body></html>
        `;

        let link, name;

        if (type === 'excel') {
            const blob = new Blob([fullDocHtml], { type: 'application/vnd.ms-excel' });
            link = URL.createObjectURL(blob);
            name = `Lich_Truc_${state.viewDate.getMonth() + 1}_${state.viewDate.getFullYear()}.xls`;
        } else if (type === 'word') {
            const blob = new Blob([fullDocHtml], { type: 'application/msword' });
            link = URL.createObjectURL(blob);
            name = `Lich_Truc_${state.viewDate.getMonth() + 1}_${state.viewDate.getFullYear()}.doc`;
        } else if (type === 'pdf') {
            // PDF Logic: Use Native Browser Print (iframe) to ensure 100% WYSIWYG
            // This fixes the "Blank PDF" issue by using the browser's own rendering engine
            const iframe = document.createElement('iframe');

            // Hide iframe but keep it part of layout/render tree
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';

            document.body.appendChild(iframe);

            // Get valid document
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(fullDocHtml);
            doc.close();

            // Wait for images (Logo) to load inside iframe then Print
            iframe.contentWindow.focus(); // Focus needed for some browsers
            setTimeout(() => {
                iframe.contentWindow.print();
                // Clean up after print dialog closes (approximate) or let it stay hidden
                // Removing immediately might kill the print dialog in some browsers
                // So we remove it after a long delay
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 60000);
            }, 500);

            return;
        }

        if (link) {
            const a = document.createElement('a');
            a.href = link;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    // --- Digital Clock ---
    function initClock() {
        const update = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            const clockEl = document.getElementById('digitalClock');
            if (clockEl) {
                clockEl.textContent = `${h}:${m}:${s}`;
            }
        };
        update(); // Initial call
        setInterval(update, 1000);

        // Bind Export Buttons
        document.getElementById('exportExcel')?.addEventListener('click', () => exportFile('excel'));
        document.getElementById('exportWord')?.addEventListener('click', () => exportFile('word'));
        document.getElementById('exportPDF')?.addEventListener('click', () => exportFile('pdf'));

        // Logo Input Listener
        document.getElementById('exportPDF')?.addEventListener('click', () => exportFile('pdf'));
    }

    // --- GitHub Cloud Logic ---
    const STORAGE_KEY_GITHUB = 'dutyRoster_github_config';

    // Add to state
    state.githubConfig = {
        token: '',
        owner: '',
        repo: '',
        path: 'data.json',
        sha: null // To track file for updates
    };

    // GitHub DOM Elements
    const ghEl = {
        panel: document.getElementById('githubPanel'),
        token: document.getElementById('ghToken'),
        owner: document.getElementById('ghOwner'),
        repo: document.getElementById('ghRepo'),
        path: document.getElementById('ghPath'),
        saveBtn: document.getElementById('ghSaveConfigBtn'),
        syncBtn: document.getElementById('ghSyncBtn'),
        status: document.getElementById('ghStatus')
    };

    // UTF-8 friendly Base64 helpers
    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    function loadGithubConfig() {
        const stored = localStorage.getItem(STORAGE_KEY_GITHUB);
        if (stored) {
            const cfg = JSON.parse(stored);
            state.githubConfig = { ...state.githubConfig, ...cfg };

            // Populate UI
            if (ghEl.token) ghEl.token.value = state.githubConfig.token;
            if (ghEl.owner) ghEl.owner.value = state.githubConfig.owner;
            if (ghEl.repo) ghEl.repo.value = state.githubConfig.repo;
            if (ghEl.path) ghEl.path.value = state.githubConfig.path;

            updateGithubStatus('Đã nạp cấu hình', 'neutral');
        }
    }

    function saveGithubConfig() {
        state.githubConfig.token = ghEl.token.value.trim();
        state.githubConfig.owner = ghEl.owner.value.trim();
        state.githubConfig.repo = ghEl.repo.value.trim();
        state.githubConfig.path = ghEl.path.value.trim() || 'data.json';

        // Persist excluding SHA (SHA is dynamic)
        const toSave = { ...state.githubConfig };
        delete toSave.sha;
        localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(toSave));

        updateGithubStatus('Đã lưu cấu hình! Đang thử kết nối...', 'neutral');
        // Initial Pull to verify and get SHA
        syncFromGithub();
    }

    function updateGithubStatus(msg, type = 'neutral') {
        if (!ghEl.status) return;
        ghEl.status.textContent = msg;
        if (type === 'success') ghEl.status.style.color = 'green';
        else if (type === 'error') ghEl.status.style.color = 'red';
        else ghEl.status.style.color = '#64748b';
    }

    async function syncFromGithub() {
        const { token, owner, repo, path } = state.githubConfig;
        if (!token || !owner || !repo) {
            updateGithubStatus('Thiếu thông tin cấu hình!', 'error');
            return;
        }

        updateGithubStatus('Đang tải dữ liệu từ GitHub...', 'neutral');

        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const res = await fetch(url, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (res.status === 404) {
                updateGithubStatus('File chưa tồn tại. Sẽ tạo mới khi đồng bộ.', 'neutral');
                state.githubConfig.sha = null;
                return;
            }

            if (!res.ok) throw new Error(`Lỗi GitHub: ${res.status}`);

            const data = await res.json();
            state.githubConfig.sha = data.sha; // Save SHA for next update

            // Decode content
            const content = b64DecodeUnicode(data.content);
            const parsed = JSON.parse(content);

            // Update App State
            if (parsed.staffList) {
                state.staffList = parsed.staffList;
                el.staffInput.value = state.staffList.join('\n');
                localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(state.staffList));
            }

            if (parsed.startDate) {
                state.startDate = new Date(parsed.startDate);
                el.startDateInput.value = state.startDate.toISOString().split('T')[0];
                localStorage.setItem(STORAGE_KEY_START_DATE, state.startDate.toISOString());
            }

            // Re-render
            render();
            updateGithubStatus(`Đồng bộ xong lúc ${new Date().toLocaleTimeString()}`, 'success');

        } catch (err) {
            console.error(err);
            updateGithubStatus(`Lỗi: ${err.message}`, 'error');
        }
    }

    async function syncToGithub() {
        const { token, owner, repo, path, sha } = state.githubConfig;
        if (!token || !owner || !repo) return;

        updateGithubStatus('Đang đẩy dữ liệu lên GitHub...', 'neutral');

        // Prepare data
        const dataToSync = {
            staffList: state.staffList,
            startDate: state.startDate.toISOString(),
            lastUpdated: new Date().toISOString(),
            updatedBy: 'App Admin'
        };

        const content = b64EncodeUnicode(JSON.stringify(dataToSync, null, 2));

        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const body = {
                message: "Update duty roster from App",
                content: content
            };
            if (sha) body.sha = sha; // Required for updates

            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error(`Lỗi GitHub: ${res.status}`);

            const resData = await res.json();
            state.githubConfig.sha = resData.content.sha; // Update SHA
            updateGithubStatus(`Đã lưu lên Cloud lúc ${new Date().toLocaleTimeString()}`, 'success');

        } catch (err) {
            console.error(err);
            updateGithubStatus(`Lỗi Upload: ${err.message}`, 'error');
        }
    }

    // --- Mobile Menu Toggle ---
    const brandHeader = document.querySelector('.brand');
    const sidebarContent = document.querySelector('.sidebar-content');
    if (brandHeader && sidebarContent) {
        brandHeader.addEventListener('click', (e) => {
            // Check if we are in mobile mode by checking if sidebarContent is hidden
            // OR just toggle 'active' class which controls visibility in CSS for mobile
            // Preventing toggle if clicking inside sidebar-content (though that's separate)
            sidebarContent.classList.toggle('active');
        });
    }

    // Run
    init();
    initClock();   // Start clock

    // Hook up GitHub Events
    if (ghEl.saveBtn) ghEl.saveBtn.addEventListener('click', saveGithubConfig);
    if (ghEl.syncBtn) ghEl.syncBtn.addEventListener('click', () => {
        // Manual sync = Push or Pull? Usually Push changes if Admin, but let's Pull first to be safe or Push?
        // Context: "Đồng bộ ngay" usually means "Make sure cloud is up to date".
        // Let's do a Push since Admin just edited things, OR Pull if they want to get updates.
        // Let's Trigger Push for now as it's an Admin Save action area.
        // Actually better: Pull then Push logic is complex.
        // Simple: Push current state.
        syncToGithub();
    });

    // Load Config on Start
    loadGithubConfig();
});

