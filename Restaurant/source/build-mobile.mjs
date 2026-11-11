import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {extname} from 'node:path';
const result=await build({entryPoints:['src/MobileApp.tsx'],bundle:true,write:false,outfile:'mobile.js',format:'iife',minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},external:['/assets/*']});
async function inline(s){for(const p of [...new Set(s.match(/\/assets\/[a-zA-Z0-9_.-]+/g)||[])]){const b=await readFile('public'+p);s=s.split(p).join('data:'+({'.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf'}[extname(p)])+';base64,'+b.toString('base64'));}return s;}
const css=result.outputFiles.find(f=>f.path.endsWith('.css')).text.replaceAll('/assets/','../assets/'),js=result.outputFiles.find(f=>f.path.endsWith('.js')).text.replaceAll('/assets/','../assets/');
await mkdir('public/demos',{recursive:true});await writeFile('public/demos/mobile.js',js);await writeFile('public/demos/mobile.css',css);
for(const p of ['home','discover','restaurant','offer','checkout','delivery','events','event','search','results']) await writeFile('public/demos/'+p+'.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CrazyBee · ${p}</title><link rel="stylesheet" href="mobile.css"></head><body data-page="${p}"><div id="app"></div><script src="mobile.js"></script></body></html>`);
console.log('Built 10 interactive HTML pages with shared assets.');
