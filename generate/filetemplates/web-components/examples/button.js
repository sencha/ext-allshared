exports.angular_app_module = (o) => {


var r =
`
button module hello ${o.name}
`

console.log(r)

return r
}

exports.angular_app_component = (o) => {


    var r =
    `
    button component hello ${o.name}
    `

    console.log(r)

    return r
    }