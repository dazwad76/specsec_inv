window.onload = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  document.getElementById('invoiceDate').textContent = dateStr;

  const invNum = `INV-${today.getFullYear()}${String(today.getMonth()+1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-001`;
  document.getElementById('invoiceNumber').textContent = invNum;
  updateTotals();
};

function addItem() {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="text" class="desc"></td>
    <td><input type="number" class="qty" value="1"></td>
    <td><input type="number" class="price" value="0"></td>
    <td class="item-total">0.00</td>
  `;
  document.getElementById('items').appendChild(row);
  row.addEventListener('input', updateTotals);
}

document.addEventListener('input', updateTotals);

function updateTotals() {
  let total = 0;
  document.querySelectorAll('#items tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.qty')?.value) || 0;
    const price = parseFloat(row.querySelector('.price')?.value) || 0;
    const lineTotal = qty * price;
    row.querySelector('.item-total').textContent = lineTotal.toFixed(2);
    total += lineTotal;
  });
  document.getElementById('invoiceTotal').textContent = total.toFixed(2);
}

function downloadPDF() {
  const element = document.querySelector('.invoice');
  const opt = {
    margin:       0.5,
    filename:     'invoice.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
}