(function(){
  function formatBRL(num){
    return num.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  }

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const itemsContainer = document.getElementById('items');
  const addItemBtn = document.getElementById('addItem');
  const totalEl = document.getElementById('total');
  const calculateBtn = document.getElementById('calculate');
  const summaryEl = document.getElementById('summary');
  const copyBtn = document.getElementById('copySummary');
  const printBtn = document.getElementById('printBtn');
  const form = document.getElementById('quoteForm');

  function createItemRow(name='', qty=1, price=0){
    const wrapper = document.createElement('div');
    wrapper.className = 'item-row';

    const desc = document.createElement('input');
    desc.type = 'text'; desc.placeholder='Descrição do item'; desc.value = name;

    const qtyInput = document.createElement('input');
    qtyInput.type='number'; qtyInput.min=0; qtyInput.value = qty;

    const priceInput = document.createElement('input');
    priceInput.type='number'; priceInput.min=0; priceInput.step='0.01'; priceInput.value = price;

    const remove = document.createElement('button');
    remove.type='button'; remove.textContent='✕'; remove.title='Remover item'; remove.className='btn';

    remove.addEventListener('click', ()=>{ wrapper.remove(); updateTotal(); });

    [desc, qtyInput, priceInput, remove].forEach(n => wrapper.appendChild(n));
    itemsContainer.appendChild(wrapper);

    [desc, qtyInput, priceInput].forEach(el=> el.addEventListener('input', updateTotal));
    return wrapper;
  }

  function getItems(){
    const rows = itemsContainer.querySelectorAll('.item-row');
    const out = [];
    rows.forEach(r=>{
      const inputs = r.querySelectorAll('input');
      const description = inputs[0].value.trim();
      const qty = Number(inputs[1].value)||0;
      const price = Number(inputs[2].value)||0;
      if(description || qty || price) out.push({description,qty,price});
    });
    return out;
  }

  function updateTotal(){
    const items = getItems();
    const total = items.reduce((s,i)=> s + (i.qty * i.price), 0);
    totalEl.textContent = formatBRL(total);
    return total;
  }

  createItemRow('Visita técnica',1,0);

  addItemBtn.addEventListener('click', ()=> createItemRow());

  calculateBtn.addEventListener('click', ()=>{
    updateTotal();
    renderSummary();
    calculateBtn.textContent = 'Calculado ✓';
    setTimeout(()=> calculateBtn.textContent = 'Calcular', 1200);
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.reportValidity()) return;
    const payload = buildPayload();
    navigator.clipboard?.writeText(payload.summaryText).catch(()=>{});
    alert('Pedido de orçamento copiado para a área de transferência. Cole em seu e‑mail ou em um sistema de atendimento.');
  });

  function buildPayload(){
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value.trim();
    const items = getItems();
    const total = updateTotal();

    const lines = [];
    lines.push(`Nome: ${name}`);
    lines.push(`E‑mail: ${email}`);
    if(phone) lines.push(`Telefone: ${phone}`);
    lines.push(`Serviço: ${service}`);
    if(description) lines.push(`Observações: ${description}`);
    lines.push('\nItens:');
    items.forEach((it,idx)=> lines.push(`${idx+1}. ${it.description} — ${it.qty} x R$ ${formatBRL(it.price)} = R$ ${formatBRL(it.qty*it.price)}`));
    lines.push('\nTotal estimado: R$ ' + formatBRL(total));

    const summaryText = lines.join('\n');
    return {name,email,phone,service,description,items,total,summaryText};
  }

  function renderSummary(){
    const payload = buildPayload();
    if(payload.items.length===0){
      summaryEl.innerHTML = '<p class="muted">Adicione itens para gerar o resumo.</p>';
      return;
    }
    let html = `<div><strong>${payload.name || 'Cliente não informado'}</strong><br><small>${payload.email||''} ${payload.phone?('• '+payload.phone):''}</small></div>`;
    html += `<div style="margin-top:8px"><em>Serviço:</em> ${payload.service}</div>`;
    html += '<hr>';
    html += '<ul>';
    payload.items.forEach(it=>{
      html += `<li>${escapeHtml(it.description)} — ${it.qty} × R$ ${formatBRL(it.price)} = R$ ${formatBRL(it.qty*it.price)}</li>`;
    });
    html += '</ul>';
    html += `<div class="total-row"><strong>Total: R$ ${formatBRL(payload.total)}</strong></div>`;
    summaryEl.innerHTML = html;
  }

  copyBtn.addEventListener('click', ()=>{
    const payload = buildPayload();
    navigator.clipboard?.writeText(payload.summaryText).then(()=>{
      copyBtn.textContent = 'Copiado ✓';
      setTimeout(()=> copyBtn.textContent = 'Copiar resumo',1200);
    }).catch(()=> alert('Não foi possível copiar.'));
  });

  printBtn.addEventListener('click', ()=> window.print());

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\'':'&#39;'}[m]; }); }
})();