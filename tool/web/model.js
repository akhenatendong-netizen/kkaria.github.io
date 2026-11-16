/* Illustrative records for the prototype. No live collection data. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.LoopModel = model;
})(typeof window !== 'undefined' ? window : this, function () {
  const reports = {
    October: { period: 'October', date: '31 October 2026', total: 1240, accepted: 1010, rejected: 150, unclassified: 80, recovered: null, processLoss: null, updated: '4 November 2026', ref: 'RIV-2026-10' },
    September: { period: 'September', date: '30 September 2026', total: 1100, accepted: 880, rejected: 140, unclassified: 80, recovered: 800, processLoss: 80, updated: '28 October 2026', ref: 'RIV-2026-09' }
  };
  const materials = {
    plastic: { name: 'Plastic bottles', short: 'Plastic', item: 'bottle', steps: ['Collected with other accepted items', 'Separated by plastic type', 'Washed and shredded into flakes', 'May become new packaging'], process: 'Suitable plastic is separated, washed and shredded into flakes. The material can then be prepared for manufacturing.', future: 'New packaging', caveat: 'The final use depends on the plastic type, quality and processor. A bottle-to-bottle route is not guaranteed.' },
    metal: { name: 'Aluminium cans', short: 'Metal', item: 'can', steps: ['Collected with other accepted items', 'Separated from other metals', 'Melted and cast into new metal', 'May become new cans or metal products'], process: 'Aluminium is separated from other materials and melted. The recovered metal can be cast and used in manufacturing.', future: 'New cans and metal products', caveat: 'The actual product and destination require a downstream record. This is a possible material route.' },
    paper: { name: 'Paper & card', short: 'Paper & card', item: 'box', steps: ['Collected in the paper and card stream', 'Sorted and contaminants removed', 'Pulped and made into new material', 'May become new paper or cardboard'], process: 'Suitable paper and card are sorted and pulped. Fibres can be recovered and formed into new paper or cardboard.', future: 'New paper and cardboard', caveat: 'Contamination and fibre quality affect recovery. This does not confirm what one box becomes.' },
    glass: { name: 'Glass', short: 'Glass', item: 'jar', steps: ['Collected through a separate service', 'Sorted and contaminants removed', 'Crushed and prepared for processing', 'May become new glass products'], process: 'Glass may be sorted, crushed and remelted, depending on the collection service and material quality.', future: 'New glass products', caveat: 'Glass is not collected at the demo point. This is a general explanation, not its recorded route.' }
  };
  function normaliseHistory(raw, validIds) {
    if (!Array.isArray(raw)) return [];
    return raw.filter(x => x && validIds.includes(x.id) && typeof x.at === 'string' && Number.isFinite(Date.parse(x.at)))
      .slice(0, 100).map((x, n) => ({ id: x.id, at: x.at, uid: typeof x.uid === 'string' ? x.uid : 'legacy-' + n + '-' + Date.parse(x.at), quantity: Number.isInteger(x.quantity) && x.quantity >= 1 && x.quantity <= 20 ? x.quantity : 1, point: 'riverside' }));
  }
  function validateQuantity(value) {
    if (String(value).trim() === '') return null;
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 20 ? n : null;
  }
  function createActivity(item, quantity, at = new Date().toISOString(), uid = String(Date.now())) {
    const n = validateQuantity(quantity);
    if (!item || item.state !== 'green' || n === null || !Number.isFinite(Date.parse(at))) return null;
    return { uid, id: item.id, quantity: n, at, point: 'riverside' };
  }
  function activityTotal(records) { return records.reduce((sum, x) => sum + x.quantity, 0); }
  function reportFor(period) { return reports[period] || reports.October; }
  function sourceFor(kind, period) {
    const r = reportFor(period);
    const common = { date: r.date, updated: r.updated, ref: r.ref, scope: 'Combined load · Riverside demo point', kind: 'Sample record · fictional data' };
    if (kind === 'collection') return { ...common, name: 'Collection weight record', body: `${r.total.toLocaleString()} kg was collected in this example. The record combines all accepted materials at this demo point.`, limit: 'This is not a record of an individual item. Collection alone does not prove recycling.' };
    if (kind === 'sorting') return { ...common, name: 'Sorting summary', body: `${r.accepted.toLocaleString()} kg accepted for processing; ${r.rejected} kg rejected; ${r.unclassified} kg unclassified. Together these equal ${r.total.toLocaleString()} kg collected.`, limit: 'Accepted for processing does not mean the material has become a new product.' };
    if (kind === 'processing') return { ...common, name: 'Processing outcome', body: r.recovered === null ? 'No processing record is available in this example. Output weight, yield and destination remain unknown.' : `${r.accepted} kg of accepted input produced ${r.recovered} kg of recovered material and ${r.processLoss} kg of processing loss in this example. The earlier ${r.rejected} kg of sorting rejects and ${r.unclassified} kg of unclassified material are separate.`, limit: 'Recovered material is manufacturing input, not evidence of a finished product or a measured carbon saving.' };
    return null;
  }
  return { reports, materials, normaliseHistory, validateQuantity, createActivity, activityTotal, reportFor, sourceFor };
});
