module.exports = {
    isEmpty: function (obj){
        for(let key in obj){
            if (obj.hasOwnProperty(key)){
                return false
            }
        }
        return true
    }, 

    isAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()){
            return next()
        } else{
            req.flash('error_message', 'Please log in to view this resource')
            res.redirect('/signin')
        }
    }
}