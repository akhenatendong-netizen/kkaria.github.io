const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../web/model.js');
test('every reporting scenario balances collection, sorting and processing without inventing missing outcomes', () => {
  for (const r of Object.values(M.reports)) {
    assert.equal(r.accepted+r.rejected+r.unclassified,r.total);
    if (r.recovered!==null) {
      assert.equal(r.recovered+r.processLoss,r.accepted);
      assert.ok(r.recovered<=r.accepted);
    } else assert.equal(r.processLoss,null);
  }
  assert.equal(M.reports.October.recovered,null);
  assert.match(M.sourceFor('processing','October').body,/No processing record/);
  assert.match(M.sourceFor('processing','September').body,/800 kg/);
  assert.match(M.sourceFor('sorting','September').body,/880 kg/);
  assert.equal(M.sourceFor('sorting','September').date,'30 September 2026');
});
test('activity is a self-reported count, never an outcome; rejected and uncertain items cannot be logged', () => {
  for (const state of ['amber','gray']) assert.equal(M.createActivity({id:'cup',state},1),null);
  for (const n of ['',0,-1,1.5,21,NaN,Infinity,'invalid']) assert.equal(M.createActivity({id:'bottle',state:'green'},n),null);
  const a=M.createActivity({id:'bottle',state:'green'},3,'2026-11-13T12:00:00.000Z','test');
  assert.equal(M.activityTotal([a]),3);
  assert.equal(a.point,'riverside');
  assert.equal('period' in a,false);
  assert.equal('recycled' in a,false);
  assert.equal(M.createActivity({id:'bottle',state:'green'},1,'bad date'),null);
});
test('old browser activity migrates without losing counts or crashing on malformed saved data', () => {
  const old={id:'bottle',at:'2026-11-06T09:00:00.000Z'};
  const records=M.normaliseHistory([old,null,{}, {id:'bad',at:old.at},{id:'bottle',at:'invalid'}, {id:'can',at:old.at,quantity:5,uid:'keep'}],['bottle','can']);
  assert.equal(records.length,2);
  assert.equal(records[0].quantity,1);
  assert.equal(records[1].uid,'keep');
  assert.equal(M.activityTotal(records),6);
  assert.deepEqual(M.normaliseHistory('not an array',['bottle']),[]);
});
