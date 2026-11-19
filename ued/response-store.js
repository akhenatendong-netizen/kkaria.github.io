import {zones,feelings} from './data.js';
export const STORE_KEY='garden-feelings-responses-v2';
const valid=r=>r&&typeof r.id==='string'&&zones.some(z=>z.id===r.zone)&&feelings.some(f=>f.id===r.emotion)&&['prototype','visit','demo'].includes(r.context);
export function readResponses(){try{const r=JSON.parse(localStorage.getItem(STORE_KEY)||'[]');return Array.isArray(r)?r.filter(valid):[];}catch{return [];}}
export function putResponse(record){try{const all=readResponses(),i=all.findIndex(r=>r.id===record.id);if(i<0)all.push(record);else all[i]=record;localStorage.setItem(STORE_KEY,JSON.stringify(all));return true;}catch{return false;}}
export function removeResponse(id){try{localStorage.setItem(STORE_KEY,JSON.stringify(readResponses().filter(r=>r.id!==id)));return true;}catch{return false;}}
export function clearResponses(){try{localStorage.removeItem(STORE_KEY);return true;}catch{return false;}}
export function exportResponses(){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({project:'Garden Feelings',scope:'Browser-local prototype data. Not sent to the Garden. Current entries do not ask whether a visit took place. Legacy visit/demo labels are self-reported. No entry verifies a real visit. Not a count of unique visitors.',responses:readResponses()},null,2)],{type:'application/json'}));a.href=url;a.download='garden-feelings-local-feedback.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
