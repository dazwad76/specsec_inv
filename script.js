window.onload = () => {
  document.getElementById("invoiceDate").innerText = new Date().toLocaleDateString();
  document.getElementById("invoiceNumber").innerText = "INV-" + Date.now();
  updateTotals();
};

function addItem() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="desc"></td>
    <td><input type="number" class="qty" value="1"></td>
    <td><input type="number" class="price" value="0"></td>
    <td class="item-total">0.00</td>
  `;
  document.getElementById("itemsBody").appendChild(row);
}

document.addEventListener("input", updateTotals);

function updateTotals() {
  let total = 0;
  document.querySelectorAll("#itemsBody tr").forEach(row => {
    const qty = parseFloat(row.querySelector(".qty").value) || 0;
    const price = parseFloat(row.querySelector(".price").value) || 0;
    const rowTotal = qty * price;
    row.querySelector(".item-total").innerText = rowTotal.toFixed(2);
    total += rowTotal;
  });
  document.getElementById("invoiceTotal").innerText = total.toFixed(2);
}

function generatePDF() {
  window.print(); // For simple PDF generation via browser print dialog
}
