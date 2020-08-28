import axios from 'axios'

const $getJson = function (method) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: method,
            dataType: "json",
            crossDomain: true,
            cache: false
        }).then(res => {
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    })
}

export const getH5StaticJson = data => {
    return $getJson('../static/bigData/geoinfo-all.json', data)
}