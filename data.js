export const roles=['音頻控制員','視頻控制員','講台','前麥克風左','前麥克風右','後麥克風','門口招待員','會堂招待員'];
export function parseCSV(text){
 const rows=[];let row=[],value='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else if(quoted||!value)quoted=!quoted;else throw Error('CSV 引號格式錯誤');}else if(!quoted&&(c===','||c==='\n'||c==='\r')){row.push(value);value='';if(c!==','){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(x=>x.trim()))rows.push(row);row=[];}}else value+=c;}
 if(quoted)throw Error('CSV 引號未結束');row.push(value);if(row.some(x=>x.trim()))rows.push(row);
 const headers=rows.shift()?.map(x=>x.trim())||[];for(const key of ['Date','Person','TypeName'])if(!headers.includes(key))throw Error('缺少必要欄位：'+key);
 const result=[],seen=new Set();for(const [i,r] of rows.entries()){if(r.length!==headers.length)throw Error(`第 ${i+2} 列欄位數量不正確`);const o=Object.fromEntries(headers.map((h,j)=>[h,r[j].trim()]));const m=o.Date.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);if(!m)throw Error(`第 ${i+2} 列日期格式不正確`);const [y,mo,d]=m.slice(1).map(Number),dt=new Date(Date.UTC(y,mo-1,d));if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo-1||dt.getUTCDate()!==d)throw Error(`第 ${i+2} 列日期不存在`);if(!o.Person||!o.TypeName)throw Error(`第 ${i+2} 列姓名或職責空白`);const date=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const key=JSON.stringify([date,o.Person,o.TypeName]);if(!seen.has(key)){seen.add(key);result.push({date,month:date.slice(0,7),person:o.Person,role:o.TypeName,day:dt.getUTCDay()});}}
 if(!result.length)throw Error('CSV 沒有安排資料');return result.sort((a,b)=>a.date.localeCompare(b.date));
}
export function displayName(s,reverse=true){const p=s.trim().split(/\s+/);return reverse&&p.length===2?p[1]+p[0]:s;}
export const months=rows=>[...new Set(rows.map(r=>r.month))].sort();
export const people=rows=>[...new Set(rows.map(r=>r.person))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
export const monthLabel=m=>`${Number(m.slice(0,4))}年${Number(m.slice(5))}月`;
