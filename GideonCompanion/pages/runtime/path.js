export const sep='/';
export function resolve(...parts){let path='';for(const part of parts){const s=String(part);path=s.startsWith('/')?s:path+'/'+s;}const result=[];for(const p of path.split('/'))if(p==='..')result.pop();else if(p&&p!=='.')result.push(p);return '/'+result.join('/');}
export const dirname=p=>resolve(p,'..');
export const extname=p=>{const file=p.split('/').pop();return file.includes('.')?'.'+file.split('.').pop():'';};
export const posix={resolve,dirname,extname,join:resolve,normalize:resolve};
