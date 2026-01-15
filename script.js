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
            const logoInput = document.getElementById('logoInput');
            const saveBtn = document.getElementById('saveStaffBtn');
            const logoLabel = document.querySelector('label[for="logoInput"]');

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
            if (logoInput) logoInput.disabled = false;
            if (logoLabel) logoLabel.style.cursor = 'pointer';

            // Show Save Button
            if (saveBtn) saveBtn.style.display = 'block';

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
        logoInput: document.getElementById('logoInput'), // Add DOM ref
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

            el.rosterBody.appendChild(tr);
        }
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
    function initWeather() {
        const checkWeather = () => {
            if (!navigator.geolocation) {
                updateWeatherUI('N/A', 'Không hỗ trợ vị trí', '❓');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                    fetchLocationName(lat, lon);
                },
                (error) => {
                    console.error("Geo error:", error);
                    updateWeatherUI('--°C', 'Chưa cấp quyền', '📍');
                }
            );
        };

        const fetchWeather = async (lat, lon) => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    const wCode = data.current_weather.weathercode;
                    const icon = getWeatherIcon(wCode);

                    // Only update temp and icon here, wait for location
                    const wWidget = document.getElementById('weatherWidget');
                    if (wWidget) {
                        wWidget.querySelector('.weather-icon').textContent = icon;
                        document.getElementById('temp').textContent = `${temp}°C`;
                    }
                }
            } catch (err) {
                console.error("Weather fetch error", err);
            }
        };

        const fetchLocationName = async (lat, lon) => {
            try {
                // Use OpenStreetMap Nominatim for free reverse geocoding
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.address) {
                    const a = data.address;
                    // Logic: Try to get "District, Province" or "City, Country"
                    // 1. Specific local part (District, Town, Suburb)
                    const local = a.suburb || a.district || a.town || a.city_district;
                    // 2. Regional part (City, State)
                    const region = a.city || a.state;

                    let parts = [];
                    if (local) parts.push(local);
                    if (region && region !== local) parts.push(region);

                    // Fallback if very sparse
                    if (parts.length === 0) {
                        if (a.country) parts.push(a.country);
                        else parts.push('Vị trí hiện tại');
                    } else if (parts.length === 1 && a.country) {
                        // If only have city, maybe add country
                        parts.push(a.country);
                    }

                    const locString = parts.join(', ');

                    document.getElementById('location').textContent = locString;
                    document.getElementById('location').title = locString;
                }
            } catch (err) {
                console.error("Location fetch error", err);
                document.getElementById('location').textContent = "Không xác định";
            }
        };

        const updateWeatherUI = (temp, loc, icon) => {
            const wWidget = document.getElementById('weatherWidget');
            if (wWidget) {
                wWidget.querySelector('.weather-icon').textContent = icon;
                document.getElementById('temp').textContent = temp;
                document.getElementById('location').textContent = loc;
            }
        };

        const getWeatherIcon = (code) => {
            if (code === 0) return '☀️'; // Clear sky
            if (code >= 1 && code <= 3) return '🌥️'; // Partly cloudy
            if (code >= 45 && code <= 48) return '🌫️'; // Fog
            if (code >= 51 && code <= 67) return '🌧️'; // Drizzle / Rain
            if (code >= 71 && code <= 77) return '❄️'; // Snow
            if (code >= 80 && code <= 82) return '🌧️'; // Showers
            if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
            return '🌤️';
        };

        checkWeather();
    }

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
        if (el.logoInput) {
            el.logoInput.addEventListener('change', async (e) => {
                if (e.target.files && e.target.files[0]) {
                    try {
                        state.logoBase64 = await readFileAsBase64(e.target.files[0]);
                        // Update UI immediately
                        const logoEl = document.querySelector('.brand-logo');
                        if (logoEl) logoEl.src = state.logoBase64;
                    } catch (err) {
                        console.error("Error reading logo", err);
                    }
                }
            });
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
    initWeather(); // Start weather check
    initClock();   // Start clock
});
