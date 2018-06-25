
export function RequestMarkets (__base, __quote) {

  let __requested_markets = []

  for (let i = 0; i < __quote.length; i++) {

    __requested_markets.push({
      id: __base + '-' + __quote[i],
      name: __base + '-' + __quote[i],
      symbol: __quote[i] + '/' + __base,
    })

  }

  return __requested_markets

}