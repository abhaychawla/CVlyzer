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

function bulkUpdate(indexName, applicants, status) {
    for(let i = 0; i<applicants.length; i+=2) {
        applicants.splice(i, 0, { update: { _index: indexName, _type: 'resume', _id: applicants[i].id } });
        applicants[i+1] = { 
            script: {
                source: 'ctx._source.data.data.status = params.status',
                params: {
                    status: status
                }
            }
        };
    }
    return client.bulk({
        body: applicants
    });
}

function searchAll(indexName) {
    return client.search({
        from: 0,
        size: 20,
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

function deleteById(indexName, id) {
    return client.delete({
        index: indexName,
        type: 'resume',
        id: id
    });
}

function masterSearch(indexName, query) {
    return client.search({
        index: indexName,
        body: {
            query: {
                query_string: {
                    query: query,
                    all_fields: true
                }
            }
        }
    });
}

function searchByPhrase(indexName,query) {
    return client.search({
        index:indexName,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            query_string : {
                                fields: ['data.data.skills'],
                                query: `"${query.skills}"`,
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.certification'],
                                'query': `"${query.certification}"`
                            }
                        },
                        {
                            query_string : {
                                'fields': ['data.data.education'],
                                'query': `"${query.education}"`
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.experience'],
                                'query': `"${query.experience}"`
                            },
                        },
                        {
                            query_string : {
                                'fields': ['data.data.projects'],
                                'query': `"${query.projects}"`
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
    bulkUpdate: bulkUpdate,
    searchAll: searchAll,
    findById: findById,
    deleteById: deleteById,
    masterSearch: masterSearch,
    searchByPhrase: searchByPhrase
};