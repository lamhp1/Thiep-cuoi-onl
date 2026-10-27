/**
 * Wedding Action Utilities:
 * 1-Click Thêm vào Lịch (.ics / Google / Apple) và Chỉ đường / Đặt xe Grab, Be.
 */

export interface GuestInfo {
  hasGuest: boolean;
  rawName: string;
  cleanName: string;
  displayName: string;
  fullGreeting: string;
  rsvpPrefill: string;
  guestName?: string;
}

/**
 * Lấy thông tin khách mời từ tham số URL
 * (Đã tắt tính năng thiệp mời đích danh theo yêu cầu - luôn trả về rỗng và hasGuest: false)
 */
export function getGuestInfoFromUrl(): GuestInfo {
  return {
    hasGuest: false,
    rawName: '',
    cleanName: '',
    displayName: '',
    fullGreeting: '',
    rsvpPrefill: '',
  };
}


/**
 * Giải mã chuỗi URL param an toàn
 */
function decodeGuestParam(str: string): string {
  if (!str) return '';
  try {
    const plusReplaced = str.replace(/\+/g, ' ');
    return decodeURIComponent(plusReplaced).trim();
  } catch {
    return str.replace(/\+/g, ' ').trim();
  }
}

/**
 * Định dạng tên khách mời trang trọng theo phong tục cưới Việt Nam
 */
export function formatGuestGreeting(rawName: string): GuestInfo {
  const trimmed = rawName.trim();
  if (!trimmed) {
    return {
      hasGuest: false,
      rawName: '',
      cleanName: '',
      guestName: '',
      displayName: 'Quý khách & Người thương',
      fullGreeting: 'Trân trọng kính mời: Quý khách & Người thương',
      rsvpPrefill: '',
    };
  }

  // Loại bỏ các tiền tố nếu đã có sẵn trong chuỗi
  let cleanName = trimmed;
  const prefixes = [
    /^kính gửi:\s*/i,
    /^kính gửi\s*/i,
    /^thân gửi:\s*/i,
    /^thân gửi\s*/i,
    /^thương gửi:\s*/i,
    /^thương gửi\s*/i,
    /^gửi:\s*/i,
    /^gửi\s*/i,
    /^trân trọng kính mời:\s*/i,
    /^trân trọng kính mời\s*/i,
  ];

  for (const regex of prefixes) {
    if (regex.test(cleanName)) {
      cleanName = cleanName.replace(regex, '').trim();
      break;
    }
  }

  const lower = cleanName.toLowerCase();

  // Kiểm tra xem là lời mời gia đình/tập thể hay cá nhân
  const isFamilyOrGroup =
    lower.includes('gia đình') ||
    lower.includes('đại gia đình') ||
    lower.includes('hai bác') ||
    lower.includes('hai cô') ||
    lower.includes('hai chú') ||
    lower.includes('gia quyến') ||
    lower.includes('và') ||
    lower.includes('&') ||
    lower.includes('cùng') ||
    lower.includes('người thương') ||
    lower.includes('bạn gái') ||
    lower.includes('bạn trai');

  let displayName = cleanName;
  let fullGreeting = '';

  if (isFamilyOrGroup) {
    // Giữ nguyên lời mời gia đình/nhóm trang trọng
    displayName = cleanName;
    fullGreeting = `Kính gửi: ${cleanName}`;
  } else {
    // Cá nhân: thêm "& Người thương" theo quy cách thiệp cưới cao cấp
    displayName = `${cleanName} & Người thương`;
    fullGreeting = `Kính gửi: ${cleanName} & Người thương`;
  }

  return {
    hasGuest: true,
    rawName: trimmed,
    cleanName,
    displayName,
    fullGreeting,
    rsvpPrefill: cleanName,
  };
}

/**
 * Tạo link thiệp (đã gỡ bỏ tham số cá nhân hóa đích danh)
 */
export function buildPersonalizedGuestUrl(baseUrl: string, _guestName?: string): string {
  return baseUrl;
}


/**
 * Xử lý định dạng ngày và giờ chuẩn hóa thành ISO String
 */
