// 月曆應用程式主要邏輯
class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.currentYear = 2025;
        this.currentMonth = 7; // 8月 (0-based)
        this.today = new Date();
        
        // 課程數據 - 根據課程表
        this.courses = {
            'DNS001': {
                name: 'DNS001',
                title: '數據科學前沿分析研究',
                day: 2, // 星期二
                time: '09:00-12:00',
                color: 'dns001',
                location: 'N104'
            },
            'DNS002': {
                name: 'DNS002', 
                title: '數據挖掘理論、系統與技術',
                day: 4, // 星期四
                time: '15:30-18:30',
                color: 'dns002',
                location: 'N104'
            },
            'DNS003': {
                name: 'DNS003',
                title: '大數據決策與應用', 
                day: 1, // 星期一
                time: '12:15-15:15',
                color: 'dns003',
                location: 'N104'
            },
            'DNS016': {
                name: 'DNS016',
                title: '智慧城市發展的數據建築',
                day: 5, // 星期五  
                time: '09:00-12:00',
                color: 'dns016',
                location: 'N104'
            }
        };
        
        // 課程期間：2025年8月25日至12月6日
        this.semesterStart = new Date(2025, 7, 25); // 8月25日
        this.semesterEnd = new Date(2025, 11, 6);   // 12月6日
        
        // 校曆重要日期
        this.schoolEvents = {
            '2025-08-25': {
                type: 'event',
                title: '開學升旗儀式',
                description: '地點：中葡樓花園\n對象：全校學生',
                time: '全天'
            },
            '2025-09-06': {
                type: 'event', 
                title: '迎新行者活動開始',
                description: '地點：澳門各歷史文化景點、黑沙海灘、氹仔校區\n對象：新生',
                time: '全天'
            },
            '2025-09-07': {
                type: 'event',
                title: '迎新行者活動結束', 
                description: '地點：澳門各歷史文化景點、黑沙海灘、氹仔校區\n對象：新生',
                time: '全天'
            },
            '2025-09-12': {
                type: 'event',
                title: '交換生歡迎會',
                description: '地點：CLG201A 及 CLG201B\n對象：國際學生、歷屆和應屆交流學生',
                time: '16:00-18:00'
            },
            '2025-09-15': {
                type: 'event',
                title: '交換項目宣講會', 
                description: '地點：HG01 會議廳\n對象：全校學生',
                time: '16:00-17:00'
            },
            '2025-10-01': {
                type: 'holiday',
                title: '國慶假期',
                description: '中華人民共和國國慶節',
                time: '全天'
            },
            '2025-12-06': {
                type: 'event',
                title: '學期結束',
                description: '第一學期課程結束',
                time: '全天'
            }
        };
        
        // 月份名稱
        this.monthNames = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderCalendar();
        this.updateCurrentDate();
        
        // 設置定時器更新當前時間
        setInterval(() => {
            this.updateCurrentDate();
        }, 60000); // 每分鐘更新一次
    }
    
    bindEvents() {
        // 月份導航按鈕
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateMonth(-1);
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateMonth(1);
        });
        
        // 模態框關閉
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });
        
        // 點擊模態框外部關閉
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeModal();
            }
        });
        
        // ESC鍵關閉模態框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        // 限制顯示範圍：2025年8月到12月
        if (this.currentYear < 2025 || (this.currentYear === 2025 && this.currentMonth < 7)) {
            this.currentYear = 2025;
            this.currentMonth = 7;
        } else if (this.currentYear > 2025 || (this.currentYear === 2025 && this.currentMonth > 11)) {
            this.currentYear = 2025;
            this.currentMonth = 11;
        }
        
        this.renderCalendar();
    }
    
    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthYearElement = document.getElementById('monthYear');
        
        // 更新月份標題
        monthYearElement.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // 清空網格
        grid.innerHTML = '';
        
        // 獲取本月第一天和最後一天
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // 添加上個月的空白日期
        const prevMonth = new Date(this.currentYear, this.currentMonth - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                daysInPrevMonth - i, 
                true, 
                this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
                this.currentMonth === 0 ? 11 : this.currentMonth - 1
            );
            grid.appendChild(dayElement);
        }
        
        // 添加本月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, false, this.currentYear, this.currentMonth);
            grid.appendChild(dayElement);
        }
        
        // 添加下個月的空白日期
        const totalCells = grid.children.length;
        const remainingCells = 42 - totalCells; // 6週 × 7天
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(
                day, 
                true, 
                this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear,
                this.currentMonth === 11 ? 0 : this.currentMonth + 1
            );
            grid.appendChild(dayElement);
        }
        
        // 添加淡入動畫
        grid.classList.add('fade-in');
        setTimeout(() => {
            grid.classList.remove('fade-in');
        }, 500);
    }
    
    createDayElement(day, isOtherMonth, year, month) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        const date = new Date(year, month, day);
        const dateString = this.formatDate(date);
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        } else {
            // 檢查是否是今天
            if (this.isToday(date)) {
                dayElement.classList.add('today');
            }
            
            // 檢查是否是週末
            if (this.isWeekend(date)) {
                dayElement.classList.add('weekend');
            }
            
            // 檢查是否有學校活動或假期
            if (this.schoolEvents[dateString]) {
                const event = this.schoolEvents[dateString];
                dayElement.classList.add(event.type);
            }
            
            // 檢查是否有課程或其他活動
            const courses = this.getCoursesForDate(date);
            const events = this.getEventsForDate(dateString);
            
            // 創建指示器容器
            if (courses.length > 0 || events.length > 0) {
                this.addIndicators(dayElement, courses, events);
            }
            
            // 添加點擊事件
            dayElement.addEventListener('click', () => {
                this.showDayDetails(date, courses);
            });
        }
        
        return dayElement;
    }
    
    isToday(date) {
        return date.toDateString() === this.today.toDateString();
    }
    
    isWeekend(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 星期日或星期六
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    getCoursesForDate(date) {
        const coursesForDay = [];
        
        // 檢查是否在學期範圍內
        if (date < this.semesterStart || date > this.semesterEnd) {
            return coursesForDay;
        }
        
        const dayOfWeek = date.getDay();
        
        // 檢查每門課程
        Object.values(this.courses).forEach(course => {
            if (course.day === dayOfWeek) {
                coursesForDay.push(course);
            }
        });
        
        return coursesForDay;
    }
    
    getEventsForDate(dateString) {
        const eventsForDay = [];
        
        if (this.schoolEvents[dateString]) {
            const event = this.schoolEvents[dateString];
            eventsForDay.push({
                type: event.type,
                color: event.type,
                title: event.title
            });
        }
        
        return eventsForDay;
    }
    
    addIndicators(dayElement, courses, events) {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'day-indicators';
        
        // 添加課程指示器
        courses.forEach(course => {
            const indicator = document.createElement('div');
            indicator.className = `course-indicator ${course.color}`;
            indicator.title = `${course.name}: ${course.title}`;
            indicatorsContainer.appendChild(indicator);
        });
        
        // 添加其他活動指示器
        events.forEach(event => {
            if (event.type !== 'holiday') { // 假期不添加指示器，因為已經有背景色
                const indicator = document.createElement('div');
                indicator.className = `course-indicator ${event.color}`;
                indicator.title = event.title;
                indicatorsContainer.appendChild(indicator);
            }
        });
        
        if (indicatorsContainer.children.length > 0) {
            dayElement.appendChild(indicatorsContainer);
        }
    }
    
    showDayDetails(date, courses) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        const dateString = this.formatDate(date);
        const displayDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        
        modalTitle.textContent = displayDate;
        
        let content = '';
        
        // 顯示學校活動
        if (this.schoolEvents[dateString]) {
            const event = this.schoolEvents[dateString];
            content += `
                <div class="event-item ${event.type}">
                    <h4><i class="fas fa-calendar-day"></i> ${event.title}</h4>
                    <p><strong>時間：</strong>${event.time}</p>
                    <p><strong>詳情：</strong>${event.description}</p>
                </div>
            `;
        }
        
        // 顯示課程
        if (courses.length > 0) {
            content += '<div class="courses-today">';
            content += '<h4><i class="fas fa-book"></i> 今日課程</h4>';
            
            courses.forEach(course => {
                content += `
                    <div class="course-detail ${course.color}">
                        <h5>${course.name} - ${course.title}</h5>
                        <p><strong>時間：</strong>${course.time}</p>
                        <p><strong>地點：</strong>${course.location}</p>
                    </div>
                `;
            });
            
            content += '</div>';
        }
        
        // 如果沒有任何事件
        if (!content) {
            content = '<p class="no-events">今日沒有課程或特殊活動</p>';
        }
        
        modalBody.innerHTML = `
            <style>
                .event-item, .course-detail {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-medium);
                    margin-bottom: var(--spacing-md);
                }
                .event-item.holiday {
                    border-left: 4px solid var(--course-dns001);
                }
                .event-item.event {
                    border-left: 4px solid var(--event-color);
                }
                .course-detail.dns001 {
                    border-left: 4px solid var(--course-dns001);
                }
                .course-detail.dns002 {
                    border-left: 4px solid var(--course-dns002);
                }
                .course-detail.dns003 {
                    border-left: 4px solid var(--course-dns003);
                }
                .course-detail.dns016 {
                    border-left: 4px solid var(--course-dns016);
                }
                .courses-today h4 {
                    margin-bottom: var(--spacing-md);
                    color: var(--text-primary);
                }
                .no-events {
                    text-align: center;
                    color: var(--text-secondary);
                    font-style: italic;
                }
            </style>
            ${content}
        `;
        
        modal.classList.add('show');
    }
    
    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.remove('show');
    }
    
    updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        currentDateElement.textContent = now.toLocaleDateString('zh-TW', options);
    }
}

// 頁面載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});

// 添加鍵盤導航支持
document.addEventListener('keydown', (e) => {
    const app = window.calendarApp;
    if (!app) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) {
                app.navigateMonth(-1);
                e.preventDefault();
            }
            break;
        case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) {
                app.navigateMonth(1);
                e.preventDefault();
            }
            break;
    }
});

// PWA支持（如果需要）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 這裡可以註冊Service Worker來實現離線功能
        // navigator.serviceWorker.register('/sw.js');
    });
}

// 觸摸手勢支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const app = window.calendarApp;
        if (!app) return;
        
        if (swipeDistance > 0) {
            // 向右滑動 - 上一個月
            app.navigateMonth(-1);
        } else {
            // 向左滑動 - 下一個月  
            app.navigateMonth(1);
        }
    }
}

// 全局變量供調試使用
window.calendarApp = null;
document.addEventListener('DOMContentLoaded', () => {
    window.calendarApp = new CalendarApp();
});
