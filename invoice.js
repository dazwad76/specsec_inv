function updateTotals() {
  const rows = document.querySelectorAll('#items tr');
  let total = 0;
  const currency = document.getElementById('currency').value;
  rows.forEach(row => {
    const hours = row.querySelector('.hours-input').valueAsNumber || 0;
    const rate = row.querySelector('.rate-input').valueAsNumber || 0;
    const amount = hours * rate;
    row.querySelector('.amount').innerText = currency + amount.toFixed(2);
    total += amount;
  });
  document.getElementById('total').innerText = currency + total.toFixed(2);
}

function setRoleRate(row) {
  const roleSelect = row.querySelector('.role-select');
  const rateInput = row.querySelector('.rate-input');
  if (!roleSelect || !rateInput) return;
  switch (roleSelect.value) {
    case 'Steward': rateInput.value = 13.68; break;
    case 'SIA Steward': rateInput.value = 14.50; break;
    case 'SIA Team Leader': rateInput.value = 16.00; break;
    default: rateInput.value = '';
  }
  updateTotals();
}

function handleOtherFestival(select) {
  const otherInput = select.parentNode.querySelector('.other-festival');
  if (select.value === 'OTHER') {
    otherInput.style.display = 'block';
    otherInput.required = true;
  } else {
    otherInput.style.display = 'none';
    otherInput.required = false;
  }
}

function addRow() {
  const tbody = document.getElementById('items');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <select class="festival-select">
        <option value="" disabled selected>Select Festival</option>
        <option>GLASTONBURY</option>
        <option>FINSBURY PARK</option>
        <option>WIRELESS</option>
        <option>LATTITUDE</option>
        <option>READING</option>
        <option>OTHER</option>
      </select>
      <input type="text" class="other-festival" style="display:none; margin-top:5px;" placeholder="Please specify..." />
    </td>
    <td>
      <select name="role" class="role-select">
        <option value="" disabled selected>Select Role</option>
        <option value="Steward">Steward</option>
        <option value="SIA Steward">SIA Steward</option>
        <option value="SIA Team Leader">SIA Team Leader</option>
      </select>
    </td>
    <td><input type="number" min="1" value="1" class="hours-input" required></td>
    <td><input type="number" min="0" value="13.68" class="rate-input" required></td>
    <td class="amount">13.68</td>
    <td><button type="button" class="remove-row" aria-label="Remove row">✖</button></td>
  `;
  tbody.appendChild(row);
  attachListenersToRow(row);
  updateTotals();
}

function removeRow(btn) {
  btn.closest('tr').remove();
  updateTotals();
}

function attachListenersToRow(row) {
  row.querySelector('.festival-select').addEventListener('change', function() {
    handleOtherFestival(this);
  });
  row.querySelector('.role-select').addEventListener('change', function() {
    setRoleRate(row);
  });
  row.querySelector('.hours-input').addEventListener('input', updateTotals);
  row.querySelector('.rate-input').addEventListener('input', updateTotals);
  row.querySelector('.remove-row').addEventListener('click', function() {
    removeRow(this);
  });
}

function validateInputs() {
  let valid = true;
  document.querySelectorAll('input').forEach(input => {
    if (input.required && !input.value) {
      input.classList.add('error');
      valid = false;
    } else {
      input.classList.remove('error');
    }
    if (input.pattern && input.value && !(new RegExp(input.pattern).test(input.value))) {
      input.classList.add('error');
      valid = false;
    }
  });
  return valid;
}

function setDateAndInvoiceNumber() {
  const dateEl = document.getElementById('invoice-date');
  const numberEl = document.getElementById('invoice-number');
  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  dateEl.textContent = `Date: ${formattedDate}`;
  if (!numberEl.textContent.trim()) {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    numberEl.textContent = `Invoice #: ${yyyy}${mm}${dd}-001`;
  }
}

document.getElementById('add-item').addEventListener('click', addRow);
document.getElementById('currency').addEventListener('change', updateTotals);
document.getElementById('download-pdf').addEventListener('click', function() {
  if (!validateInputs()) {
    document.getElementById('pdf-status').textContent = "Please correct highlighted fields before downloading.";
    return;
  }
  document.getElementById('pdf-status').textContent = "Generating PDF...";
  setTimeout(() => {
    html2pdf().from(document.getElementById('invoice')).save('invoice.pdf').then(() => {
      document.getElementById('pdf-status').textContent = "PDF Downloaded!";
      setTimeout(() => document.getElementById('pdf-status').textContent = "", 2000);
    });
  }, 500);
});

// Initial setup
setDateAndInvoiceNumber();
updateTotals();
document.querySelectorAll('#items tr').forEach(attachListenersToRow);
