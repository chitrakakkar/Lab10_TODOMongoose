var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');

/* GET home page. */
/* GET home page, a list of incomplete tasks . */
router.get('/', function(req, res, next) {

    Task.find({completed:false}, function(err, tasks){
        if (err) {
            return next(err);
        }
        res.render('index', { title: 'TODO list' , tasks: tasks });
    });
});


router.post('/add', function (req, res, next)
{
    if(!req.body || !req.body.text){
        req.flash('error', 'Please enter some text');
        res.redirect('/');
    }
    else {
        // Save new task with text provided, and completed = false
        var task = {text: req.body.text, completed: false};
        req.task_col.insertOne(task, function (err)

        {
            if (err) {
                return next(err)
            }
            res.redirect('/');
        })
    }
});
// ids have to be an objectid object
router.post('/done', function (req, res,next)
{
    var id = req.body._id;
    Task.findByIdAndUpdate(id, { completed: true},function (err, task) {
            if(err){
                return next(err);
            }
            if(!task)
            {
                var req_err = new Error('Task not found');
                req_err.status =404;
                return next(req_err);
        }
        req.flash('info', 'Market as completed');
        return res.redirect('/');
    })

});

router.get('/completed', function (req, res,next ) {
    Task.find({completed:true},function(err, tasks) {
        if (err) {
            return next(err);
        }
        res.render('tasks_completed', {title: 'Completed Tasks', tasks: tasks});
    })
    
});
router.post('/delete', function(req, res,next){

   Task.findByIdAndRemove(id, function(err,task){

        if (err) {
            return next(err);    //Database errors
        }

        if (!task) {
            var req_err = new Error('Task not found');
            req_err.status = 404;
            return next(req_err);     // Task not found error
        }

        req.flash('info', 'Deleted');
        return res.redirect('/')

    })

});
/* Mark all tasks as done. */
router.post('/alldone', function(req, res, next){

    Task.update( {completed:false}, {completed:true}, {multi:true}, function(err){

        if (err) {
            return next(err);
        }

        req.flash('info', 'All tasks are done!');
        return res.redirect('/')

    });
});



module.exports = router;
