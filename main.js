console.log('hello world')

// Added info tooltip popover to explain what the data is a bit more.
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

async function getCoinsSummary() {
    const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Apikey ' + cryptoCompareApiKey
        }
    })
    if (response.ok) {
        let data = await response.json()
        return data
    }
}

// getData().then(data => console.log(data))

async function getTop3MarketCap() {
    const response = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?tsym=USD&limit=3', {
        method: "GET",
        headers: { 
            'Content-Type': 'application/json',
            'authorization': 'Apikey ' + cryptoCompareApiKey 
        }
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)        
        return data
    }
}


async function getImgUrl(coin) {
    const response = await fetch(`https://data-api.cryptocompare.com/asset/v1/data/by/symbol?asset_symbol=${coin}`, {
        method: "GET",
        headers: { 
            'Content-Type': 'application/json',
            'authorization': 'Apikey ' + cryptoCompareApiKey 
        }
    })
    if (response.ok) {
        const data = await response.json()
        return data.Data.LOGO_URL
    }
}

async function setTop3Cards(){
    const top3 = await getTop3MarketCap()
    for (let i = 0; i < top3.Data.length; i++) {
        const imgUrl = await getImgUrl(top3.Data[i].CoinInfo.Name)
        let cardTitle = document.querySelector(`#card-title-${i + 1}`)
        cardTitle.insertAdjacentText('beforeend', `${top3.Data[i].CoinInfo.FullName} (${top3.Data[i].CoinInfo.Name})`)
        let cardImg = document.querySelector(`#card-img-${i + 1}`)
        cardImg.src = imgUrl
        cardImg.alt = top3.Data[i].CoinInfo.Name
        // console.log(cardImg)
    };
    const mcaps = document.querySelectorAll('.mcaps')
    for (let i = 0; i < mcaps.length; i++) {
        mcaps[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.MKTCAP}`)
        mcaps[i].style.color = 'yellow'
    };
    const prices = document.querySelectorAll('.prices')
    for (let i = 0; i < prices.length; i++) {
        prices[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.PRICE}`)
        prices[i].style.color = 'greenyellow'
    };
    const priceChanges = document.querySelectorAll('.price-change-pct')
    for (let i = 0; i < prices.length; i++) {
        priceChanges[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.CHANGEPCT24HOUR}`)
        if (top3.Data[i].DISPLAY.USD.CHANGEPCT24HOUR < 0) {
            priceChanges[i].style.color = 'red'
        } else {
            priceChanges[i].style.color = 'rgb(85, 255, 45)'
        }
    };
    const vols24hr = document.querySelectorAll('.vols24hr')
    for (let i = 0; i < vols24hr.length; i++) {
        vols24hr[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.TOTALVOLUME24H}`)
        vols24hr[i].style.color = 'yellowgreen'
    };
    const currSupply = document.querySelectorAll('.supplies')
    for (let i = 0; i < currSupply.length; i++) {
        currSupply[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.CIRCULATINGSUPPLY}`)
        currSupply[i].style.color = 'yellowgreen'
    };
    const updateTime = document.querySelectorAll('.update-time')
    for (let i = 0; i < updateTime.length; i++) {
        updateTime[i].insertAdjacentText('beforeend', `${top3.Data[i].DISPLAY.USD.LASTUPDATE}`)
        updateTime[i].style.color = 'white'
    }
    
};

setTop3Cards()


// Commented out, but saved for later use, in case I want to add the datalist functionality to the search field

// async function setDatalistItems() {
//     const data = await getCoinsSummary()
//     const datalist = document.querySelector('#cryptoDatalist')
//     for (let i = 0; i < data.Data.length; i++) {
//         let option = document.createElement('option')
//         option.value = Object.entries(data.Data[i][1].FullName)
//         datalist.appendChild(option)
//     }
   
// }
// setDatalistItems()

function addRow(resRowNum) {
    console.log(`before adding row, the param passed in is 'resTable.rows.length', which is: ${resRowNum}`)
    const resTable = document.querySelector(`#res-table`)
	const resRow = document.querySelector(`#res-row`)
	const newRow = resRow.cloneNode(true)
	newRow.id = `res-row-${resRowNum}`
	resTable.appendChild(newRow)
    
    const coinName = document.querySelector(`#coin`)
    const price = document.querySelector(`#price`)
    const hiLo24hr = document.querySelector(`#hi-lo-24hr`)
    const pctChg24hr = document.querySelector(`#chg-pct-24`)
    const supply = document.querySelector(`#c-supply`)
    coinName.id += `-${resRowNum}`
    price.id += `-${resRowNum}`
    hiLo24hr.id += `-${resRowNum}`
    pctChg24hr.id += `-${resRowNum}`
    supply.id += `-${resRowNum}`
}

const resTable = document.querySelector(`#res-table`)
console.log(resTable.rows.length)

async function getCoinData(coin) {
    coin.preventDefault()
    const inputData = document.querySelector('#searchCurrency').value
    const saveCheckbox = document.querySelector('#checkbox').value
    const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${inputData}&tsyms=USD`, {
        method: "GET",
        headers: { 
            'Content-Type': 'application/json',
            'authorization': 'Apikey ' + cryptoCompareApiKey 
        }
    })
    
    
    if (response.ok) {
        console.log(`before addrow function: the row length is ${resTable.rows.length}`)
        addRow(resTable.rows.length)
        const data = await response.json()
        console.log(`after the addrow func, including the new row, we have: ${resTable.rows.length} rows`)
        const coinName = document.querySelector(`#coin-${resTable.rows.length-1}`)
        const price = document.querySelector(`#price-${resTable.rows.length-1}`)
        const hiLo24hr = document.querySelector(`#hi-lo-24hr-${resTable.rows.length-1}`)
        const pctChg24hr = document.querySelector(`#chg-pct-24-${resTable.rows.length-1}`)
        const supply = document.querySelector(`#c-supply-${resTable.rows.length-1}`)
        
    
        console.log(data)
        console.log(inputData)
        console.log(`table len after addrow function, which added a new row with empty content: ${resTable.rows.length}`)

        coinName.insertAdjacentText('beforeend', `${inputData.toUpperCase()}`)
        price.insertAdjacentText('beforeend', `${await data.DISPLAY[`${inputData.toUpperCase()}`].USD.PRICE}`)
        hiLo24hr.insertAdjacentText('beforeend', `${await data.DISPLAY[`${inputData.toUpperCase()}`].USD.HIGH24HOUR} / ${await data.DISPLAY[`${inputData.toUpperCase()}`].USD.LOW24HOUR}`)
        pctChg24hr.insertAdjacentText('beforeend', `${await data.DISPLAY[`${inputData.toUpperCase()}`].USD.CHANGEPCT24HOUR}`)
        supply.insertAdjacentText('beforeend', `${await data.DISPLAY[`${inputData.toUpperCase()}`].USD.CIRCULATINGSUPPLY}`)
        
    } 
}



let form = document.querySelector('form')
form.addEventListener('submit', getCoinData)

// getCoinData('BTC')