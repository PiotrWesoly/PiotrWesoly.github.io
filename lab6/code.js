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
var idGlobal;
var searchBar = document.getElementById("searchBar");

request.onerror = function (event) {
console.log("error: The database is opened failed");
};

request.onsuccess = function (event) {
db = request.result;
console.log("success: The database " + db + " is opened successfully");

document.getElementById("searchBar")
.addEventListener("input", (event) => {
  drawTable(event.target.value.split(" "));
});

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
    
    const randomName = Math.floor(Math.random() * 5);
    const randomLastName = Math.floor(Math.random() * 5);
    const randomMail = Math.floor(Math.random() * 5);
    const randomPostal = Math.floor(Math.random() * 5);
    const randomID = Math.floor(Math.random() * 5);
    const randomPhone = Math.floor(Math.random() * 5);

    let names = ["Marek", "Piotr", "Maciek", "Lukasz", "Pawel"];
    let lastNames = ["Wojciechowski", "Marciniak", "Kwiatkowski", "Malkowski", "Wesoly"];
    let mails = ["Pies@gmail.com", "Kot@gmail.com", "Dragon@gmail.com", "Prog@gmail.com" ,"Luke@gmail.com"]
    let postal = ["93-111", "91-211", "23-211", "93-211", "33-211"]
    let ID = ["DBZ843420", "DAA843320", "GSZ843420", "ABC843520", "LDK843520"]
    let phoneNumbers = ['+48798234593', '+48798234493', '+48798233453', '+48775567493', '+48775633493']


    document.getElementById("fname").value = names[randomName];
    document.getElementById("flast").value = lastNames[randomLastName];
    document.getElementById("fmail").value = mails[randomMail];
    document.getElementById("postal").value = postal[randomPostal];
    document.getElementById("ID").value = ID[randomID];
    document.getElementById("phoneNumber").value = phoneNumbers[randomPhone];
}

function add(event) {
    event.preventDefault();

    var formElements = document.getElementById("addForm");

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
      alert(
        "Client added !"
      );
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

    // // Create id column
    // let th = document.createElement("th");
    // let text = document.createTextNode("id");
    // th.appendChild(text);
    // row.appendChild(th);

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
        if (filterItems.length > 0 && filterItems[0] !== "") {
          let exists = false;
          for (let i = 0; i < filterItems.length; i++) {
            const element = filterItems[i];

            if (Object.values(cursor.value).includes(element)) {
              exists = true;
            }
          }

          if (!exists) {
            cursor.continue();
            return;
          }
        }


        console.log(cursor.value)

        let row = table.insertRow();
        // let cell = row.insertCell();
        let text = document.createTextNode(cursor.key);
        // cell.appendChild(text);
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

    console.log(`Editing ${parseInt(idGlobal)}`);

    var objectStore = db
      .transaction(["client"], "readwrite")
      .objectStore("client");

    var request = objectStore.get(parseInt(idGlobal));
    request.onerror = function (event) {
     
      console.log(
        "Client with that id does not exits!"
      );
    };
    request.onsuccess = function (event) {

      let data = event.target.result;

      let client = {
        name: formElements[0].value,
        lastName: formElements[1].value,
        email: formElements[2].value,
        postal: formElements[3].value,
        ID: formElements[4].value,
        phoneNumber: formElements[5].value,
      };

      console.log(client);

      let requestUpdate = db
        .transaction(["client"], "readwrite")
        .objectStore("client")
        .put(client, parseInt(idGlobal));

      requestUpdate.onsuccess = function (event) {
        console.log("Record updated");
        drawTable();
      };

      clearFrom();
      document.getElementById("editBtn").disabled = true;
      document.getElementById("submitBtn").disabled = false;
      document.getElementById("fillBtn").disabled = false;
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
      idGlobal = id;

      // document.getElementById("idInput").value = id;
      document.getElementById("fname").value = data.name;
      document.getElementById("flast").value = data.lastName;
      document.getElementById("fmail").value = data.email;
      document.getElementById("postal").value = data.postal;
      document.getElementById("ID").value = data.ID;
      document.getElementById("phoneNumber").value = data.phoneNumber;
    };
  }

  function clearFrom(){
    // document.getElementById("idInput").value = ""
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

  function search(event) {
    event.preventDefault();

    let searchInputs = document
      .getElementById("searchBar")
      .value.split(" ");

    drawTable(searchInputs);
  }

