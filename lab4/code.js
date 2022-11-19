let db;
const request = window.indexedDB.open("MyDatabase", 3);

request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};

request.onsuccess = (event) => {
  db = event.target.result;
};

db.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error(`Database error: ${event.target.errorCode}`);
  };

request.onupgradeneeded = function (event) {
var db = event.target.result;
var objectStore = db.createObjectStore("client", {
    autoIncrement: true,
});

objectStore.createIndex("name", "name", { unique: false });
objectStore.createIndex("lastName", "lastName", { unique: false });
objectStore.createIndex("email", "email", { unique: true });
objectStore.createIndex("ID", "ID", { unique: true });
objectStore.createIndex("postal", "postal", { unique: false });
objectStore.createIndex("phoneNumber", "phoneNumber", { unique: true });

for (var i in clientData) {
    objectStore.add(clientData[i]);
}
};

const clientData = [
    {
      name: "Piotr",
      lastName: "Wesoly",
      email: "PiotrWesoly@gmail.com",
      ID: 'CCU238293',
      addres: "Kilinskiego 12",
      phoneNumber: "500500200"
    },
    {
      name: "Pawel",
      lastName: "Rosiak",
      email: "pawelRosiak@gmail.com",
      ID: 'CCU238293',
      address: "Piotrkowska 12",
      phoneNumber: "500400200"
    },
  ];