var roles=require('../roles.js')["roles"];
var listingService = require('../services/listingService.js');
var userService = require('../services/userService.js');


exports.index = function(req, res){
	if (req.body.username) {
        res.render("login.ejs", { username: req.body.username, } );
    } else {
		res.render("login.ejs", { username: "", } );
	}
}


exports.signUp = function(req, res) {
    res.render("signup.ejs");
};

exports.homepage = function(req, res){

	var root=roles[req.decoded._doc.role];
	var user=req.decoded._doc;
	if(root){
		res.render(root+"homepage.ejs", { user:user,token:req.query.token});		
	}
	
}

exports.settings = function(req, res) {
	var user=req.decoded._doc;
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	res.render(root+"settings.ejs", { username: uname,user:user });
}

exports.listings = function(req, res) {
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	listingService.getListings(function(err,listings){
		res.render(root+"listings.ejs", { username: uname,listings:listings });
	})
	
}
exports.createListing = function(req, res) {
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	res.render("ercreateListing.ejs", { username: uname });
}
exports.jobs = function(req, res) {
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	res.render(root+"jobs.ejs", { username: uname });
}

exports.search = function(req, res) {
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	
	res.render(root+"search.ejs", { q: "q", username: uname, listings: "listings" });
}


exports.funds=function(req,res){
	var uname=req.decoded._doc.username;
	var root=roles[req.decoded._doc.role];
	res.render(root+"funds.ejs",{username:uname});
}


exports.review=function(req,res){
	var uname=req.decoded._doc.username;
	res.render("eeReview.ejs",{username:uname});
}


//Admin Routes

exports.ee=function(req,res){
		var uname=req.decoded._doc.username;

		userService.getEmployees(function(users,err){

			res.render("adminemployee.ejs",{username:uname,employees:users});

		});
		
}
exports.er=function(req,res){
		var uname=req.decoded._doc.username;
		userService.getEmployers(function(users,err){
			res.render("adminemployer.ejs",{username:uname,employers:users});
		});
		
}

exports.ping=function(req,res){
	var uname=req.decoded._doc.username;
	res.render("adminping.ejs", { q: "q", username: uname, listings: "listings" });
}

exports.create=function(req,res){
	var uname=req.decoded._doc.username;
	res.render("admincreate.ejs", {username:uname});
}