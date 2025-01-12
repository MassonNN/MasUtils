// from ColeWeight
export function sellBazarPrice(product)
{
    return new Promise((resolve, reject) => {
        request("https://api.hypixel.net/skyblock/bazaar")
        .then(res => {
            if(res.data.products[product] != undefined)
                resolve(res.data.products[product].sell_summary[0].pricePerUnit)
            else
                resolve(0)
        })
        .catch(err => {
            reject(err)
        })
    })
}