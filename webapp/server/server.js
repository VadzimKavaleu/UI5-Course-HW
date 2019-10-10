var http = require('http');

var Datastore = require('nedb');

var Sdb = new Datastore({
    inMemoryOnly: true
});

var ODataServer = require('simple-odata-server');

var Adapter = require('simple-odata-server-nedb');

var db = new Datastore({
    inMemoryOnly: true
});
var model = {
    namespace: "jsreport",
    entityTypes: {
        "PlantType": {
            "_id": {
                "type": "Edm.String",
                key: true
            },
            "name": {
                "type": "Edm.String"
            },
            "description": {
                "type": "Edm.String"
            }
        },
        "FernType": {
            "_id": {
                "type": "Edm.String",
                key: true
            },
            "name": {
                "type": "Edm.String"
            },
            "descriprion": {
                "type": "Edm.String"
            },
            "species": {
                "type": "Edm.String"
            }
        },
        "SpruceType": {
            "_id": {
                "type": "Edm.String",
                key: true
            },
            "name": {
                "type": "Edm.String"
            },
            "descriprion": {
                "type": "Edm.String"
            },
            "age": {
                "type": "Edm.Int32"
            }
        }
    },
    

    entitySets: {
        "plant": {
            entityType: "jsreport.PlantType"
        },
        "fern": {
            entityType: "jsreport.FernType"
        },
        "spruce": {
            entityType: "jsreport.SpruceType"
        },
    }
};

var odataServer = ODataServer("http://localhost:3000").model(model).adapter(Adapter(function (es, cb) {
    cb(null, db);
}));
odataServer.cors('*');
http.createServer(odataServer.handle.bind(odataServer)).listen(3000);

db.insert({'_id':'1', 'name': 'plant', 'description': 'some desc'});