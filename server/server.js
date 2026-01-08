import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// ---- Your calculation logic (ported as-is) ----

function calculateTotalWorkedTime(shifts) {
  const errors = [];
  const shiftsWithDetails = [];
  // console.log("Calculating total worked time for shifts:", shifts);

  if (!Array.isArray(shifts) || shifts.length === 0) {
    errors.push('Input must be a non-empty array of shift objects.');
    return {
      summary: 'time worked: 0 hrs 0 mins',
      totalMinutes: 0,
      hours: 0,
      minutes: 0,
      errors,
    };
  }

  let totalMinutes = 0;

  shifts.forEach((shift, idx) => {
    const prefix = `Shift ${idx + 1}:`;

    if (typeof shift !== 'object' || shift === null) {
      errors.push(`${prefix} must be an object.`);
      return;
    }

    const { start, end, breakMinutes = 0 } = shift;

    if (!isValidTimeString(start)) {
      errors.push(`${prefix} invalid start time. Expected HH:MM (24-hour). Got "${start}".`);
      return;
    }
    if (!isValidTimeString(end)) {
      errors.push(`${prefix} invalid end time. Expected HH:MM (24-hour). Got "${end}".`);
      return;
    }

    if (!isValidNonNegativeInteger(breakMinutes)) {
      errors.push(`${prefix} breakMinutes must be a non-negative integer. Got "${breakMinutes}".`);
      return;
    }

    const minutes = calculateShiftMinutes(start, end, breakMinutes);

    if (minutes < 0) {
      errors.push(
        `${prefix} breakMinutes (${breakMinutes}) exceeds worked duration between ${start} and ${end}.`
      );
      return;
    }
    const shiftHours = Math.floor(minutes / 60);
    const shiftMinutes = Math.floor(minutes % 60);
    console.log(`Shifts: Shift ${idx + 1}: ${shiftHours} hrs ${shiftMinutes} mins`);

    shiftsWithDetails.push({
      start,
      end,
      breakMinutes,
      minutes,
      hours: shiftHours,
      mins: shiftMinutes,
    });

    totalMinutes += minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  return {
    shifts: shiftsWithDetails,
    totals: { totalMinutes, hours: totalHours, minutes: totalMins },
    summary: `total: ${totalHours} hrs ${totalMins} mins`,
    errors,
  };
}

function isValidTimeString(str) {
  if (typeof str !== 'string') return false;
  const match = str.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;

  const hour = Number(match[1]);
  const min = Number(match[2]);

  if (!Number.isInteger(hour) || !Number.isInteger(min)) return false;
  if (hour < 0 || hour > 23) return false;
  if (min < 0 || min > 59) return false;

  return true;
}

function isValidNonNegativeInteger(n) {
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0;
}

function timeToMinutes(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function calculateShiftMinutes(start, end, breakMinutes) {
  let startMin = timeToMinutes(start);
  let endMin = timeToMinutes(end);

  if (endMin < startMin) {
    endMin += 24 * 60;
  }

  const duration = endMin - startMin;
  const net = duration - breakMinutes;

  if (net < 0) return -1;

  return net;
}

// ---- Express app setup ----

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: true })); // in prod, lock this down to your domain
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Calculate endpoint
app.post('/api/calculate-time', (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { shifts } = req.body;
    // console.log('received shifts:', shifts);
    const result = calculateTotalWorkedTime(shifts);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/calculate-time:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
