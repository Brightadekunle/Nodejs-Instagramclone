const { isEmpty } = require('../config/customFunctions')
const path = require('path')
const mongoose = require('mongoose')

const User = require('../models/users')
const Post = require('../models/post')
const Comment = require('../models/comment')
const Notification = require('../models/notification')


const getProfilePage = (req, res, next)=> {
    const success_msg = req.flash('success_message')
    const error_msg = req.flash('error_message')
    req.session.notificationLength = null;
    User.findOne({ username: req.params.username })
        .populate('post')
        .then(user => {
            res.render('user/user', { title: "Profile", user, success_msg, error_msg, loggedInUser: req.user })
        })
        .catch(err => {
            console.log(err)
        })
}

const updateProfileGet = (req, res, next) => {
    if (req.user){
        const error_msg = req.flash('error_message')
        User.findOne({ username: req.user.username })
            .populate('posts')
            .then(user => {
                res.render('user/update_profile', { title: "Update Profile", user, error_msg, success_msg: '' })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        req.flash('error_message', 'Please login!.')
        res.redirect(`/update/${req.user.username}`)
    }
}

const updateProfilePost = async (req, res, next) => {
    if (req.user){
        const username = req.body.username
        const email = req.body.email

        let filename = ''

        if (!isEmpty(req.files)) {
            let file = req.files.profilePicture
            filename = file.name
            let uploadDir = path.join(path.dirname(require.main.filename), '/public/profiles/')
            file.mv(uploadDir+filename, (err) => {
                if (err) throw err
            })
        }
        let picture = "public/profiles/" + filename
        let users = await User.find()
 
        // current bug -  look for another params to add to the user profile page
        User.findOne({ username: req.user.username })
            .then(foundUser => {
                users.forEach(user => {
                    if (user.toString() == foundUser.toString()){
                        let foundUserIndex = users.indexOf(user)
                        users = users.splice(foundUserIndex-1, 1)
                    }
                })
                for (user of users){
                    if (user.email == email){
                        req.flash('error_message', "Email is taken!.")
                        res.redirect(`/update/${foundUser.username}`)
                        
                    } else if (user.username == username) {
                        req.flash('error_message', "Username is taken!.")
                        res.redirect(`/update/${foundUser.username}`)
                    } 
                    else {
                        foundUser.updateOne({ email: email, username: username, profilePicture: picture })
                            .then(result => {
                                req.flash('success_message', 'Profile uploaded successfully!.')
                                res.redirect(`/${username}`)
                            })  
                    }
                }  
            })
    }
}

const postUpload = (req, res, next) => {
    if (req.user){
        const caption = req.body.caption
    
        let filename = ''

        if (!isEmpty(req.files)) {
            let file = req.files.post
            filename = file.name
            let uploadDir = path.join(path.dirname(require.main.filename), '/public/post/')
            file.mv(uploadDir+filename, (err) => {
                if (err) throw err
            })
        }
        let picture = "public/post/" + filename

        User.findOne({ username: req.user.username })
            .then(user => {
                const newPost = new Post({
                    caption: caption,
                    user: user._id,
                    file: picture
                })
                newPost.save()
                    .then(savedPost => {
                        user.posts.push(savedPost.file)
                        user.save()
                            .then(savedUser => {
                                req.flash('success_message', "Post uploaded successfully!.")
                                res.redirect(`/${req.user.username}`)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }
}

const followUser = async (req, res, next) => {

    const follower = await User.findOne({ username: req.user.username })
    
    User.findOne({ username: req.params.username })
        .then(user => {
            if (follower.isFollowing(user)){
                // A flash message that says you are already following the person
                console.log('You are following him')
                req.flash('error_message', "You are already following this person!.")
                res.redirect(`/${user.username}`)
            } else {
                follower.followed.push(user._id)
                follower.save()
                    .then(savedFollower => {
                        user.followers.push(follower._id)
                        user.save()
                            .then(followedUser => {
                                const newNotification = new Notification({
                                    user: followedUser._id,
                                    content: `${savedFollower.username} just followed you`
                                })
                                newNotification.save()
                                    .then(savedNotification => {
                                        followedUser.notifications.push(savedNotification._id)
                                        followedUser.save()
                                            .then(savedFollowedUser => {
                                                res.redirect(`/${user.username}`)
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                })
                                
                            })
                            .catch(err => {
                                console.log(err)
                        })
                    })
                    .catch(err => {
                        console.log(err)
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const unfollowUser = async (req, res, next) => {
    let follower = await User.findOne({ username: req.user.username })
    
    User.findOne({ username: req.params.username })
        .then(user => {
            if (follower.isFollowing(user)){
                user.followers = user.followers.pull(follower._id)
                follower.followed = follower.followed.pull(user._id)
                user.save()
                    .then(savedFollowed =>{
                        follower.save()
                            .then(savedFollower => {
                                res.redirect(`/${savedFollowed.username}`)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                
            }
        })
        .catch(err => {
            console.log(err)
        })
}

const likePost = (req, res, next) => {
    if (req.user){
        User.findOne({ username: req.user.username })
            .then(user => {
                let postId = req.params.postId
                // postId = postId.split(':')[1]
                Post.findOne({ _id: req.params.postId })
                    .then(post => {
                        post.likes += 1
                        console.log(post)
                        post.save()
                            .then(savedPost => {
                                user.likedPost.push(savedPost._id)
                                user.save()
                                    .then(savedUser => {
                                        const newNotification = new Notification({
                                            user: savedPost.user,
                                            content: `${req.user.username} just liked your post`
                                        })
                                        newNotification.save()
                                            .then(savedNotification => {
                                                savedUser.notifications.push(savedNotification._id)
                                                savedUser.save()
                                                res.redirect('/home')
                                            })
                                            .catch(err => {
                                                console.log(err)
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    } else {

    }
}

const unlikePost = (req, res, next) => {
    if (req.user){
        User.findOne({ username: req.user.username })
            .then(user => {
                // let postId = req.params.postId
                // postId = postId.split(':')[1]
                Post.findOne({ _id: req.params.postId })
                    .then(post => {
                        post.likes -= 1
                        post.save()
                            .then(savedPost => {
                                user.likedPost.pull(savedPost._id)
                                user.save()
                                    .then(savedUser => {
                                        res.redirect('/home')
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    } else {

    }
}

const commentPost = (req, res, next) => {
    if (req.user){
        const postId = req.params.postId
        console.log(postId)
        Post.findById({ _id: postId })
            .then(post => {
                const comment = req.body.comment

                const newComment = new Comment({
                    body: comment,
                    user: req.user._id,
                    post: post._id,
                })
                newComment.save()
                    .then(savedComment => {
                        post.comments.push(savedComment._id)
                        post.save()
                            .then(savedPost => {
                                res.redirect('/home')
                            })
                    })
            })
        
    }
}

const replyComment = (req, res, next) => {
    if (req.user){
        const commentId = req.params.commentId
        const reply = req.body.reply
        Comment.findById({ _id: commentId })
            .then(comment => {  
                comment.replies.push({
                    _id: new mongoose.Types.ObjectId(),
                    user: {
                        _id: req.user._id,
                        name: req.user.name,
                        image: req.user.profilePicture
                    },
                    reply: reply,
                    createdAt: new Date().getTime()
                })
                comment.save()
                    .then(savedComment => {
                        res.redirect('/home')
                    })
            })
    }
}

const getNotification = async (req, res, next) => {
    req.session.notificationLength = null;
    if (req.user){
        let user = req.user
        User.findOne({ username: user.username })
            .populate('notifications')
            .then(user => {
                console.log(user)
                user.lastNotificationReadTime = Date.now()
                user.save()
                    .then(user => {
                        res.render('notifications', { title: 'Notifications', user, })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    } else {
        
    }
}

module.exports = {
    getProfilePage,
    updateProfileGet,
    updateProfilePost,
    followUser,
    unfollowUser,
    postUpload,
    likePost,
    unlikePost,
    commentPost,
    replyComment,
    getNotification,
}