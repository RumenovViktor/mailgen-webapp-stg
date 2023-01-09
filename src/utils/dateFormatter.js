function formatDate(params){
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(params.value).toLocaleDateString("en-US", options)
}

function formatDateTime(params){
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    return new Date(params.value).toLocaleDateString("en-US", options)
}

export {formatDate, formatDateTime}