window.indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;

      //prefixes of window.IDB objects
      window.IDBTransaction =
        window.IDBTransaction ||
        window.webkitIDBTransaction ||
        window.msIDBTransaction;
      window.IDBKeyRange =
        window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

      if (!window.indexedDB) {
        window.alert(
          "Your browser doesn't support a stable version of IndexedDB."
        );
      }

// var req = indexedDB.deleteDatabase("newDatabase");
// req.onsuccess = function () {
//     console.log("Deleted database successfully");
// };
// req.onerror = function () {
//     console.log("Couldn't delete database");
// };
// req.onblocked = function () {
//     console.log("Couldn't delete database due to the operation being blocked");
// };

let db;
let request = window.indexedDB.open("newDatabase222", 2);

request.onerror = function (event) {
console.log("error: The database is opened failed");
};

request.onsuccess = function (event) {
db = request.result;
console.log("success: The database " + db + " is opened successfully");
drawTable();
};

request.onupgradeneeded = function (event) {
var db = event.target.result;
console.log("Object Store creation");
var objectstore = db.createObjectStore("client", {
    autoIncrement: true,
});

objectstore.createIndex("name", "name", { unique: false });
objectstore.createIndex("lastName", "lastName", { unique: false });
objectstore.createIndex("email", "email", { unique: true });
objectstore.createIndex("ID", "ID", { unique: true });
objectstore.createIndex("postal", "postal", { unique: false });
objectstore.createIndex("phoneNumber", "phoneNumber", { unique: true });

for (var i in clientData) {
    objectstore.add(clientData[i]);
}
};

const clientData = [
    {
      name: "Piotr",
      lastName: "Wesoly",
      email: "PiotrWesoly@gmail.com",
      ID: 'CCU238293',
      postal: "90-234",
      phoneNumber: "500500200"
    },
    {
      name: "Pawel",
      lastName: "Rosiak",
      email: "pawelRosiak@gmail.com",
      ID: 'CCU238293',
      postal: "93-234",
      phoneNumber: "500400200"
    },
  ];

  function fillOutRandom() {
    document.getElementById("fname").value = "Pawel";
    document.getElementById("flast").value = "Mark";
    document.getElementById("fmail").value = "piotsdr@gmasdil.com";
    document.getElementById("postal").value = "93-211";
    document.getElementById("ID").value = "DBZ843420";
    document.getElementById("phoneNumber").value = '+48798233493';
}

function add(event) {
    event.preventDefault();

    var formElements = document.getElementById("form");

    var request = db
      .transaction(["client"], 'readwrite')
      .objectStore("client")
      .add({
        name: formElements[0].value,
        lastName: formElements[1].value,
        email: formElements[2].value,
        postal: formElements[3].value,
        ID: formElements[4].value,
        phoneNumber: formElements[5].value,
      });

    request.onsuccess = function (event) {
      console.log("Client added");
      drawTable();
    };

    request.onerror = function (event) {
      alert(
        "Unable to add data\r\ user with that email aready exist in your database! "
      );
    };
  }

  function drawTable(filterItems) {
    if (document.getElementById("tbody") !== null) {
      document.querySelector("#tbody").remove();
    }

    let table = document.createElement("table");
    table.setAttribute("id", "tbody");
    let data = Object.keys(clientData[0]);
    generateTable(table, filterItems);
    generateTableHead(table, data);
    document.getElementById("tableDiv").appendChild(table);
  }

  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();

    // Create id column
    let th = document.createElement("th");
    let text = document.createTextNode("id");
    th.appendChild(text);
    row.appendChild(th);

    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  function generateTable(table, filterItems = []) {
    let objectstore = db.transaction("client").objectStore("client");

    objectstore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        console.log(filterItems);
        if (filterItems.length > 0 && filterItems[0] !== "") {
          let exists = false;
          for (let i = 0; i < filterItems.length; i++) {
            const element = filterItems[i];
            
            if (Object.values(cursor.value).includes(element)) {
              exists = true
            }
          }

          if (!exists) {
            cursor.continue();
            return;
          }
        }

        console.log(cursor.value)

        let row = table.insertRow();
        let cell = row.insertCell();
        let text = document.createTextNode(cursor.key);
        cell.appendChild(text);
        for (const [key, value] of Object.entries(cursor.value)) {
          let cell = row.insertCell();
          let text = document.createTextNode(value);
          cell.appendChild(text);
        }

        cell = row.insertCell();
        let removeButton = document.createElement("button");
        removeButton.setAttribute("id", "removeButton" + cursor.key);
        removeButton.setAttribute("onclick", `remove(${cursor.key})`);
        removeButton.innerHTML = "remove";
        cell.appendChild(removeButton);
        cursor.continue();

      } else {
        console.log("No more data");
      }
    };
  }

  function remove(id) {
    let request = db
      .transaction(["client"], "readwrite")
      .objectStore("client")
      .delete(id);

    request.onsuccess = function (event) {
      console.log(`Client ${id} removed...`);
      drawTable();
    };
  }
  