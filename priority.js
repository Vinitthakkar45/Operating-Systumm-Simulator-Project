const processForm = document.getElementById("process-form");
const processTable = document.getElementById("process-table");
const ganttChart = document.getElementById("gantt-chart");
const avgTurnaroundTimeEl = document.getElementById("avg-turnaround-time");
const avgWaitingTimeEl = document.getElementById  ("avg-waiting-time");
let processes = [];
let processExeBlocks = [];
let avgTurnaroundTime = 0;
let avgWaitingTime = 0;

function calculateProcesses() {
  processExeBlocks = [];

  if (processes.length === 0) return;

  // deep copy of processes
  let tempProcesses = processes.map((process) => ({ ...process }));
  let currentTime = processes.sort((a, b) => a.arrivalTime - b.arrivalTime)[0]
    .arrivalTime;

  while (tempProcesses.length > 0) {
    const highestPriorityProcessesObj = {};
    const highestPriorityProcesses = [];

    for (let i = 0; i < tempProcesses.length; i++) {
      if (
        highestPriorityProcessesObj[tempProcesses[i].arrivalTime] === undefined
      ) {
        highestPriorityProcessesObj[tempProcesses[i].arrivalTime] = [];
      }

      highestPriorityProcessesObj[tempProcesses[i].arrivalTime].push(
        tempProcesses[i]
      );
    }

    Object.keys(highestPriorityProcessesObj)
      .sort((a, b) => a - b)
      .forEach((key) =>
        highestPriorityProcesses.push(
          ...highestPriorityProcessesObj[key].sort(
            (a, b) => a.priority - b.priority
          )
        )
      );

    const p = highestPriorityProcesses
      .filter((process) => process.arrivalTime <= currentTime)
      .sort((a, b) => a.priority - b.priority)[0];

    const tempCurrentTime = currentTime + p.burstTime;

    const processWithHighestPriority = highestPriorityProcesses.find(
      (process) =>
        process.arrivalTime < tempCurrentTime && process.priority < p.priority
    );

    if (processWithHighestPriority) {
      processExeBlocks.push({
        process: p,
        start: currentTime,
        end: processWithHighestPriority.arrivalTime,
      });
      currentTime = processWithHighestPriority.arrivalTime;

      tempProcesses.forEach((process, index) => {
        if (process.name === p.name) {
          tempProcesses[index].burstTime = tempCurrentTime - currentTime;
        }
      });

      continue;
    }

    processExeBlocks.push({
      process: p,
      start: currentTime,
      end: tempCurrentTime,
    });
    currentTime = tempCurrentTime;
    tempProcesses = tempProcesses.filter((process) => process.name !== p.name);
  }

  processes.forEach((process) => {
    const processBlocks = processExeBlocks.filter(
      (block) => block.process.name === process.name
    );

    const processBlock = processBlocks[processBlocks.length - 1];

    process.finishTime = processBlock.end;
    process.turnaroundTime = process.finishTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
  });

  avgTurnaroundTime = processes.reduce(
    (acc, process) => acc + process.turnaroundTime,
    0
  );
  avgWaitingTime = processes.reduce(
    (acc, process) => acc + process.waitingTime,
    0
  );
}

processForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const processName = document.getElementById("process-name").value;
  const burstTime = parseInt(document.getElementById("burst-time").value);
  const arrivalTime = parseInt(document.getElementById("arrival-time").value);
  const priority = parseInt(document.getElementById("priority").value);

  processes.push({
    name: processName,
    burstTime,
    arrivalTime,
    priority,
  });

  document.getElementById("process-name").value = "";
  document.getElementById("burst-time").value = "";
  document.getElementById("arrival-time").value = "";
  document.getElementById("priority").value = "";

  calculateProcesses();
  renderProcessTable();
  renderGanttChart();
});

function renderProcessTable() {
  processTable.innerHTML = `
          <thead>
              <tr>
              <th>Process Name</th>
              <th>Burst Time</th>
              <th>Arrival Time</th>
              <th>Priority</th>
              <th>Finish Time</th>
              <th>Turnaround Time</th>
              <th>Waiting Time</th>
              </tr>
          </thead>
          <tbody>
              ${processes
                .map(
                  (process) => `
              <tr>
                  <td>${process.name}</td>
                  <td>${process.burstTime}</td>
                  <td>${process.arrivalTime}</td>
                  <td>${process.priority}</td>
                  <td>${process.finishTime ?? ""}</td>
                  <td>${process.turnaroundTime ?? ""}</td>
                  <td>${process.waitingTime ?? ""}</td>
              </tr>
              `
                )
                .join("")}
          </tbody>
          `;

  avgTurnaroundTimeEl.innerHTML = `Average Turnaround Time: ${
    avgTurnaroundTime / processes.length
  } ms`;
  avgWaitingTimeEl.innerHTML = `Average Waiting Time: ${
    avgWaitingTime / processes.length
  } ms`;
}

function renderGanttChart() {
  const totalExecutionTime =
    processExeBlocks[processExeBlocks.length - 1].end -
    processExeBlocks[0].start;

  ganttChart.innerHTML = `
            ${processExeBlocks
              .map((block, index) => {
                const blockExecutionTime = block.end - block.start;

                return `
            <div class="gantt-block" style="flex: ${
              blockExecutionTime / totalExecutionTime
            }">
                <div class="gantt-block-inner">${block.process.name}</div>
                <div class="${
                  index === 0 ? "gantt-block-time-first" : "gantt-block-time"
                }" >
                ${index === 0 ? `<p>${block.start}</p>` : ""}
                <p>${block.end}</p>
                </div>
            </div>
            `;
              })
              .join("")}
        `;

  console.log(ganttChart.innerHTML);
}
