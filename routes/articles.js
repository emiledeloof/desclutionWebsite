const express = require("express");
const Article = require("./../models/article");
const router = express.Router();
const multer = require("multer");
let fileName = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "views/uploads");
    },
    filename: (req, file, cb) => {
        const {originalname} = file;
        cb(null, originalname);
        fileName = originalname
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

router.get("/schedule", async (req, res) => {
    res.render("pages/schedule");
});

router.post("/", upload.single("audioFile"), async (req, res, next) => {
    req.article = new Article();
    next()
}, saveArticleAndRedirect("new"));

router.put("/:id", async (req, res, next) => {
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
    const articles = await Article.find().sort({ createdAt: "desc"})
    res.render("pages/submission", { articles: articles});
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if(article == null) res.render("pages/submission")
    res.render("pages/show", { article: article })
});

function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.creator = req.body.creator
        article.pathToFile = "uploads/" + fileName
        article.email = req.body.email
        article.discordTag = req.body.discordTag
        try {
            article = await article.save()
            res.render("pages/confirmation");
        } catch (e) {
            res.render(`pages/${path}`, { article: article })
            console.log(e);
        }
    }
}

module.exports = router;