const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

client.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

  function indexExists(indexName) {
    return client.indices.exists({
        index: indexName
    });
  }

  function createIndex(indexName){
    client.indices.create({
        index: indexName
    }, function(err, resp, status) {
        if (err) {
            console.log(err);
        } else {
            console.log("create", resp);
        }
    });
  }

  function bulk(indexName, files) {
    for(let i=0; i<files.length; i+=2) {
        files.splice(i, 0, {index:{_index: indexName, _type:'posts'}});
    }
    console.log(files);
      client.bulk({
          body: files
        }, function(err, res) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
        })
  }

  function searchAll(indexName) {
      return client.search({
          index: indexName,
          body: {
              query: {
                  bool: {
                      should: {
                          match_all: {}
                      }
                  }
              }
          }
      })
  } 

  function masterSearch(indexName, message){
      return client.search({
          index:indexName,
         // type: 'posts',
          body: {
            query: {
                query_string: { // multi_match: { // master search
                    query: message,
                   // query: 'City Montessori School',
                    fields: ['*.*'], // against all fields
                    // type: 'phrase' // for exact match of phrase 
                }
                // bool:{
                //     should:[
                //     {
                //         match: {
                //             'data.data.achievements': 'googLE'
                //         }   
                //     },
                //     {
                //         match_phrase:{
                //             'data.data.education':'City Montessori School'
                //         }
                //     }
                //     ],
                // }
            }
            }
      })
    //   .then(function(resp){
    //       console.log(resp);
    //       console.log(resp.hits.hits);
    //   },function(err){
    //       console.log(err);
    //   })
  }

  function searchByKeyword(indexName, message){
    return client.search({
        index:indexName,
       // type: 'posts',
    body:{
        query:{
            bool:{
                should:[
                    { match: { 'data.data.skills': message.skills.join(" ") } },
                    { match: { 'data.data.education': message.education.join(" ") } },
                    { match: { 'data.data.achievement': message.achievement.join(" ")} },
                    { match: { 'data.data.experience': message.experience.join(" ")} },
                    { match: { 'data.data.certification': message.certification.join(" ")} },
                    { match: { 'data.data.projects': message.projects.join(" ")}}
                ]

            }
        }
    }
        // body: {
        //   query: {
        //       query_string: { // multi_match: { // master search
        //           query: message,
        //          // query: 'City Montessori School',
        //           fields: ['*.*'], // against all fields
        //           // type: 'phrase' // for exact match of phrase 
        //       }
        //       // bool:{
        //       //     should:[
        //       //     {
        //       //         match: {
        //       //             'data.data.achievements': 'googLE'
        //       //         }   
        //       //     },
        //       //     {
        //       //         match_phrase:{
        //       //             'data.data.education':'City Montessori School'
        //       //         }
        //       //     }
        //       //     ],
        //       // }
        //   }
        //   }
    })
}

function searchByPhrase(indexName,message){
    return client.search({
        index:indexName,
       // type: 'posts',
    body:{
        query:{
            bool:{
                should: [
                    {
                    query_string : {
                        "fields":["data.data.skills"],
                        "query" : `"${message.skills.join('" OR "')}"`,
                    },
                    
                },
                {
                    query_string : {
                        "fields":["data.data.certification"],
                        "query" : `"${message.certification.join('" OR "')}"`
                   
                        }
                },
                {
                    query_string : {
                        "fields":["data.data.education"],
                        "query" : `"${message.education.join('" OR "')}"`
                    },
                },
                {
                    query_string : {
                        "fields":["data.data.achievements"],
                        "query" : `"${message.skills.join('" OR "')}"`
                    },
                },
                {
                    query_string : {
                        "fields":["data.data.experience"],
                        "query" : `"${message.experience.join('" OR "')}"`
                    },
                },
                {
                    query_string : {
                        "fields":["data.data.projects"],
                        "query" : `"${message.projects.join('" OR "')}"`
                    }
                }
            ]

            }
        }
        
    }
})
}




  function deleteindex(indexName){
      client.indices.delete({
  index:'_all'
},function(err,resp){
  if(err){
    console.log(err);
  }else{
    console.log("deleted");
    console.log(resp);
  }
})
  }


  module.exports = {
    indexExists: indexExists,
    createIndex: createIndex,
    bulk: bulk,
    masterSearch: masterSearch,
    searchAll: searchAll,
    searchByKeyword: searchByKeyword,
    searchByPhrase:searchByPhrase,
    deleteindex:deleteindex

}