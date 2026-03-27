export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const errors = [];

  // Poging 1 — RWS DDL (officieel)
  try {
    const now  = new Date();
    const from = new Date(now - 7 * 24 * 3600 * 1000);
    const fmt  = d => d.toISOString().replace(/\.\d+Z$/, '+00:00');

    const body = {
      Locatie: { Code: 'OEBU', X: 137540, Y: 558045 },
      AquoMetadatalijst: [{ Eenheid: { Code: 'cm' }, Grootheid: { Code: 'WATHTE' } }],
      Periode: { Begindatumtijd: fmt(from), Einddatumtijd: fmt(now) }
    };

    const r = await fetch(
      'https://waterwebservices.rijkswaterstaat.nl/ONLINEWAARNEMINGENSERVICES_DBO/OphalenWaarnemingen',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (!r.ok) throw new Error('DDL HTTP ' + r.status);
    const json  = await r.json();
    const rows  = json?.WaarnemingenLijst?.[0]?.MetingenLijst || [];
    if (!rows.length) throw new Error('Geen metingen');

    const data = rows
      .map(m => ({ t: m.Tijdstip, v: m.Meetwaarde?.Waarde_Numeriek ?? null }))
      .filter(d => d.v !== null);

    return res.status(200).json({ data, source: 'DDL' });
  } catch (e) {
    errors.push('DDL: ' + e.message);
  }

  // Poging 2 — Waterinfo (fallback)
  try {
    const r = await fetch(
      'https://waterinfo.rws.nl/api/chart/get?loc=OEBU-WATHTE-NVT-MSL&period=P7D',
      { headers: { Accept: 'application/json' } }
    );
    if (!r.ok) throw new Error('Waterinfo HTTP ' + r.status);
    const json = await r.json();
    const rows = json?.Data || json?.data || [];
    if (!rows.length) throw new Error('Geen data');

    const data = rows
      .map(d => ({ t: d.DateTime || d.dateTime, v: parseFloat(d.Value ?? d.value) }))
      .filter(d => !isNaN(d.v));

    return res.status(200).json({ data, source: 'Waterinfo' });
  } catch (e) {
    errors.push('Waterinfo: ' + e.message);
  }

  res.status(502).json({ error: errors.join(' | '), data: [] });
}
