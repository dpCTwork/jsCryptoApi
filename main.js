console.log('hello world')

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
    const coinNames = []
    top3.Data.forEach(i => {
        coinNames.push(i.CoinInfo.Name)
    });
    console.log(coinNames)
    for (let i = 0; i < coinNames.length; i++) {
        const imgUrl = await getImgUrl(coinNames[i])
        let cardTitle = document.querySelector(`#card-title-${i + 1}`)
        cardTitle.insertAdjacentText('beforeend', `${top3.Data[i].CoinInfo.FullName} (${top3.Data[i].CoinInfo.Name})`)
        let cardImg = document.querySelector(`#card-img-${i + 1}`)
        cardImg.src = imgUrl
        cardImg.alt = coinNames[i]
        console.log(cardImg)
    }

}

setTop3CardImgs()

