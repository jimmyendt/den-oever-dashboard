export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const url =
      'https://marine-api.open-meteo.com/v1/marine' +
      '?latitude=52.93&longitude=5.04' +
      '&hourly=wave_height,wave_period,wave_direction' +
      '&timezone=Europe%2FAmsterdam&forecast_days=7&past_days=2';

    const r = await fetch(url);
    if (!r.ok) throw new Error('Marine API HTTP ' + r.status);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
