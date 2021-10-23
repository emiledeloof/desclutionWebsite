const express = require("express");
const Article = require("./../models/article");
const router = express.Router();
const multer = require("multer");
let fileName = "";
const Login = require("./../models/login");
let loggedIn = false;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "views/uploads");
    },
    filename: (req, file, cb) => {
        const {originalname} = file;
        cb(null, originalname);
        fileName = originalname;
    }
});

const upload = multer({ storage });

router.get("/new", (req, res) => {
    res.render("pages/new", {article: new Article() })
});

router.get("/edit/:id", async (req, res) =>{
    const article = await Article.findById(req.params.id)
    res.render("pages/edit", {article: article})
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

router.get("/login", (req, res) => {
    res.render("pages/login");
});

// router.post("/login", async (req, res) => {
//     // const loginInfo = await Login.findById(req.params.id);
//     // if(loginInfo.username == req.body.username && loginInfo.password == req.body.password){
//     // if(req.body.username == Login.findOne({username: req.body.username}) && req.body.password == Login.findOne({password: req.body.password})){
//     if(Login.findOne({username: req.body.username}) && Login.findOne({password: req.body.password})){
//         console.log("validated data is correct");
//         console.log(Login.findOne({username: req.body.username}))
//         console.log(Login.findOne({username: req.body.password}))
//         res.redirect("./submission");
//     } else{
//         console.log("validated data is not correct");
//         console.log(Login.findOne({username: req.body.username}));
//         console.log(Login.findOne({password: req.body.password}));
//         // res.redirect("/");
//     }
// });

router.post("/login", async (req, res) => {
    if(req.body.username == process.env.LOGIN_USERNAME && req.body.password == process.env.LOGIN_PASSWORD){
        res.redirect("./submission");
        loggedIn = true
    } else {
        res.redirect("/");
        // console.log(req.body.username, req.body.password)
    }
})

router.post("/", upload.single("audioFile"), async (req, res, next) => {
    req.article = new Article();
    next()
}, saveArticleAndRedirect("new"));

router.put("/:id", upload.single("audioFile"), async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect("edit"));

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect("./submission")
});

router.get("/info", (req, res) => {
    res.render("pages/info");
});

router.get("/contact", (req, res) => {
    res.render("pages/contact");
});

router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect("show"));

router.get("/submission", async (req, res)=> {
    if(loggedIn == true){
        const articles = await Article.find().sort({ createdAt: "desc"})
        res.render("pages/submission", { articles: articles});
    }
    else{
        res.render("./locked");
    }
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if(article == null) res.render("pages/submission")
    res.render("pages/show", { article: article })
});


function saveArticleAndRedirect(path){
    if(path != "edit"){
        return async (req, res) => {
            let article = req.article
            article.title = req.body.title
            article.creator = req.body.creator
            if(fileName != ""){
                console.log(fileName);
                article.pathToFile = "uploads/" + fileName;
            }
            article.email = req.body.email
            article.discordTag = req.body.discordTag
            article.name = req.body.name
            article.comment = req.body.comment
            try {
                if(article.pathToFile != null){
                    article = await article.save()
                    res.render("pages/confirmation");
                }
            } catch (e) {
                res.render(`pages/${path}`, { article: article })
                console.log(e);
            }
        }
    }
    if(path == "edit"){
        return async (req, res) => {
            let article = req.article
            article.title = req.body.title
            article.creator = req.body.creator
            article.email = req.body.email
            article.discordTag = req.body.discordTag
            article.name = req.body.name
            article.comment = req.body.comment
            // if(article.pathToFile != "uploads/" + fileName){
            if(fileName != "" && "uploads/"+ fileName != article.pathToFile){
                article.pathToFile = "uploads/" + fileName
            } else {
                console.log("uploads/" + fileName);
            }
            try {
                article = await article.save()
                res.redirect(`./${article.slug}`);
            } catch (e) {
                res.render(`pages/${path}`, { article: article })
                console.log(e);
            }
        }
    }
}

module.exports = router;