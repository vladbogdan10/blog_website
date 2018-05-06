var express               = require('express'),
    app                   = express();
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    expressSanitizer      = require('express-sanitizer'),
    methodOverried        = require('method-override'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog_app');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverried('_method'));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
  }
);
var Blog = mongoose.model('Blog', blogSchema);

// USER SCHEMA
var userSchema = new mongoose.Schema(
  {
    username: String,
    password: String
  }
);
var User = mongoose.model('User', userSchema);

// RESTFUL ROUTES
app.get('/', function(req, res) {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log('ERROR!');
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newPost) {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, showBlogPost) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: showBlogPost});
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, blogPost) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: blogPost});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlogPost) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

// REGISTER ROUTE
app.get('/register', function(req, res) {
  res.render('register');
});

// SIGN UP LOGIC
app.post('/register', function(req, res) {
  //Handle sign up here.
});

app.listen(5050, function() {
  console.log('Server has started on port: 5050');
});