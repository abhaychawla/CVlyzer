// Elastic Search
const elasticsearch = require('elasticsearch');

// Initialize Client
const client = new elasticsearch.Client({ host: 'localhost:9200' });

client.ping({
    requestTimeout: 30000,
},  function (error) {
    if (error) {
        console.error('Elastic Search Cluster is down!');
    } else {
        console.log('Elastic Search Cluster is up!');
    }
});

function indexExists(indexName) {
    return client.indices.exists({
        index: indexName
    });
}

function createIndex(indexName) {
    return client.indices.create({
        index: indexName
    });
}

function bulkUpload(indexName, files) {
    for(let i = 0; i<files.length; i+=2) {
        files.splice(i, 0, { index: { _index: indexName, _type: 'resume' } });
    }
    return client.bulk({
        body: files
    });
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
    });
} 

function findById(indexName, id) {
    return client.get({
        index: indexName,
        type: 'resume',
        id: id
    });
}

function masterSearch(indexName, query){
    return client.search({
        index: indexName,
        body: {
            query: {
                query_string: {
                    query: query,
                    fields: ['*.*']
                }
            }
        }
    });
}

function searchByKeyword(indexName, query){
    return client.search({
        index: indexName,
        body: {
            query: {
                bool: {
                    should: [
                        { match: { 'data.data.skills': query.skills.join(" ") } },
                        { match: { 'data.data.education': query.education.join(" ") } },
                        { match: { 'data.data.achievement': query.achievement.join(" ") } },
                        { match: { 'data.data.experience': query.experience.join(" ") } },
                        { match: { 'data.data.certification': query.certification.join(" ") } },
                        { match: { 'data.data.projects': query.projects.join(" ") } }
                    ]
                }
            }
        }
    });
}

function searchByPhrase(indexName,query){
    return client.search({
        index:indexName,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            query_string : {
                                fields: ['data.data.skills'],
                                query: `"${query.skills.join('" OR "')}"`,
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.certification'],
                                'query': `"${query.certification.join('" OR "')}"`
                            }
                        },
                        {
                            query_string : {
                                'fields': ['data.data.education'],
                                'query': `"${query.education.join('" OR "')}"`
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.achievements'],
                                'query': `"${query.skills.join('" OR "')}"`
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.experience'],
                                'query': `"${query.experience.join('" OR "')}"`
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.projects'],
                                'query': `"${query.projects.join('" OR "')}"`
                            }
                        }
                    ]
                }
            }
        }
    });
}

module.exports = {
    indexExists: indexExists,
    createIndex: createIndex,
    bulkUpload: bulkUpload,
    searchAll: searchAll,
    findById: findById,
    masterSearch: masterSearch,
    searchByKeyword: searchByKeyword,
    searchByPhrase: searchByPhrase
};