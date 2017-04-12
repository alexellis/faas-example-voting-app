"use strict"

var pg = require('pg');
var getStdin = require('get-stdin');

getStdin().then((val) => {
  console.log(val);

  let req = JSON.parse(val);
  handle(req, (err, res) => {
    if(err) {
      return console.error(err);
    }
    console.log("Processed.");

  });
}).catch((e)=>{
  console.error("Handler error: ", e.stack);
});

let handle = (args, callback) => {
  
  console.log("Processing vote for", args.vote, "by", args.voter_id);

  var client = new pg.Client('postgres://postgres@db/postgres');
  client.connect((err) => {
    if(err) {
      return callback(err);
    }

    client.query("CREATE TABLE IF NOT EXISTS votes (id VARCHAR(255) NOT NULL UNIQUE, vote VARCHAR(255) NOT NULL)", (err, res) => {
      if(err) {
        client.end();
        return callback(err);
      }

      client.query("INSERT INTO votes (id, vote) VALUES ($1, $2)", [args.voter_id, args.vote], (err) => {
        let duplicate = err && err.message && err.message.indexOf("duplicate key") > -1;
        if(!duplicate && err) {
          client.end();
          return callback(err);
        }

        client.query("UPDATE votes SET vote = $1 WHERE id = $2", [args.vote, args.voter_id], (err) => {
          client.end();
          return callback(err);
        });

      });

    });

  });
};

//   client.query("CREATE TABLE IF NOT EXISTS votes (id VARCHAR(255) NOT NULL UNIQUE, vote VARCHAR(255) NOT NULL)")
//     .then(() => {
//       client.query("INSERT INTO votes (id, vote) VALUES ($1, $2)", [args.voter_id, args.vote])
//       .then(()=> {
//         callback();
//       })
//     })
//     .catch(err => {
//       // Only catch duplicate key errors
//       if (err.message.indexOf("duplicate key") === -1) {
//         return callback(err);
//       }

//       client.query("UPDATE votes SET vote = $1 WHERE id = $2", [args.vote, args.voter_id]).then(()=>{
//         return callback(null);
//       }).catch(err=> {
//         callback(err);
//       });
//     });
// };
