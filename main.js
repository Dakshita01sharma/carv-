document.addEventListener('DOMContentLoaded', () => {
    getPendingList();
  });
  
  async function getPendingList() {
    try {
      const baseUrl = "https://swifttest.maruti.co.in/CARVAPI";
      const response = await fetch(`${baseUrl}/api/Carv/GetAllPendingCarv/178560`);
      const data = await response.json();
  
      const tableBody = document.querySelector('#dgTable tbody');
      if (!tableBody) {
        throw new Error('Table body element not found');
      }
  
      tableBody.innerHTML = ''; // Clear existing rows
  
      data.forEach(item => {
        const row = document.createElement('tr');
        const c1 = createCell(item.CARV_REQUEST_ID);
        const c2 = createCell(item.Department);
        const c3 = createCell(item.NATURE_CHANGE_NAME);
        const c4 = createCell(item.Change_Affect);
  
        if (item.Carv_Is_Urgent === "YES") {
          c1.firstChild.classList.add("bg-red-600", "text-white", "p-1", "rounded", "shadow");
        } else {
          c1.firstChild.classList.add("bg-orange-500", "text-white", "p-1", "rounded", "shadow");
        }
  
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  function createCell(text) {
    const cell = document.createElement('td');
    cell.classList.add("border", "border-indigo-800", "p-3");
    const span = document.createElement('span');
    span.classList.add("rounded", "font-semibold", "p-2", "sm:p-2", "sm:text-sm", "justify-center", "text-center");
    span.innerHTML = `<a href="DetailScreen.html?userId=178560&carvNumber=${text}">${text}</a>`;
    cell.appendChild(span);
    return cell;
  }
  
  document.getElementById('departmentFilter').addEventListener('change', filterTable);
  
  function filterTable() {
    const value = document.getElementById('departmentFilter').value;
    const rows = document.querySelectorAll('#dgTable tbody tr');
  
    rows.forEach(row => {
      const cell = row.querySelector('td:nth-child(2)');
      row.style.display = cell && (cell.textContent === value || value === '') ? '' : 'none';
    });
  }
  