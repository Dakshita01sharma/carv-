let carvDetails = {}; // Define carvDetails at the top

document.addEventListener('DOMContentLoaded', () => {
  CarvDetails();
});

async function CarvDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const carvNumber = urlParams.get("carvNumber");
    const url = `https://swifttest.maruti.co.in/CARVAPI/api/Carv/GetCarvDetail?userId=${userId}&carvNumber=${carvNumber}`;

    console.log(`Fetching CARV details from: ${url}`); // Debugging statement

    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('CARV details fetched:', data); // Debugging statement
    carvDetails = data; // Assign fetched data to carvDetails
    updateDOM(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

function updateDOM(data) {
  document.getElementById('CARV_REQUEST_ID').innerText = data.CARV_REQUEST_ID;
  document.getElementById('Vendor_Name').innerText = `${data.CARV_INIT_NAME} (${data.CARV_INIT_ID})`;
  document.getElementById('CARV_IS_URGENT').innerText = data.CARV_IS_URGENT;
  document.getElementById('CARV_MODEL').innerText = data.CARV_MODEL;
  document.getElementById('NEW_PARTNAME').innerText = data.NEW_PARTNAME;
  document.getElementById('PART_CLASS').innerText = data.PART_CLASS;
  document.getElementById('Change_Affect').innerText = data.Change_Affect;
  document.getElementById('NATURE_CHANGE_NAME').innerText = data.NATURE_CHANGE_NAME;
  document.getElementById('CHANGE_REASON').innerText = data.CHANGE_REASON;
}

function action(type) {
  actionType = type;
  console.log(`Action type set to: ${type}`); // Debugging statement
  document.getElementById("txtModelTag").innerText = type;
  toggleModal(true);
}

function cancelAction() {
  toggleModal(false);
  document.getElementById("txtComments").value = "";
}

function confirmAction() {
  if (document.getElementById("txtComments").value.trim() === "") {
    alert("Please Fill Comments!");
    return;
  }

  document.getElementById("btnConfirm").setAttribute("disabled", true);
  document.getElementById("loader").style.display = "block";

  const myHeaders = new Headers({ "Content-Type": "application/json" });
  const raw = JSON.stringify({
    "updateDetails": {
      "UserId": "178560",
      "Action": actionType,
      "Remarks": document.getElementById("txtComments").value.trim()
    },
    "carvDetail": carvDetails
  });

  console.log("Request body:", raw); // Debugging statement

  fetch("https://swifttest.maruti.co.in/CARVAPI/api/Carv/UpdateCarvStatus", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  })
    .then(response => {
      console.log("Response status:", response.status); // Debugging statement
      if (response.status == 200) {
        alert("CARV has been processed successfully!");
        window.location.href = window.location.origin + "/index.html";
      } else {
        handleError();
      }
    })
    .catch(error => {
      console.error('Fetch error:', error); // Debugging statement
      handleError();
    });
}

function handleError() {
  document.getElementById("btnConfirm").removeAttribute("disabled");
  document.getElementById("loader").style.display = "none";
  alert("Failed to process, try again!");
}

function toggleModal(show) {
  const modal = document.getElementById("model");
  const mainCont = document.getElementById("mainCont");
  if (show) {
    modal.classList.remove("hidden");
    modal.classList.add("z-50");
    mainCont.classList.add("z-10", "opacity-30");
  } else {
    modal.classList.add("hidden");
    modal.classList.remove("z-50");
    mainCont.classList.remove("z-10", "opacity-30");
  }
}

function exit() {
  window.location.href = window.location.origin + "/index.html";
}

function viewReport() {
  window.location.href = window.location.origin + "/report.html";
}
