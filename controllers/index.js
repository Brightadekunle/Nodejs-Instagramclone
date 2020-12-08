


const getHomePage = (req, res, next) => {
    res.render('index.ejs', { title: "Instagram Clone" })
}



module.exports = {
    getHomePage,
}