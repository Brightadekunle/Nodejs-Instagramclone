

const getProfilePage = (req, res, next)=> {
    res.render('user/user', { title: "Profile" })
}



module.exports = {
    getProfilePage,
}