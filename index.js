// npm install cheerio for scriping 
// npm install axios for get post,put ,delete http request  

const PORT =process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


const newspapers = [
    {
        name: "thetimes",
        address : "https://www.thetimes.co.uk/environment/climate-change"
    },
    {
        name:"theguardian",
        address : "https://www.theguardian.com/environment/climate-crisis"
    },
    {
        name:"Time of India",
        address : "https://timesofindia.indiatimes.com/topic/climate-change"
    }
]

const articles = []

newspapers.forEach(newspaper=>{
    axios.get(newspaper.address)
        .then(response=>{
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")',html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url,
                    source:newspaper.name
                })
            
            })
        })
})

// scriping 
app.get('/',(req,res)=>{
    res.json("Welcome to change my climate Change Rest Api")
})

app.get('/news',(req,res)=>{

    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    // .then((response)=>{
    //     const html = response.data  // for getting page html
    //     // console.log(html)
    //     const $ = cheerio.load(html)  //this will allows us to pick the elements 
        
    //     $('a:contains("climate")',html).each(function(){
    //         const title = $(this).text()
    //         const url = $(this).attr('href')
    //         articles.push({
    //             title,url
    //         })
        
    //     })
    //     res.json(articles)

    // })

    res.json(articles)

})

app.get('/news/:newspaperId',(req,res)=>{
    const newsPaperId = req.params.newspaperId

    const newspaperAddress =  newspapers.filter(newspaper => newspaper.name == newsPaperId )[0].address

    // console.log(newspaperAddress)

    axios.get(newspaperAddress).then(response=>{
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticle = []

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticle.push({
                title,
                url,
                source : newsPaperId
            })
        })

        res.json(specificArticle)
    })


})



app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})