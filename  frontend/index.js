init();

function init() {
  const btnParse = document.getElementById("btn-parse");
  const btnShow = document.getElementById("btn-show");
  btnParse.addEventListener("click", parse);
  btnShow.addEventListener("click", show);
}

async function parse() {
  try {
    document.getElementById("btn-parse").disabled = true;
    await fetch("http://localhost:8081/loaddata");
    alert("Data loaded into database");
    document.getElementById("btn-parse").disabled = false;
  } catch (error) {
    document.getElementById("btn-parse").disabled = false;
  }
}

async function show() {
  let response = await fetch("http://localhost:8081/showdata");
  if (response.ok) {
    let answer = await response.json();
    clearList("allAnswers");
    makeRow();
    answer.forEach(function (item) {
      makeTable(item._id, item.value);
    });
  } else {
    alert("Error HTTP: " + response.status);
  }
}

function makeRow() {
  const makeEl = document.createElement("tr");
  allAnswers.append(makeEl);
  makeEl.insertAdjacentHTML(
    "afterbegin",
    `<th scope="col">Name</th> <th scope="col">Value</th>`
  );
}

function makeTable(id, value) {
  const makeEl = document.createElement("tr");
  allAnswers.append(makeEl);
  makeEl.insertAdjacentHTML("afterbegin", `<td> ${id}</td> <td>${value}</td>`);
}
function clearList(elId) {
  let list = document.getElementById(elId);
  list.innerHTML = "";
}
