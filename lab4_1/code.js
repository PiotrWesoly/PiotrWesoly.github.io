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

let db;
let request = window.indexedDB.open("newDatabase121", 1);

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
objectstore.createIndex("email", "email", { unique: false });
objectstore.createIndex("ID", "ID", { unique: false });
objectstore.createIndex("postal", "postal", { unique: false });
objectstore.createIndex("phoneNumber", "phoneNumber", { unique: false });

for (var i in clientData) {
    objectstore.add(clientData[i]);
}
};

const clientData = [
    {
      name: "Piotr",
      lastName: "Wesoly",
      email: "PiotrWesoly@gmail.com",
      postal: "90-234",
      ID: 'CCU238293',
      phoneNumber: "+48500500200"
    },
    {
      name: "Pawel",
      lastName: "Rosiak",
      email: "pawelRosiak@gmail.com",
      postal: "93-234",
      ID: 'CCU233293',
      phoneNumber: "+48500400200"
    },
  ];

  function fillOutRandom() {
    document.getElementById("idInput").value = 8;
    document.getElementById("fname").value = "Pawel";
    document.getElementById("flast").value = "Mark";
    document.getElementById("fmail").value = "piotsdr@gmasdil.com";
    document.getElementById("postal").value = "93-211";
    document.getElementById("ID").value = "DBZ843420";
    document.getElementById("phoneNumber").value = '+48798233493';
}

function add(event) {
    event.preventDefault();

    var formElements = document.getElementById("addForm");

    var request = db
      .transaction(["client"], 'readwrite')
      .objectStore("client")
      .add({
        name: formElements[1].value,
        lastName: formElements[2].value,
        email: formElements[3].value,
        postal: formElements[4].value,
        ID: formElements[5].value,
        phoneNumber: formElements[6].value,
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

        let editButton = document.createElement("button");
        editButton.setAttribute("id", "editButton" + cursor.key);
        editButton.setAttribute("onclick", `fillEditData(${cursor.key})`);
        editButton.innerHTML = "edit";
        cell.appendChild(editButton);

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
  
  function editData(event) {
    event.preventDefault();
    let formElements = document.getElementById("addForm");
    document.getElementById("cancelBtn").disabled = false;

    console.log(`Editing ${parseInt(formElements[0].value)}`);

    var objectStore = db
      .transaction(["client"], "readwrite")
      .objectStore("client");

    var request = objectStore.get(parseInt(formElements[0].value));
    request.onerror = function (event) {
     
      console.log(
        "Client with that id does not exits!"
      );
    };
    request.onsuccess = function (event) {

      let data = event.target.result;

      let client = {
        name: formElements[1].value,
        lastName: formElements[2].value,
        email: formElements[3].value,
        postal: formElements[4].value,
        ID: formElements[5].value,
        phoneNumber: formElements[6].value,
      };

      console.log(client);

      let requestUpdate = db
        .transaction(["client"], "readwrite")
        .objectStore("client")
        .put(client, parseInt(formElements[0].value));

      requestUpdate.onsuccess = function (event) {
        console.log("Record updated");
        drawTable();
      };

      clearFrom();
      document.getElementById("editBtn").disabled = true;
      document.getElementById("submitBtn").disabled = false;
    };
  }

  function fillEditData(id) {
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("editBtn").disabled = false;
    document.getElementById("cancelBtn").disabled = false;
    document.getElementById("fillBtn").disabled = true;


    var objectStore = db
      .transaction(["client"], "readwrite")
      .objectStore("client");

    var request = objectStore.get(id);
    request.onerror = function (event) {
      console.log("Something went wrong");
    };
    request.onsuccess = function (event) {
    
      let data = event.target.result;

      document.getElementById("idInput").value = id;
      document.getElementById("fname").value = data.name;
      document.getElementById("flast").value = data.lastName;
      document.getElementById("fmail").value = data.email;
      document.getElementById("postal").value = data.postal;
      document.getElementById("ID").value = data.ID;
      document.getElementById("phoneNumber").value = data.phoneNumber;
    };
  }

  function clearFrom(){
    document.getElementById("idInput").value = ""
    document.getElementById("fname").value = ""
    document.getElementById("flast").value = ""
    document.getElementById("fmail").value = ""
    document.getElementById("postal").value = ""
    document.getElementById("ID").value = ""
    document.getElementById("phoneNumber").value = ""
  }

  function cancelEdit(event) {
    event.preventDefault();
    clearFrom();
    document.getElementById("editBtn").disabled = true;
    document.getElementById("cancelBtn").disabled = true;
    document.getElementById("submitBtn").disabled = false;
  }