console.log('hello world')

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

async function getData() {
    const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist', {
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

async function setTop3CardImgs(){
    const top3 = await getTop3MarketCap()
    for (let i = 0; i < top3.Data.length; i++) {
        const imgUrl = await getImgUrl(top3.Data[i].CoinInfo.Name)
        let cardTitle = document.querySelector(`#card-title-${i + 1}`)
        cardTitle.insertAdjacentText('beforeend', `${top3.Data[i].CoinInfo.FullName} (${top3.Data[i].CoinInfo.Name})`)
        let cardImg = document.querySelector(`#card-img-${i + 1}`)
        cardImg.src = imgUrl
        cardImg.alt = top3.Data[i].CoinInfo.Name
        console.log(cardImg)
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
        top3.Data[i].DISPLAY.USD.CHANGEPCT24HOUR
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

setTop3CardImgs()

// const mcaps = document.querySelectorAll('.mcap')
// mcaps.forEach(i => i.insertAdjacentText('beforeend', '1'))

// let number = 987654321987;

// let formatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     notation: 'compact',
//     compactDisplay: 'short',
//     minimumFractionDigits: 2,
// });

// let formattedNumber = formatter.format(number);

// console.log(formattedNumber);