function parseEventDateTime(dateStr: string, timeStr: string): { startIso: string; endIso: string; startClean: string; endClean: string } {
  // Chuẩn hóa ngày (2026-12-20 hoặc 20/12/2026)
  let year = '2026';
  let month = '12';
  let day = '20';

  if (dateStr.includes('-')) {
    const p = dateStr.split('-');
    if (p.length === 3) {
      year = p[0];
      month = p[1].padStart(2, '0');
      day = p[2].padStart(2, '0');
    }
  } else if (dateStr.includes('/')) {
    const p = dateStr.split('/');
    if (p.length === 3) {
      day = p[0].padStart(2, '0');
      month = p[1].padStart(2, '0');
      year = p[2];
    }
  }

  // Chuẩn hóa giờ (10:00 hoặc 10h00)
  let hour = '10';
  let minute = '00';
  const timeMatch = timeStr.match(/(\d{1,2})[:h](\d{2})/i) || timeStr.match(/(\d{1,2})/);
  if (timeMatch) {
    hour = timeMatch[1].padStart(2, '0');
    minute = (timeMatch[2] || '00').padStart(2, '0');
  }

  const endHour = String((parseInt(hour, 10) + 4) % 24).padStart(2, '0');

  const startClean = `${year}${month}${day}T${hour}${minute}00`;
  const endClean = `${year}${month}${day}T${endHour}${minute}00`;
  const startIso = `${year}-${month}-${day}T${hour}:${minute}:00`;
  const endIso = `${year}-${month}-${day}T${endHour}:${minute}:00`;

  return { startIso, endIso, startClean, endClean };
}

export interface WeddingEventDetails {
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  description?: string;
  groomName?: string;
  brideName?: string;
}

/**
 * Tạo liên kết Google Calendar chuẩn 1-Click
 */
export function createGoogleCalendarUrl(event: WeddingEventDetails): string {
  const { startClean, endClean } = parseEventDateTime(event.date, event.time);
  const location = `${event.locationName}, ${event.address}`.trim();
  const details = event.description || `Trân trọng kính mời quý khách tham dự ${event.title} cùng gia đình chúng mình.`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startClean}/${endClean}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Tạo và tải file .ics chuẩn RFC 5545 cho Apple Calendar, Outlook và mọi hệ điều hành
 */
export function downloadIcsFile(event: WeddingEventDetails): void {
  const { startClean, endClean } = parseEventDateTime(event.date, event.time);
  const location = `${event.locationName}, ${event.address}`.replace(/,/g, '\\,');
  const details = (event.description || `Trân trọng kính mời tham dự ${event.title}`).replace(/\n/g, '\\n');
  const title = event.title.replace(/,/g, '\\,');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//L\'Amour Wedding//Smart Guest Invitation//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:lamour-wedding-${Date.now()}@lamour.wedding`,
    `DTSTAMP:${startClean}Z`,
    `DTSTART:${startClean}`,
    `DTEND:${endClean}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Nhắc nhở: Ngày mai tham dự ${title}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Sắp đến giờ tham dự ${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsData = icsLines.join('\r\n');
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.setAttribute('download', `dam-cuoi-${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * Lấy các liên kết dẫn đường và đặt xe thông minh (Google Maps, Grab, Be)
 */
export function getSmartNavigationLinks(event: { locationName: string; address: string; mapUrl?: string }) {
  const destinationQuery = `${event.locationName}, ${event.address}`.trim();
  const encodedDest = encodeURIComponent(destinationQuery);
  const encodedAddress = encodeURIComponent(event.address || event.locationName);
  const encodedName = encodeURIComponent(event.locationName || 'Trung tâm tiệc cưới');

  // 1. Google Maps Navigation
  const googleMapsDirectionsUrl = event.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodedDest}`;

  // 2. Grab Ride Links
  // Grab Web Dispatcher & Deep link
  const grabWebUrl = `https://r.grab.com/?action=ride&destination_name=${encodedName}&destination_address=${encodedAddress}`;
  const grabAppScheme = `grab://open?screenType=TRANSPORT&destName=${encodedName}&dropoff=${encodedAddress}`;

  // 3. Be Ride Links
  const beWebUrl = `https://be.com.vn/?destination=${encodedAddress}`;
  const beAppScheme = `be://booking?destination=${encodedAddress}&destName=${encodedName}`;

  return {
    destinationQuery,
    googleMapsDirectionsUrl,
    grabWebUrl,
    grabAppScheme,
    beWebUrl,
    beAppScheme,
  };
}
