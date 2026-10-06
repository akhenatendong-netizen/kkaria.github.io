import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const out=resolve(root,process.argv[2]||'../index.html');
const result=await build({entryPoints:[resolve(root,'src/main.tsx')],absWorkingDir:root,bundle:true,write:false,outfile:'portable.js',format:'iife',platform:'browser',target:'es2022',minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},external:['/assets/*'],legalComments:'inline'});
const mime={'.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf'};
async function inlineAssets(text){
 const paths=[...new Set(text.match(/\/assets\/[a-zA-Z0-9_.-]+/g)||[])];
 for(const path of paths){const data=await readFile(resolve(root,'public'+path));text=text.split(path).join(`data:${mime[extname(path)]||'application/octet-stream'};base64,${data.toString('base64')}`);}
 return text;
}
const js=await inlineAssets(result.outputFiles.find(f=>f.path.endsWith('.js')).text);
const css=await inlineAssets(result.outputFiles.find(f=>f.path.endsWith('.css')).text);
let html=await readFile(resolve(root,'index.html'),'utf8');
html=html.replace(/<script type="module" src="\/src\/main.tsx"><\/script>/,'').replace('</head>',()=>`<style>${css.replace(/<\/style/gi,'<\\/style')}</style></head>`).replace('</body>',()=>`<script>${js.replace(/<\/script/gi,'<\\/script')}</script></body>`);
html=await inlineAssets(html);
await mkdir(dirname(out),{recursive:true});await writeFile(out,html);console.log(`Ready: ${out} (${(Buffer.byteLength(html)/1024/1024).toFixed(1)} MB)`);
