const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const priceChart = document.querySelector('.price-chart')

let myChart = ''

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const inputValue = event.target[0].value
    const data = await fetch(`http://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)
    const products = (await data.json()).results.slice(0, 10)
    displayItems(products)
    updateChart(products)
})

function displayItems(products) {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString('pt-br', { style: "currency", currency: "BRL" })}</p>
            <p class="product-store">Loja: ${product.seller.nickname}</p>        
        </div>
        `,).join('')
}

function updateChart(products) {
    const ctx = priceChart.getContext('2d')

    if (myChart) {
        myChart.destroy()
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map((product) => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map((product) => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            console.log(value)

                            return 'R$ ' + value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Comparação de Preços',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });

}