// AMC10 Countdown Timer
// Estimated dates for 2026-27 season (update when MAA announces official dates)

const AMC10_DATES = [
  { date: '2026-09-01T00:00:00', label: 'Registration Opens', key: 'registration' },
  { date: '2026-11-04T08:00:00', label: 'AMC 10A Exam', key: 'examA' },
  { date: '2026-11-12T08:00:00', label: 'AMC 10B Exam', key: 'examB' }
];

function getNextAMCEvent() {
  const now = new Date();
  for (const event of AMC10_DATES) {
    const eventDate = new Date(event.date);
    if (eventDate > now) {
      return { ...event, dateObj: eventDate };
    }
  }
  // All events passed - show next year estimate
  return {
    date: '2027-11-03T08:00:00',
    label: 'AMC 10A (2027)',
    key: 'next_year',
    dateObj: new Date('2027-11-03T08:00:00')
  };
}

function updateCountdown() {
  const event = getNextAMCEvent();
  const now = new Date();
  const diff = event.dateObj - now;

  if (diff <= 0) {
    // Event is happening now or just passed, check next
    setTimeout(updateCountdown, 60000);
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  const labelEl = document.getElementById('countdownLabel');
  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');

  if (labelEl) labelEl.textContent = event.label;
  if (daysEl) daysEl.textContent = String(days);
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
}

// Update every minute
updateCountdown();
setInterval(updateCountdown, 60000);
