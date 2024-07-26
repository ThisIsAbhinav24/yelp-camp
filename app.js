const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session=require("express-session");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const flash=require('connect-flash');


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

const sessionConfig={
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
          }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash("error");
    next();
})

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 505, message = "something went wrong" } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
