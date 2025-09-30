/* 示例数据 */
let items = [
  {
    id: "i01",
    title: "寻人悬赏",
    desc: "武力威胁 省份: 江苏省 JiangSu -  住址 : Map IP: 33.589920,119.612491",
    image: "https://picsum.photos/seed/item1/800/600",
    contact: "email: shadowflame.anonymous@gmail.com\nSignal: /*出生日期: 19 - 09 - 2006 >> 19 Years，性别 sex: Male 男*/",
    price: "Wanted：0.000052 BTC",
    tags: ["悬赏","住址"]
  },
  {
    id: "i02",
    title: "复古相机（示例）",
    desc: "机身良好，镜头干净，适合收藏或拍摄练习。仅供演示。",
    image: "https://picsum.photos/seed/item2/800/600",
    contact: "Telegram: @example_user\nEmail: camera@example.com",
    price: "¥1800",
    tags: ["物品","相机"]
  },
  {
    id: "i03",
    title: "技术咨询（示例）",
    desc: "为学习与合法研究提供技术咨询／匿名沟通方式的介绍（示例）。",
    image: "https://picsum.photos/seed/item3/800/600",
    contact: "Matrix: @example:matrix.org\nEmail: research@example.org",
    price: "服务费：¥500/h",
    tags: ["服务","咨询"]
  }
];

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const searchMobile = document.getElementById('searchMobile');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalThumb = document.getElementById('modalThumb');
const modalDesc = document.getElementById('modalDesc');
const modalContact = document.getElementById('modalContact');
const closeModal = document.getElementById('closeModal');
const syncBtn = document.getElementById('syncBtn');
const syncBtnMobile = document.getElementById('syncBtnMobile');

/* 抽屉菜单逻辑 */
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu(){
  sideMenu.classList.add('show');
  menuOverlay.classList.add('show');
}
function closeMenu(){
  sideMenu.classList.remove('show');
  menuOverlay.classList.remove('show');
}
menuToggle.addEventListener('click', ()=>{
  if(sideMenu.classList.contains('show')) closeMenu();
  else openMenu();
});
menuOverlay.addEventListener('click', closeMenu);

/* 渲染卡片 */
function renderGrid(list){
  grid.innerHTML = '';
  if(list.length === 0){
    grid.innerHTML = '<div style="color:var(--muted);padding:24px">未找到条目。</div>';
    return;
  }
  list.forEach(it => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb" style="background-image:url('${it.image}')"></div>
      <div class="title">${escapeHtml(it.title)}</div>
      <div class="info">${escapeHtml(it.desc)}</div>
      <div class="meta">
        <div class="price">${escapeHtml(it.price)}</div>
        <div style="color:var(--muted);font-size:13px">${it.tags.map(t=>`<span style="margin-left:6px">#${escapeHtml(t)}</span>`).join('')}</div>
      </div>
      <div class="contact-row">
        <button class="contact-btn" data-id="${it.id}">显示联系方式</button>
        <button class="more-btn" data-id="${it.id}">更多</button>
      </div>
      <div class="contact-panel" id="panel-${it.id}">
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(obfuscateContact(it.contact))}</pre>
        <div style="margin-top:10px;font-size:12px;color:var(--muted)">All transactions are conducted in the publisher's copy, please note that anonymous communication is required</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* 工具函数 */
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,"&#39;");
}
function obfuscateContact(contact){
  return contact; // 不做处理，直接显示
}


/* 模态框 */
function openContactModal(id){
  const it = items.find(x=>x.id===id);
  if(!it) return;
  modalTitle.textContent = it.title;
  modalThumb.style.backgroundImage = `url('${it.image}')`;
  modalDesc.textContent = it.desc;
  modalContact.textContent = it.contact;
  modalBackdrop.classList.add('show');
  modalBackdrop.setAttribute('aria-hidden','false');
}
function togglePanel(id){
  const panel = document.getElementById('panel-'+id);
  if(!panel) return;
  panel.classList.toggle('visible');
}

/* 事件委托 */
grid.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.classList.contains('contact-btn')){
    const ctrl = e.shiftKey ? 'modal' : 'panel';
    if(ctrl === 'modal') openContactModal(id);
    else togglePanel(id);
  } else if(btn.classList.contains('more-btn')){
    openContactModal(id);
  }
});

closeModal.addEventListener('click', ()=>{
  modalBackdrop.classList.remove('show');
  modalBackdrop.setAttribute('aria-hidden','true');
});
modalBackdrop.addEventListener('click', (e)=>{
  if(e.target === modalBackdrop){
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden','true');
  }
});

/* 搜索（桌面 & 移动端联动） */
function applyFilter(){
  const q = (search.value || searchMobile.value || "").trim().toLowerCase();
  if(!q){ renderGrid(items); return; }
  const filtered = items.filter(it=>{
    return (it.title+ ' '+ it.desc + ' ' + it.tags.join(' ') + ' ' + it.price).toLowerCase().includes(q);
  });
  renderGrid(filtered);
}
search.addEventListener('input', applyFilter);
searchMobile.addEventListener('input', applyFilter);

/* 同步按钮绑定 */
function bindSync(button){
  button.addEventListener('click', async ()=>{
    try{
      button.textContent = '正在同步…';
      button.disabled = true;
      await new Promise(r=>setTimeout(r,600));
      alert('同步已更新');
    }catch(err){
      console.error(err);
      alert('同步失败（示例错误），请查看控制台。');
    }finally{
      button.disabled = false;
      button.textContent = '同步更新到在线服务器';
    }
  });
}
bindSync(syncBtn);
bindSync(syncBtnMobile);

/* 初次渲染 */
renderGrid(items);
