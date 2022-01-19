let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   
  const db = event.target.result;

  db.createObjectStore("new_budget", { autoIncrement: true });

};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadBudget();
  };
};

request.onerror = function(event) {
  console.log("Whoops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_budget"], "readwrite");
  const budgetStore = transaction.objectStore("new_budget");

  budgetStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["new_budget"], "readwrite");
  const budgetStore = transaction.objectStore("new_budget");
  const getAll = budgetStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
              .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
        
        const transaction = db.transaction(["new_budget"], "readwrite");

        
        const budgetStore = transaction.objectStore("new_budget");

        budgetStore.clear();

        alert('All offline transactions have been saved!');
      })
      .catch(err => {
        console.log(err);
      });
    };
  };
};


window.addEventListener("online", uploadBudget);